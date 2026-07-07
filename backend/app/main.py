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
from app.api.admin import router as admin_router

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

import time
from fastapi import Request

# Simple in-memory rate limiting database: IP -> (request_count, window_start_time)
rate_limit_db = {}
RATE_LIMIT_WINDOW = 60 # seconds
RATE_LIMIT_MAX = 100 # requests

@app.middleware("http")
async def security_middleware(request: Request, call_next):
    # 1. Rate Limiting Check
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    if client_ip in rate_limit_db:
        count, start_time = rate_limit_db[client_ip]
        if now - start_time < RATE_LIMIT_WINDOW:
            if count >= RATE_LIMIT_MAX:
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={"detail": "Too many requests. Please try again in a minute."}
                )
            rate_limit_db[client_ip] = (count + 1, start_time)
        else:
            rate_limit_db[client_ip] = (1, now)
    else:
        rate_limit_db[client_ip] = (1, now)
        
    # 2. NoSQL injection query parameter sanitization
    for k in list(request.query_params.keys()):
        if k.startswith("$"):
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Malformed request parameters: Special operators not allowed."}
            )

    # 2.1 NoSQL injection request body sanitization (QA-001)
    if request.method in ["POST", "PUT", "PATCH"]:
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            try:
                import json
                body_bytes = await request.body()
                
                # Make body available again downstream
                async def receive():
                    return {"type": "http.request", "body": body_bytes, "more_body": False}
                request._receive = receive
                
                if body_bytes:
                    body_json = json.loads(body_bytes)
                    
                    def has_nosql_keys(obj) -> bool:
                        if isinstance(obj, dict):
                            for k, v in obj.items():
                                if k.startswith("$"):
                                    return True
                                if has_nosql_keys(v):
                                    return True
                        elif isinstance(obj, list):
                            for item in obj:
                                if has_nosql_keys(item):
                                    return True
                        return False
                        
                    if has_nosql_keys(body_json):
                        return JSONResponse(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            content={"detail": "Malformed request body: Special NoSQL operators not allowed."}
                        )
            except Exception:
                pass


    # 3. Security Headers Insertion
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = "default-src 'self' http: https: data: 'unsafe-inline' 'unsafe-eval';"
    
    return response


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
app.include_router(admin_router, prefix=settings.API_V1_STR)
