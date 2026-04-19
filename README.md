# AI Feedback Collection Web Application

A full-stack conversational AI feedback system built with **FastAPI (backend)** and **React + Vite (frontend)**.
It enables structured feedback collection through an intelligent chat interface powered by LLMs.

---

## Tech Stack

* **Backend:** FastAPI, SQLAlchemy, PostgreSQL / SQLite
* **Frontend:** React, Vite, TailwindCSS
* **Authentication:** JWT-based
* **AI Integration:** LangChain + Groq (with fallback support)

---

## Key Features

* User authentication (Signup/Login)
* Conversational feedback collection system
* Persistent chat history and structured feedback storage
* AI-powered:

  * Intent classification
  * Sentiment analysis
  * Rating extraction
  * Issue classification
* Fallback logic when API keys are not configured
* Chat-style dashboard UI

---

## Project Structure

```
conversationalfeddback/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## Setup Instructions

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate environment (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env
```

Update `.env` with the following values:

```env
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
GROQ_API_KEY=your_api_key
FRONTEND_ORIGIN=http://localhost:5173
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

Backend will run at:
**[http://localhost:8000](http://localhost:8000)**

---

### Frontend Setup

```bash
cd frontend

# Create environment file
copy .env.example .env

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run at:
**[http://localhost:5173](http://localhost:5173)**

---

## API Base URL

```
http://localhost:8000/api/v1
```

---

## Database Configuration

### Development (SQLite)

```env
DATABASE_URL=sqlite:///./feedback_collector.db
```

### Production (PostgreSQL)

```env
DATABASE_URL=postgresql+psycopg2://user:password@host:port/db_name
```

---

## Notes

* If `GROQ_API_KEY` is not provided, the system will use fallback logic for AI features.
* Ensure the backend is running before starting the frontend.
* CORS is configured using `FRONTEND_ORIGIN`.

---
