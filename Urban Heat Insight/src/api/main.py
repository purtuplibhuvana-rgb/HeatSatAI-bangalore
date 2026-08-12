import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.core.config import settings
from src.api.v1.endpoints import router as v1_router
from src.api.services.data_service import data_service

# Configure Structured Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="HeatSatAI API for urban heat analytics and prediction.",
    version="1.0.0"
)

# Set all CORS enabled origins
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up HeatSatAI API...")
    logger.info("Loading precomputed data...")
    try:
        data_service.load_data()
        logger.info(f"Loaded {len(data_service.hotspots)} hotspots and {len(data_service.grid_cells)} grid cells.")
    except Exception as e:
        logger.error(f"Error loading precomputed data: {e}")

app.include_router(v1_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
