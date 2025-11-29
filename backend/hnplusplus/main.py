from datetime import timedelta
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from hnplusplus.db import SessionDep, create_db_and_tables
from hnplusplus.model.user import Token, User, UserCreate, UserPublic
from hnplusplus.security import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
    get_password_hash,
)

ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()


@app.on_event("startup")
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
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@app.post("/users/", response_model=UserPublic)
def create_user(user: UserCreate, session: SessionDep) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(**user.model_dump(), hashed_password=hashed_password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user
