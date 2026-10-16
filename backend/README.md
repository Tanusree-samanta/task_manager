# DevOpsForge — FastAPI & PostgreSQL Backend

This directory contains the production-grade Python FastAPI backend for **DevOpsForge Task Manager**, integrated with PostgreSQL via SQLAlchemy 2.x and Alembic.

---

## 🛠 Tech Stack

- **Python 3.10+** (Full support for macOS Apple Silicon ARM64 / M1 / M2 / M3 / M4)
- **FastAPI**: Modern, high-performance web framework for building APIs.
- **Pydantic v2**: Strict data validation and schema serialization.
- **SQLAlchemy 2.x**: Declarative ORM and relationship management.
- **PostgreSQL**: Primary relational database with foreign keys, indexes, and cascades.
- **Alembic**: Database schema migrations.
- **Pytest**: Isolated automated test suite.

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI application entrypoint & CORS
│   ├── config.py                   # Pydantic Settings & environment variables
│   ├── database.py                 # SQLAlchemy 2.x engine & get_db session dependency
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── api.py              # Root router for v1 endpoints
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           ├── health.py       # GET /api/health with DB connectivity check
│   │           └── tasks.py        # Task CRUD endpoints (GET, POST, PATCH, DELETE)
│   ├── models/
│   │   ├── __init__.py
│   │   ├── task.py                 # Task SQLAlchemy model
│   │   ├── subtask.py              # Subtask model with cascade delete
│   │   └── project.py              # Project model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── task.py                 # Pydantic schemas (TaskCreate, TaskUpdate, TaskResponse)
│   │   ├── subtask.py              # Subtask schemas
│   │   └── project.py              # Project schemas
│   └── services/
│       ├── __init__.py
│       └── task_service.py         # Business logic & database operations
├── tests/
│   ├── __init__.py
│   ├── conftest.py                 # Isolated test database fixture & TestClient
│   ├── test_health.py              # Health check endpoint test
│   └── test_tasks.py               # Comprehensive CRUD, validation & persistence tests
├── alembic/
│   ├── env.py                      # Alembic runtime environment
│   ├── script.py.mako              # Migration file template
│   └── versions/
│       └── 001_initial_tasks_tables.py  # Initial table migration
├── alembic.ini                     # Alembic configuration
├── requirements.txt                # Python package dependencies
└── .env.example                    # Sample environment variables
```

---

## 🚀 Local Development Setup (macOS Apple Silicon)

Follow these exact steps to run the backend and connect PostgreSQL on macOS:

### 1. Install System Dependencies (via Homebrew)

If Homebrew is not installed, install it from https://brew.sh. Then run:

```bash
# Install Python 3.11/3.12 and PostgreSQL 16
brew install python@3.11 postgresql@16

# Start PostgreSQL background service
brew services start postgresql@16
```

### 2. Create the Database

```bash
# Create the devopsforge PostgreSQL database
createdb devopsforge
```

### 3. Set Up Python Virtual Environment

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Upgrade pip and install all backend requirements
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
# Copy example environment configuration
cp .env.example .env
```

Open `.env` in your text editor and verify database credentials:
```ini
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devopsforge
```
*(On macOS Homebrew PostgreSQL default installations, `DB_USER=$(whoami)` with no password is often default, or `postgres` with empty/configured password).*

### 5. Run Database Migrations

Apply the initial schema to create `projects`, `tasks`, and `subtasks` tables:

```bash
alembic upgrade head
```

### 6. Start the FastAPI Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will be available at:
- **API Base**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **Health Check**: `http://localhost:8000/api/health`

---

## 🧪 Running Automated Tests

Run the complete test suite with Pytest:

```bash
pytest -v
```

All tests execute against an isolated in-memory test database fixture so development and production databases are never touched.

---

## 🌐 Connecting the Frontend

From the root project directory:

```bash
# Install frontend packages (if not already done)
npm install

# Start the Vite development server on port 3000
npm run dev
```

Vite proxies all `/api/*` network requests directly to `http://localhost:8000/api/*`.
