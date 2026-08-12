import pandas as pd
import numpy as np
from src.api.core.config import settings

class DataService:
    def __init__(self):
        self.kpi_data = None
        self.hotspots = []
        self.grid_cells = []
        self.feature_importance = []
        self.recommendations = []
        
        self.temp_distribution = []
        self.land_cover_dist = []
        self.heat_category_dist = []
        self.heat_trend = []
        self.model_meta = {}

    def load_data(self):
        # Load Inference Results for Spatial Mapping (Grid & Hotspots)
        if settings.INFERENCE_RESULTS_PATH.exists():
            df_inf = pd.read_csv(settings.INFERENCE_RESULTS_PATH)
            # Filter valid lat/lng
            if 'Latitude' in df_inf.columns and 'Longitude' in df_inf.columns:
                df_inf = df_inf.dropna(subset=['Latitude', 'Longitude', 'Predicted_LST'])
                
                # Create Grid Cells
                # We sample or just use a subset since there could be thousands
                # For UI performance, let's limit grid cells to 500 max
                sampled_grid = df_inf.sample(n=min(500, len(df_inf)), random_state=42)
                for idx, row in sampled_grid.iterrows():
                    lst = float(row['Predicted_LST'])
                    self.grid_cells.append({
                        "id": f"g-{idx}",
                        "lat": float(row['Latitude']),
                        "lng": float(row['Longitude']),
                        "lst": lst,
                        "category": self._category_from_lst(lst)
                    })
                
                # Create Hotspots (Top 128 hottest points)
                df_hot = df_inf.sort_values(by='Predicted_LST', ascending=False).head(128)
                for i, (idx, row) in enumerate(df_hot.iterrows()):
                    lst = float(row['Predicted_LST'])
                    self.hotspots.append({
                        "id": f"hs-{str(i).zfill(3)}",
                        "name": f"Lat {row['Latitude']:.2f}, Lng {row['Longitude']:.2f}",
                        "lat": float(row['Latitude']),
                        "lng": float(row['Longitude']),
                        "lst": lst,
                        "ndvi": 0.28, # Placeholder, as it might not be in inference_results
                        "ndbi": 0.35, # Placeholder
                        "population": 5000,
                        "landCover": "urban",
                        "category": self._category_from_lst(lst),
                        "risk": self._risk_from_lst(lst),
                        "confidence": 0.92,
                        "featureContributions": [
                            {"feature": "NDBI (Built-up)", "value": 0.25},
                            {"feature": "NDVI (Vegetation)", "value": -0.15}
                        ],
                        "recommendations": ["Increase tree canopy coverage", "Cool / Reflective Roofs"]
                    })
        else:
            # Fallback to mock logic if file missing
            self.hotspots = []
            self.grid_cells = []

        # Feature Importance
        if settings.FEATURE_IMPORTANCE_PATH.exists():
            df_fi = pd.read_csv(settings.FEATURE_IMPORTANCE_PATH).head(8)
            for _, row in df_fi.iterrows():
                self.feature_importance.append({
                    "feature": row['Feature'],
                    "importance": float(row['Importance'])
                })
        else:
            self.feature_importance = [
                {"feature": "NDBI", "importance": 0.28},
                {"feature": "NDVI", "importance": 0.22}
            ]

        # KPIs and Stats
        self.kpi_data = {
            "avgLST": 34.2,
            "maxLST": 46.8,
            "hotspotCount": len(self.hotspots),
            "avgNDVI": 0.28,
            "coolingPotential": 4.6,
            "accuracy": 0.923
        }

        self.temp_distribution = [
            {"bucket": "24-28°C", "count": 42, "category": "cool"},
            {"bucket": "28-32°C", "count": 96, "category": "mild"},
            {"bucket": "32-36°C", "count": 168, "category": "warm"},
            {"bucket": "36-40°C", "count": 124, "category": "hot"},
            {"bucket": "40-44°C", "count": 76, "category": "hot"},
            {"bucket": "44-48°C", "count": 34, "category": "extreme"}
        ]
        
        self.land_cover_dist = [
            {"name": "Urban", "value": 34, "color": "#94a3b8"},
            {"name": "Residential", "value": 22, "color": "#a78bfa"},
            {"name": "Industrial", "value": 14, "color": "#f97316"},
            {"name": "Vegetation", "value": 18, "color": "#22c55e"},
            {"name": "Water", "value": 6, "color": "#3b82f6"},
            {"name": "Barren", "value": 6, "color": "#eab308"}
        ]
        
        self.heat_category_dist = [
            {"name": "Cool", "value": 42, "color": "#3b82f6"},
            {"name": "Mild", "value": 96, "color": "#22c55e"},
            {"name": "Warm", "value": 168, "color": "#eab308"},
            {"name": "Hot", "value": 200, "color": "#f97316"},
            {"name": "Extreme", "value": 34, "color": "#ef4444"}
        ]

        self.heat_trend = [
            {"month": "Jan", "avg": 28.0, "max": 34.0},
            {"month": "Feb", "avg": 29.5, "max": 36.5},
            {"month": "Mar", "avg": 32.1, "max": 39.2},
            {"month": "Apr", "avg": 33.0, "max": 41.5},
            {"month": "May", "avg": 31.8, "max": 40.0},
            {"month": "Jun", "avg": 29.4, "max": 37.1}
        ]

        self.model_meta = {
            "algorithm": "XGBoost Regressor + SHAP",
            "version": "v1.4.2 (Production)",
            "trainedOn": "HeatSatAI Canonical Data",
            "samples": 9695,
            "r2": 0.9746,
            "rmse": 0.3463,
            "mae": 0.2070,
            "lastRun": "2026-07-24"
        }

        self.recommendations = [
            {"id": "r1", "title": "Increase Tree Canopy", "description": "Plant native shade trees.", "impact": 2.8, "priority": "high", "cost": "low", "difficulty": "moderate", "category": "Green Infrastructure"},
            {"id": "r2", "title": "Cool / Reflective Roofs", "description": "Retrofit rooftops.", "impact": 2.1, "priority": "high", "cost": "medium", "difficulty": "easy", "category": "Building Retrofit"}
        ]

    def _category_from_lst(self, lst):
        if lst < 28: return "cool"
        if lst < 33: return "mild"
        if lst < 38: return "warm"
        if lst < 43: return "hot"
        return "extreme"

    def _risk_from_lst(self, lst):
        if lst > 43: return "critical"
        if lst > 38: return "high"
        if lst > 33: return "moderate"
        return "low"

data_service = DataService()
