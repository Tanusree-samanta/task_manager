import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import or_, select
from sqlalchemy.orm import Session
from app.models.subtask import Subtask
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


class TaskService:
    @staticmethod
    def get_by_id(db: Session, task_id: str) -> Optional[Task]:
        """Fetch a single task by ID with its subtasks loaded."""
        stmt = select(Task).where(Task.id == task_id)
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def get_multi(
        db: Session,
        completed: Optional[bool] = None,
        priority: Optional[str] = None,
        project_id: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[Task]:
        """Fetch tasks with optional filtering, search, and pagination."""
        stmt = select(Task)

        if completed is not None:
            stmt = stmt.where(Task.completed == completed)
        if priority is not None:
            stmt = stmt.where(Task.priority == priority)
        if project_id is not None:
            stmt = stmt.where(Task.project_id == project_id)
        if search:
            q = f"%{search.strip().lower()}%"
            stmt = stmt.where(
                or_(
                    Task.title.ilike(q),
                    Task.description.ilike(q),
                    Task.category.ilike(q),
                )
            )

        # Order by completed ascending, then created_at descending
        stmt = stmt.order_by(Task.completed.asc(), Task.created_at.desc())
        stmt = stmt.offset(offset).limit(limit)

        return list(db.execute(stmt).scalars().all())

    @staticmethod
    def create(db: Session, task_in: TaskCreate) -> Task:
        """Create a new task record along with any initial subtasks."""
        task_id = task_in.id or str(uuid.uuid4())
        now = datetime.now(timezone.utc)

        db_task = Task(
            id=task_id,
            title=task_in.title,
            description=task_in.description,
            completed=task_in.completed,
            priority=task_in.priority,
            due_date=task_in.due_date,
            due_time=task_in.due_time,
            project_id=task_in.project_id,
            category=task_in.category,
            tags=task_in.tags or [],
            reminder=task_in.reminder,
            recurring=task_in.recurring,
            notes=task_in.notes,
            completed_at=task_in.completed_at,
            created_at=now,
            updated_at=now,
        )

        # Attach subtasks if provided
        for sub_in in task_in.subtasks:
            sub_id = sub_in.id or str(uuid.uuid4())
            db_sub = Subtask(
                id=sub_id,
                task_id=task_id,
                title=sub_in.title,
                completed=sub_in.completed,
                created_at=now,
            )
            db_task.subtasks.append(db_sub)

        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def update(db: Session, db_task: Task, task_in: TaskUpdate) -> Task:
        """Update an existing task with partial fields and subtasks synchronization."""
        update_data = task_in.model_dump(exclude_unset=True)
        now = datetime.now(timezone.utc)

        # Handle subtasks update if provided
        if "subtasks" in update_data and update_data["subtasks"] is not None:
            subtasks_data = update_data.pop("subtasks")
            # Replace existing subtasks cleanly
            db_task.subtasks.clear()
            for sub_dict in subtasks_data:
                sub_id = sub_dict.get("id") or str(uuid.uuid4())
                new_sub = Subtask(
                    id=sub_id,
                    task_id=db_task.id,
                    title=sub_dict["title"],
                    completed=sub_dict.get("completed", False),
                    created_at=now,
                )
                db_task.subtasks.append(new_sub)

        # Handle completed_at timestamp automatically if completed changed
        if "completed" in update_data:
            if update_data["completed"] and not db_task.completed_at:
                update_data["completed_at"] = now.strftime("%I:%M %p")
            elif not update_data["completed"]:
                update_data["completed_at"] = None

        # Apply scalar updates
        for field, value in update_data.items():
            setattr(db_task, field, value)

        db_task.updated_at = now

        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task

    @staticmethod
    def delete(db: Session, db_task: Task) -> None:
        """Delete a task and cascade to its subtasks."""
        db.delete(db_task)
        db.commit()


task_service = TaskService()
