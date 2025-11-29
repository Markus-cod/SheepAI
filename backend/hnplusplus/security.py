from datetime import datetime, timedelta, timezone
from typing import Annotated, cast

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from sqlmodel import select

from hnplusplus.db import SessionDep
from hnplusplus.model.user import TokenData, User

SECRET_KEY = "90105f3deb5070350ce2fa50964a5ed125613794483fdbfcaacc2a3fc1038af2"
ALGORITHM = "HS256"


password_hash = PasswordHash.recommended()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password: str | bytes, hashed_password: str | bytes) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password: str | bytes) -> str:
    return password_hash.hash(password)


def get_user(db: SessionDep, username: str) -> User | None:
    statement = select(User).where(User.username == username)
    result = db.exec(statement)
    return result.first()


def authenticate_user(db: SessionDep, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(
    data: dict[str, object], expires_delta: timedelta | None = None
):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    db: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = cast(
            dict[str, object], jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        )
        username = cast(str | None, payload.get("sub"))
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(db, username=cast(str, token_data.username))
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user
