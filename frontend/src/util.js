export async function getNews() {
  const res = await fetch("http://localhost:8000/stories/top", {
    method: "GET",
  });
  return res.json();
}

export async function getStory(id) {
  const res = await fetch(`http://localhost:8000/story/${id}`, {
    method: "GET",
  });
  return res.json();
}
