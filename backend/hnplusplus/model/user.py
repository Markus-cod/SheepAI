from __future__ import annotations
from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)


class UserCategoryLink(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    category_id: int | None = Field(
        default=None, foreign_key="category.id", primary_key=True
    )


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    categories: list[Category] = Relationship(
        back_populates="teams", link_model=UserCategoryLink
    )


class UserPublic(UserBase):
    id: int


class UserCreate(UserBase):
    username: str
    password: str


class Category(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
