from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tinydb import TinyDB, Query
from typing import List, Optional

app = FastAPI()

# CORS middleware to allow React frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Create React App dev server
        "http://127.0.0.1:5173",  # Alternative localhost
        "http://127.0.0.1:3000",  # Alternative localhost
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Initialize TinyDB (file-based NoSQL database)
db = TinyDB('db.json')
Item = Query()

class Task(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskResponse(BaseModel):
    doc_id: int
    title: str
    description: Optional[str] = None
    completed: bool

@app.get("/")
def read_root():
    return {"message": "FastAPI Backend is running!"}

@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks():
    all_tasks = db.all()
    # Add doc_id to each task for the frontend
    tasks_with_ids = []
    for task in all_tasks:
        task_dict = task
        task_dict['doc_id'] = task.doc_id
        tasks_with_ids.append(task_dict)
    return tasks_with_ids

@app.post("/tasks", response_model=TaskResponse)
def create_task(task: Task):
    task_id = db.insert(task.dict())
    return {"doc_id": task_id, **task.dict()}

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: Task):
    if not db.contains(doc_id=task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    db.update(task.dict(), doc_ids=[task_id])
    return {"doc_id": task_id, **task.dict()}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    if not db.contains(doc_id=task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    db.remove(doc_ids=[task_id])
    return {"message": "Task deleted", "id": task_id}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Backend is running"}