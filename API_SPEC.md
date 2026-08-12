# HeatSatAI REST API Specification

**Base URL**: `/api/v1`

## Endpoints

### 1. Health Check
`GET /health`
Returns the operational status of the API.
**Response**: `{"status": "ok"}`

### 2. Statistics Overview
`GET /statistics`
Returns top-level KPIs, model metadata, and categorical distribution arrays.
**Response**:
```json
{
  "kpi": { "avgLST": 34.2, ... },
  "temp_distribution": [...],
  "land_cover_dist": [...],
  "heat_category_dist": [...],
  "heat_trend": [...],
  "model_meta": { "algorithm": "XGBoost Regressor + SHAP", ... }
}
```

### 3. Heatmap Grid Data
`GET /heatmap`
Returns the coarse prediction grid cells for map overlays.
**Response**:
```json
[
  { "id": "g-1", "lat": 12.971, "lng": 77.594, "lst": 38.5, "category": "warm" }
]
```

### 4. Hotspots Analytics
`GET /hotspots`
Returns the highest risk, granular urban heat areas.
**Response**:
```json
[
  {
    "id": "hs-001",
    "name": "Location 1",
    "lat": 12.97,
    "lng": 77.59,
    "lst": 46.8,
    "ndvi": 0.28,
    "ndbi": 0.35,
    "population": 5000,
    "landCover": "urban",
    "category": "extreme",
    "risk": "critical",
    "confidence": 0.92,
    "featureContributions": [...],
    "recommendations": [...]
  }
]
```

### 5. Interventions Catalog
`GET /recommendations`
Returns available mitigation strategies.
**Response**:
```json
[
  {
    "id": "r1",
    "title": "Increase Tree Canopy",
    "description": "Plant native shade trees...",
    "impact": 2.8,
    "priority": "high",
    "cost": "low",
    "difficulty": "moderate",
    "category": "Green Infrastructure"
  }
]
```

### 6. Global Feature Importance
`GET /feature-importance`
Returns the SHAP-based feature importance extracted from the model.
**Response**:
```json
[
  { "feature": "NDBI", "importance": 0.28 }
]
```

### 7. Run Live Prediction
`POST /predict`
Run a custom feature vector through the XGBoost model.
**Payload**:
```json
{
  "features": {
    "Aspect": 120.0,
    "Elevation": 850.5,
    "LandCover": 1,
    "NDBI": 0.45,
    "NDVI": 0.12,
    ...
  }
}
```
**Response**:
```json
{
  "lst": 41.2
}
```
