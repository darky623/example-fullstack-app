import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import tasks


app = FastAPI(title="Task Manager API")

origins_env = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:5173",
)
origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/", tags=["health"])
async def health_check() -> dict:
    return {"status": "ok"}


app.include_router(tasks.router)

