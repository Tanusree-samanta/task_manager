from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    color: str = Field(default="#65513B", max_length=20)
    icon: str = Field(default="folder", max_length=50)
    target_date: Optional[str] = Field(default=None, alias="targetDate")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Project name cannot be empty")
        return trimmed

    model_config = ConfigDict(populate_by_name=True)


class ProjectCreate(ProjectBase):
    id: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    target_date: Optional[str] = Field(None, alias="targetDate")

    model_config = ConfigDict(populate_by_name=True)


class ProjectResponse(ProjectBase):
    id: str
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
