from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config.settings import settings
from app.database.connection import init_db, close_db, get_db

# We will import these routers next
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.stories import router as stories_router
from app.api.bookmarks import router as bookmarks_router
from app.api.history import router as history_router
from app.api.search import router as search_router
from app.api.ai import router as ai_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Policy configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()

# Global health check endpoint
@app.get("/api/health", status_code=status.HTTP_200_OK)
async def health_check():
    db_conn = get_db()
    from app.database.connection import is_mock_db
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "mock_json_file" if is_mock_db else "mongodb_atlas",
        "mode": "standalone_hybrid"
    }

# Register Router Modules
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(stories_router, prefix=settings.API_V1_STR)
app.include_router(bookmarks_router, prefix=settings.API_V1_STR)
app.include_router(history_router, prefix=settings.API_V1_STR)
app.include_router(search_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
