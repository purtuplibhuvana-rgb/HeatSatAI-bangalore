from pydantic import BaseModel
from typing import List, Optional

class FeatureContribution(BaseModel):
    feature: str
    value: float

class Hotspot(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    lst: float
    ndvi: float
    ndbi: float
    population: int
    landCover: str
    category: str
    risk: str
    confidence: float
    featureContributions: List[FeatureContribution]
    recommendations: List[str]

class GridCell(BaseModel):
    id: str
    lat: float
    lng: float
    lst: float
    category: str

class Recommendation(BaseModel):
    id: str
    title: str
    description: str
    impact: float
    priority: str
    cost: str
    difficulty: str
    category: str

class FeatureImportance(BaseModel):
    feature: str
    importance: float

class PredictRequest(BaseModel):
    features: dict

class PredictResponse(BaseModel):
    lst: float
    
class KpiModel(BaseModel):
    avgLST: float
    maxLST: float
    hotspotCount: int
    avgNDVI: float
    coolingPotential: float
    accuracy: float

class StatisticsResponse(BaseModel):
    kpi: KpiModel
    temp_distribution: List[dict]
    land_cover_dist: List[dict]
    heat_category_dist: List[dict]
    heat_trend: List[dict]
    model_meta: dict
