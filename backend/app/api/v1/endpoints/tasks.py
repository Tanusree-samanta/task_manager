from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services.task_service import task_service

router = APIRouter()


@router.get("", response_model=List[TaskResponse], summary="List all tasks")
def list_tasks(
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    priority: Optional[str] = Query(None, description="Filter by priority (low, medium, high)"),
    project_id: Optional[str] = Query(None, alias="projectId", description="Filter by project ID"),
    search: Optional[str] = Query(None, description="Search keyword in title, description, category"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of tasks to return"),
    offset: int = Query(0, ge=0, description="Offset pagination index"),
    db: Session = Depends(get_db),
):
    """
    Retrieve tasks with optional filtering by completion status, priority,
    project ID, or search keyword.
    """
    tasks = task_service.get_multi(
        db=db,
        completed=completed,
        priority=priority,
        project_id=project_id,
        search=search,
        limit=limit,
        offset=offset,
    )
    return tasks


@router.get("/{task_id}", response_model=TaskResponse, summary="Get task by ID")
def get_task(
    task_id: str,
    db: Session = Depends(get_db),
):
    """
    Retrieve detailed task data including subtasks by task ID.
    Returns 404 if the task does not exist.
    """
    task = task_service.get_by_id(db=db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' was not found.",
        )
    return task


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new task record with validation and initial subtasks.
    """
    return task_service.create(db=db, task_in=task_in)


@router.patch("/{task_id}", response_model=TaskResponse, summary="Update task")
def update_task(
    task_id: str,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
):
    """
    Update fields on an existing task (e.g. title, completion status, due date, subtasks).
    Returns 404 if the task does not exist.
    """
    db_task = task_service.get_by_id(db=db, task_id=task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' was not found.",
        )
    return task_service.update(db=db, db_task=db_task, task_in=task_in)


@router.delete("/{task_id}", status_code=status.HTTP_200_OK, summary="Delete task")
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
):
    """
    Delete a task and its associated subtasks.
    Returns 404 if the task does not exist.
    """
    db_task = task_service.get_by_id(db=db, task_id=task_id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' was not found.",
        )
    task_service.delete(db=db, db_task=db_task)
    return {"message": "Task deleted successfully", "id": task_id}
