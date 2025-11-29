from __future__ import annotations
from typing import TypeAlias
from pydantic import BaseModel, HttpUrl


class Card(BaseModel):
    id: int
    title: str
    desc: str
    url: HttpUrl


class RichPresenceReq(BaseModel):
    id: int


class RichPresenceResp(BaseModel):
    sections: list[Section]


class VideoSection(BaseModel):
    url: HttpUrl


class ImageSection(BaseModel):
    alt: str
    url: HttpUrl


class ParagraphSection(BaseModel):
    content: str


class CodeSection(BaseModel):
    content: str


class TitleSection(BaseModel):
    title: str
    min_read: int
    topic: list[str]


class SubtitleSection(BaseModel):
    content: str


class CommentSection(BaseModel):
    comments: list[Comment]


class Comment(BaseModel):
    upvotes: int
    comment: str
    author: str
    time: int


Section: TypeAlias = (
    VideoSection
    | ImageSection
    | ParagraphSection
    | CodeSection
    | TitleSection
    | SubtitleSection
    | CommentSection
)
