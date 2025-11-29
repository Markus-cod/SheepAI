from datetime import timedelta
from functools import lru_cache
from textwrap import dedent
from typing import Annotated, Literal
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import select
from huggingface_hub import InferenceClient

from hnplusplus.config import Settings
from hnplusplus.db import SessionDep, create_db_and_tables
from hnplusplus.model.user import Category, Token, User, UserCreate, UserPublic
from hnplusplus.security import (
    UserDep,
    authenticate_user,
    create_access_token,
    get_password_hash,
)
from hnplusplus.utils.hn import get_stories_sorted_by, get_story

ACCESS_TOKEN_EXPIRE_MINUTES = 30


@lru_cache()
def get_settings():
    return Settings()  # pyright: ignore[reportCallIssue]


SettingsDep = Annotated[Settings, Depends(get_settings)]


app = FastAPI()


@app.on_event("startup")  # pyright: ignore[reportDeprecated]
def on_startup():
    create_db_and_tables()


@app.post("/token")
async def login_for_access_token(
    db: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@app.get("/users/me/items/", response_model=UserPublic)
async def read_own_items(
    current_user: UserDep,
):
    return current_user


@app.post("/users/", response_model=UserPublic)
def create_user(user: UserCreate, session: SessionDep) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        **user.model_dump(),  # pyright: ignore[reportAny]
        hashed_password=hashed_password,
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


@app.post("/users/me/category/")
def add_category(
    db: SessionDep,
    user: UserDep,
    category: str,
):
    stmt = select(Category).where(Category.name == category)
    existing = db.exec(stmt).first()
    if existing:
        db_category = existing
    else:
        db_category = Category(name=category)
        db.add(db_category)
        db.commit()
        db.refresh(db_category)

    if db_category not in user.categories:
        user.categories.append(db_category)
        db.add(user)
        db.commit()
        db.refresh(user)


@app.get("/summarize")
def summarize(_: UserDep, settings: SettingsDep, id: int) -> str:
    story = get_story(id)
    if story is None or story.title is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    client = InferenceClient(token=settings.hf_api_key)
    response = client.summarization(
        dedent(
            f"""\
    Title: {story.title}
    """
        )
    )

    return response.summary_text


@app.get("/stories/{sorted_by}")
def get_stories(sorted_by: Literal["top", "new", "best"]) -> list[int]:
    return get_stories_sorted_by(sorted_by)
