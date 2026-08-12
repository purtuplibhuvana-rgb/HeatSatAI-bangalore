# HeatSatAI — Urban Heat Mitigation Decision Support System

> **ISRO Bharatiya Antariksh Hackathon** · Bengaluru Pilot

An AI-powered Decision Support System that fuses multi-source satellite data with a machine-learning model to predict **Land Surface Temperature (LST)**, identify **urban heat islands**, explain predictions via **SHAP**, and recommend targeted cooling interventions for urban planners.

---

## 🚀 Live Demo

The frontend runs on **TanStack Start** (React 19 + Vite 8) and the backend on **FastAPI**.

| Service | Default URL |
|---------|------------|
| Frontend (dev) | http://localhost:8080 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/api/v1/openapi.json |

---

## 📁 Project Structure

```
HeatSatAI-bangalore/
├── Urban Heat Insight/        # Frontend + FastAPI backend
│   ├── src/
│   │   ├── api/               # FastAPI app (Python)
│   │   │   ├── core/          # Config, settings
│   │   │   ├── services/      # Data loading layer
│   │   │   └── v1/            # Endpoints + Pydantic schemas
│   │   ├── components/        # React UI components
│   │   ├── lib/               # Shared utilities & API client
│   │   └── routes/            # TanStack file-based routes
│   ├── outputs/               # Precomputed inference results (CSV)
│   ├── models/                # Trained ML models (.pkl)
│   └── package.json
├── src/                       # ML training pipeline
│   ├── train.py               # XGBoost training script
│   └── inference.py           # Batch inference script
├── scripts/                   # Data merging utilities
├── requirements.txt           # Python dependencies
└── notebooks/                 # EDA & exploration notebooks
```

---

## ⚡ Quick Start

### 1. Backend (FastAPI)

```bash
# Install Python deps
pip install -r requirements.txt

# Start the API server from the "Urban Heat Insight" folder
cd "Urban Heat Insight"
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend (Vite / TanStack Start)

```bash
cd "Urban Heat Insight"
npm install
npm run dev
# → http://localhost:8080
```

---

## 🛰️ Satellite Datasets

| Dataset | Resolution | Purpose |
|---------|-----------|---------|
| Landsat 8/9 | 30 m | Thermal + multispectral |
| Sentinel-2 | 10 m | NDVI / NDBI indices |
| MODIS LST | 1 km | Daily surface temperature |
| WorldPop | 100 m | Population density |
| OSM Landuse | Vector | Land-cover labels |
| VIIRS Night Lights | 500 m | Anthropogenic heat proxy |

---

## 🤖 ML Pipeline

1. **Feature Engineering** — NDVI, NDBI, Albedo, Night-light intensity, impervious surface %
2. **Model** — XGBoost Regressor (R² = 0.975, RMSE = 0.35 °C)
3. **Explainability** — SHAP TreeExplainer for global + local feature attribution
4. **Inference** — Batch prediction over a 500-point spatial grid

---

## 🖥️ Frontend Pages

| Route | Description |
|-------|------------|
| `/` | Overview dashboard — KPIs, distributions, model summary |
| `/heat-map` | Interactive Leaflet map with prediction grid & hotspots |
| `/analytics` | Hotspot ranking, feature importance, NDVI–LST scatter |
| `/explainability` | SHAP waterfall & global importance charts |
| `/recommendations` | AI-generated cooling interventions by hotspot |
| `/about` | Project background, methodology, tech stack |

---

## 🧰 Tech Stack

**Frontend:** React 19 · TypeScript · TanStack Start · TanStack Router · Tailwind CSS v4 · Recharts · Leaflet · shadcn/ui

**Backend:** Python 3.14 · FastAPI · Pydantic v2 · Pandas · XGBoost · SHAP · Joblib · Uvicorn

---

## 📜 License

MIT — see [LICENSE](LICENSE)
