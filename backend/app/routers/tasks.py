from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_session
from .. import models, schemas


router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=List[schemas.TaskRead])
async def list_tasks(
  session: AsyncSession = Depends(get_session),
) -> list[schemas.TaskRead]:
  result = await session.execute(
    select(models.Task).order_by(models.Task.id)
  )
  tasks = result.scalars().all()
  return tasks


@router.post(
  "/",
  response_model=schemas.TaskRead,
  status_code=status.HTTP_201_CREATED,
)
async def create_task(
  task_in: schemas.TaskCreate,
  session: AsyncSession = Depends(get_session),
) -> schemas.TaskRead:
  task = models.Task(**task_in.model_dump())
  session.add(task)
  await session.commit()
  await session.refresh(task)
  return task


@router.get(
  "/{task_id}",
  response_model=schemas.TaskRead,
)
async def get_task(
  task_id: int,
  session: AsyncSession = Depends(get_session),
) -> schemas.TaskRead:
  task = await session.get(models.Task, task_id)
  if not task:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Task not found",
    )
  return task


@router.put(
  "/{task_id}",
  response_model=schemas.TaskRead,
)
async def update_task(
  task_id: int,
  task_in: schemas.TaskUpdate,
  session: AsyncSession = Depends(get_session),
) -> schemas.TaskRead:
  task = await session.get(models.Task, task_id)
  if not task:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Task not found",
    )

  update_data = task_in.model_dump(exclude_unset=True)
  for field, value in update_data.items():
    setattr(task, field, value)

  await session.commit()
  await session.refresh(task)
  return task


@router.delete(
  "/{task_id}",
  status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_task(
  task_id: int,
  session: AsyncSession = Depends(get_session),
) -> Response:
  task = await session.get(models.Task, task_id)
  if not task:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Task not found",
    )

  await session.delete(task)
  await session.commit()
  return Response(status_code=status.HTTP_204_NO_CONTENT)

