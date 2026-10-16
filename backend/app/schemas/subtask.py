from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class SubtaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Subtask step description")
    completed: bool = False

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Subtask title cannot be empty")
        return trimmed


class SubtaskCreate(SubtaskBase):
    id: Optional[str] = None


class SubtaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    completed: Optional[bool] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            if not trimmed:
                raise ValueError("Subtask title cannot be empty")
            return trimmed
        return v


class SubtaskResponse(SubtaskBase):
    id: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
