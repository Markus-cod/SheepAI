# {Project Name}

A full-stack web application with FastAPI backend and React frontend.

## Features

- FastAPI backend with automatic API documentation
- React frontend with Chakra UI
- TinyDB for simple NoSQL data storage
- CORS configured for frontend-backend communication
- Real-time task management

## Technology Stack

- Backend: FastAPI, Python, TinyDB
- Frontend: React, Chakra UI, Vite, Axios
- Development: Hot reloading for both frontend and backend

## Project Structure

```
sheepai-20251129/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── db.json
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── App.css
    ├── package.json
    └── vite.config.js
```

## Installation Guide

### Prerequisites

` Python 3.8 or higher `
` Node.js 18 or higher `

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Running the Application

1. Start the backend server first:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

2. Then start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## API Endpoints

 - `GET /tasks` - Get all tasks
 - `POST /tasks` - Create a new task
 - `PUT /tasks/{id}` - Update a task
 - `DELETE /tasks/{id}` - Delete a task
 - `GET /health` - Health check

## Development

The backend supports hot reloading - any changes to `main.py` will automatically restart the server.
The frontend uses Vite for fast development with hot module replacement.