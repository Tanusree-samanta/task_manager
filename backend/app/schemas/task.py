from typing import List, Optional, Literal
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.schemas.subtask import SubtaskCreate, SubtaskResponse


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Task title")
    description: Optional[str] = None
    completed: bool = False
    priority: Literal["low", "medium", "high"] = "medium"
    due_date: Optional[str] = Field(None, alias="dueDate")
    due_time: Optional[str] = Field(None, alias="dueTime")
    project_id: Optional[str] = Field(None, alias="projectId")
    category: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    reminder: Optional[str] = None
    recurring: Literal["none", "daily", "weekdays", "weekly", "monthly"] = "none"
    notes: Optional[str] = None
    completed_at: Optional[str] = Field(None, alias="completedAt")

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Task title cannot be empty or whitespace only")
        return trimmed

    model_config = ConfigDict(populate_by_name=True)


class TaskCreate(TaskBase):
    id: Optional[str] = None
    subtasks: List[SubtaskCreate] = Field(default_factory=list)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[Literal["low", "medium", "high"]] = None
    due_date: Optional[str] = Field(None, alias="dueDate")
    due_time: Optional[str] = Field(None, alias="dueTime")
    project_id: Optional[str] = Field(None, alias="projectId")
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    reminder: Optional[str] = None
    recurring: Optional[Literal["none", "daily", "weekdays", "weekly", "monthly"]] = None
    notes: Optional[str] = None
    completed_at: Optional[str] = Field(None, alias="completedAt")
    subtasks: Optional[List[SubtaskCreate]] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            if not trimmed:
                raise ValueError("Task title cannot be empty or whitespace only")
            return trimmed
        return v

    model_config = ConfigDict(populate_by_name=True)


class TaskResponse(TaskBase):
    id: str
    subtasks: List[SubtaskResponse] = Field(default_factory=list)
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
