from typing import Literal
from pydantic import BaseModel


class Item(BaseModel):
    id: int  # The item's unique id.
    deleted: bool | None = None  # true if the item is deleted.
    type: Literal["job", "story", "comment", "poll", "pollopt"] | None = (
        None  # The type of item. One of "job", "story", "comment", "poll", or "pollopt".
    )
    by: str | None = None  # The username of the item's author.
    time: int | None = None  # Creation date of the item, in Unix Time.
    text: str | None = None  # The comment, story or poll text. HTML.
    dead: bool | None = None  # true if the item is dead.
    parent: int | None = (
        None  # The comment's parent: either another comment or the relevant story.
    )
    poll: int | None = None  # The pollopt's associated poll.
    kids: list[int] | None = (
        None  # The ids of the item's comments, in ranked display order.
    )
    url: str | None = None  # The URL of the story.
    score: int | None = None  # The story's score, or the votes for a pollopt.
    title: str | None = None  # The title of the story, poll or job. HTML.
    parts: list[int] | None = None  # A list of related pollopts, in display order.
    descendants: int | None = (
        None  # In the case of stories or polls, the total comment count.
    )
