from datetime import datetime, timezone
import enum

from sqlalchemy import Column, DateTime, Enum, Integer, String, Text

from .database import Base


class TaskStatus(str, enum.Enum):
  pending = "pending"
  in_progress = "in_progress"
  done = "done"


class Task(Base):
  __tablename__ = "tasks"

  id = Column(Integer, primary_key=True, index=True)
  title = Column(String(255), nullable=False)
  description = Column(Text, nullable=True)
  status = Column(
    Enum(TaskStatus, name="task_status"),
    nullable=False,
    default=TaskStatus.pending,
  )
  created_at = Column(
    DateTime(timezone=True),
    nullable=False,
    default=lambda: datetime.now(timezone.utc),
  )

