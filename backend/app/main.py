from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.api.v1.api import api_router
import app.models  # Register models for metadata


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Ensures database tables exist on startup if running in simple dev environments.
    """
    try:
        # Create tables automatically if running without migrations
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        print(f"Notice: Initial table check/creation skipped: {exc}")
    yield


app = FastAPI(
    title="DevOpsForge Task Management API",
    description=(
        "Production-ready FastAPI backend for DevOpsForge Task Manager, "
        "backed by PostgreSQL and SQLAlchemy 2.x."
    ),
    version="2.14.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Explicit CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount API endpoints under /api
app.include_router(api_router, prefix="/api")


@app.get("/", include_in_schema=False)
def root():
    return {
        "app": "DevOpsForge Task Manager API",
        "version": "2.14.0",
        "docs": "/docs",
        "health": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
    )
