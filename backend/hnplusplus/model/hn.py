from typing import Literal
from pydantic import AnyHttpUrl, BaseModel


class Item(BaseModel):
    id: int  # The item's unique id.
    deleted: bool | None  # true if the item is deleted.
    type: (
        Literal["job", "story", "comment", "poll", "pollopt"] | None
    )  # The type of item. One of "job", "story", "comment", "poll", or "pollopt".
    by: str | None  # The username of the item's author.
    time: int | None  # Creation date of the item, in Unix Time.
    text: str | None  # The comment, story or poll text. HTML.
    dead: bool | None  # true if the item is dead.
    parent: (
        int | None
    )  # The comment's parent: either another comment or the relevant story.
    poll: int | None  # The pollopt's associated poll.
    kids: list[int] | None  # The ids of the item's comments, in ranked display order.
    url: AnyHttpUrl | None  # The URL of the story.
    score: int | None  # The story's score, or the votes for a pollopt.
    title: str | None  # The title of the story, poll or job. HTML.
    parts: list[int] | None  # A list of related pollopts, in display order.
    descendants: int | None  # In the case of stories or polls, the total comment count.
