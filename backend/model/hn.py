from typing import Literal
from pydantic import BaseModel, HttpUrl


class Item(BaseModel):
    id: int  # The item's unique id.
    deleted: bool  # true if the item is deleted.
    type: Literal[
        "job", "story", "comment", "poll", "pollopt"
    ]  # The type of item. One of "job", "story", "comment", "poll", or "pollopt".
    by: str  # The username of the item's author.
    time: int  # Creation date of the item, in Unix Time.
    text: str  # The comment, story or poll text. HTML.
    dead: bool  # true if the item is dead.
    parent: (
        int | None
    )  # The comment's parent: either another comment or the relevant story.
    poll: int | None  # The pollopt's associated poll.
    kids: int | None  # The ids of the item's comments, in ranked display order.
    url: HttpUrl | None  # The URL of the story.
    score: int  # The story's score, or the votes for a pollopt.
    title: str  # The title of the story, poll or job. HTML.
    parts: list[int]  # A list of related pollopts, in display order.
    descendants: int | None  # In the case of stories or polls, the total comment count.
