import uvicorn
from app.config.settings import settings

if __name__ == "__main__":
    print(f"Starting VELORA Backend on {settings.HOST}:{settings.PORT}...")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
