from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.src.core.config import settings
from backend.src.core.database import init_db, close_db
from backend.src.routers import chat, admin, categories, auth, feedback, multimedia
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="AI Assistant API with OpenAI integration"
)

# Configure CORS
origins = settings.get_cors_origins()
logger.info(f"Configuring CORS with origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    try:
        logger.info("Starting up application...")
        await init_db()
        logger.info("✅ Database initialized")
        logger.info(f"✅ CORS configured with origins: {origins}")
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    await close_db()
    logger.info("✅ Database connection closed")

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["categories"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(feedback.router, prefix="/api/v1/feedback", tags=["feedback"])
app.include_router(multimedia.router, prefix="/api/v1/multimedia", tags=["multimedia"])

@app.get("/")
async def root():
    return {"message": "AI Help Center API is running", "docs_url": "/docs", "version": "1.0.0"} 