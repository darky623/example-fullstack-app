from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from .models import TaskStatus


class TaskBase(BaseModel):
  title: str
  description: Optional[str] = None
  status: TaskStatus = TaskStatus.pending


class TaskCreate(TaskBase):
  pass


class TaskUpdate(BaseModel):
  title: Optional[str] = None
  description: Optional[str] = None
  status: Optional[TaskStatus] = None


class TaskRead(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: int
  title: str
  description: Optional[str] = None
  status: TaskStatus
  created_at: datetime

