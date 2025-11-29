from typing import Literal
from hnplusplus.model.hn import Item
import requests

HN_URL = "https://hacker-news.firebaseio.com/v0"


def get_story(id: int) -> Item | None:
    item = get_item(id)
    if item.type != "story":
        return None
    return item


def get_item(id: int) -> Item:
    response = requests.get(f"{HN_URL}/item/{id}.json")
    return response.json()


def get_stories_sorted_by(sorted_by: Literal["new", "top", "best"]) -> list[int]:
    response = requests.get(f"{HN_URL}/{sorted_by}stories.json")
    return response.json()
