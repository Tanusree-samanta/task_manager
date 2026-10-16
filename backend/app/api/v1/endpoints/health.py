from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter()


@router.get("/health", summary="Health check")
def check_health(db: Session = Depends(get_db)):
    """
    Service health check endpoint.
    Verifies that the FastAPI process is running and the PostgreSQL database is reachable.
    """
    database_status = "healthy"
    try:
        # Execute lightweight ping query
        db.execute(text("SELECT 1"))
    except Exception as exc:
        database_status = f"unreachable ({type(exc).__name__})"

    return {
        "status": "healthy" if database_status == "healthy" else "degraded",
        "service": "DevOpsForge Task Management API",
        "database": database_status,
    }
