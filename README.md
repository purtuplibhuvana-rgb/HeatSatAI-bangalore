# HeatSatAI — Urban Heat Mitigation Decision Support System

> **ISRO Bharatiya Antariksh Hackathon** · Bengaluru Pilot

An AI-powered Decision Support System that fuses multi-source satellite data with a machine-learning model to predict **Land Surface Temperature (LST)**, identify **urban heat islands**, explain predictions via **SHAP**, and recommend targeted cooling interventions for urban planners.

---

## 🚀 Live Deployments

The application is deployed across high-performance cloud infrastructure:

- **Frontend (Vercel):** [https://heatsatai.vercel.app](https://heatsatai.vercel.app)
- **Backend API (Render):** [https://heatsatai-api.onrender.com](https://heatsatai-api.onrender.com)
- **API Documentation:** [Swagger UI](https://heatsatai-api.onrender.com/api/v1/openapi.json)

---

## ✨ Key Features

- **High-Resolution LST Prediction:** Predicts Land Surface Temperature using a highly accurate XGBoost model.
- **Interactive Heat Maps:** Visualizes predictions, current hotspots, and vulnerable zones on an interactive Leaflet map.
- **Explainable AI (XAI):** Utilizes SHAP to break down exactly *why* a specific location is experiencing high heat (e.g., high NDBI vs low NDVI).
- **Targeted Recommendations:** AI-generated cooling interventions (like cool roofs or tree canopy expansion) tailored to specific grid cells.
- **Comprehensive Analytics:** Dashboards tracking KPIs, temperature distributions, and historical heat trends.

---

## 📸 Live Screenshots

*(Replace these placeholders with actual screenshots of your application)*

| Dashboard Overview | Heat Map Visualization |
|:---:|:---:|
| <img src="https://placehold.co/600x400/png?text=Dashboard+Overview" width="100%" alt="Dashboard Screenshot" /> | <img src="https://placehold.co/600x400/png?text=Interactive+Heat+Map" width="100%" alt="Heat Map Screenshot" /> |

| Explainability (SHAP) | Recommendations |
|:---:|:---:|
| <img src="https://placehold.co/600x400/png?text=SHAP+Waterfall+Chart" width="100%" alt="Explainability Screenshot" /> | <img src="https://placehold.co/600x400/png?text=Cooling+Interventions" width="100%" alt="Recommendations Screenshot" /> |

---

## 🏗️ Architecture

```mermaid
graph TD
    subgraph Data Sources
        S1[Landsat 8/9]
        S2[Sentinel-2]
        S3[MODIS LST]
        S4[WorldPop]
        S5[OSM Data]
    end

    subgraph Data Processing Pipeline
        ETL[Data Extraction & Merging]
        FE[Feature Engineering\nNDVI, NDBI, Albedo]
    end

    subgraph Machine Learning Layer
        Model[XGBoost Regressor]
        XAI[SHAP Explainer]
        Infer[Batch Inference]
    end

    subgraph Backend API (FastAPI)
        API[RESTful Endpoints]
        DataService[Data Service Layer]
    end

    subgraph Frontend (React / Vite)
        UI[TanStack Start UI]
        Map[Leaflet Maps]
        Dash[Recharts Dashboards]
    end

    S1 --> ETL
    S2 --> ETL
    S3 --> ETL
    S4 --> ETL
    S5 --> ETL
    
    ETL --> FE
    FE --> Model
    Model --> Infer
    Model --> XAI
    Infer --> DataService
    XAI --> DataService
    
    DataService --> API
    API <-->|JSON Responses| UI
    UI --> Map
    UI --> Dash
```

---

## ⚙️ How It Works

1. **Data Ingestion:** Satellite imagery (thermal and multispectral) and vector data (land use, population) are gathered for the target city (Bengaluru).
2. **Feature Engineering:** Raw data is processed into standardized indices like NDVI (vegetation), NDBI (built-up areas), and surface albedo.
3. **Model Prediction:** The XGBoost model predicts the Land Surface Temperature for a dense grid of points across the city.
4. **Insight Generation:** SHAP values are computed to understand feature contributions, and localized recommendations are generated based on land-cover types and heat severity.
5. **Visualization:** The FastAPI backend serves these precomputed insights to a highly responsive React frontend, allowing urban planners to interact with the data in real-time.

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

## ⚡ Quick Start (Local Development)

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

## 🧰 Tech Stack

**Frontend:** React 19 · TypeScript · TanStack Start · TanStack Router · Tailwind CSS v4 · Recharts · Leaflet · shadcn/ui

**Backend:** Python 3.10+ · FastAPI · Pydantic v2 · Pandas · XGBoost · SHAP · Joblib · Uvicorn

---

## 🙌 Credits & Acknowledgments

- Developed for the **ISRO Bharatiya Antariksh Hackathon**.
- Satellite data accessed via Google Earth Engine and ISRO Bhuvan portals.
- OpenStreetMap contributors for vector data.

---

## 📜 License

MIT — see [LICENSE](LICENSE)
