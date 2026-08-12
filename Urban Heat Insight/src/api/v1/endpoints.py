from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from src.api.v1 import schemas
from src.api.services.data_service import data_service
import pandas as pd
import joblib

router = APIRouter()

@router.get("/health", response_model=Dict[str, str])
async def get_health():
    """Health check endpoint."""
    return {"status": "ok"}

@router.get("/statistics", response_model=schemas.StatisticsResponse)
async def get_statistics():
    """Returns top-level KPIs and distributions."""
    if not data_service.kpi_data:
        raise HTTPException(status_code=500, detail="Data not loaded.")
    return {
        "kpi": data_service.kpi_data,
        "temp_distribution": data_service.temp_distribution,
        "land_cover_dist": data_service.land_cover_dist,
        "heat_category_dist": data_service.heat_category_dist,
        "heat_trend": data_service.heat_trend,
        "model_meta": data_service.model_meta
    }

@router.get("/heatmap", response_model=List[schemas.GridCell])
async def get_heatmap():
    """Returns grid cells for the interactive heatmap."""
    return data_service.grid_cells

@router.get("/hotspots", response_model=List[schemas.Hotspot])
async def get_hotspots():
    """Returns the top hottest localized areas."""
    return data_service.hotspots

@router.get("/recommendations", response_model=List[schemas.Recommendation])
async def get_recommendations(hotspot_id: str | None = None):
    """Returns recommendations, optionally filtered by hotspot."""
    if hotspot_id:
        # Simple deterministic variation: select recommendation based on hotspot id hash
        try:
            idx = int(''.join(filter(str.isdigit, hotspot_id))) % len(data_service.recommendations)
        except Exception:
            idx = 0
        return [data_service.recommendations[idx]]
    return data_service.recommendations

@router.get("/feature-importance", response_model=List[schemas.FeatureImportance])
async def get_feature_importance():
    """Returns global feature importances for the model."""
    return data_service.feature_importance

@router.post("/predict", response_model=schemas.PredictResponse)
async def predict_lst(request: schemas.PredictRequest):
    """Predicts LST for a given set of features."""
    try:
        from src.api.core.config import settings
        # Load the model dynamically for predictions
        model = joblib.load(settings.MODEL_PATH)
        df = pd.DataFrame([request.features])
        
        # Ensure column order matches model expectations
        expected_features = list(model.feature_names_in_)
        missing = [f for f in expected_features if f not in df.columns]
        if missing:
            raise HTTPException(status_code=400, detail=f"Missing features: {missing}")
            
        df = df[expected_features]
        prediction = model.predict(df)[0]
        return {"lst": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
