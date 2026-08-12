# HeatSatAI Project Structure

```text
d:/perso_pro/HeatSatAI/
├── README.md                          # Project overview and instructions
├── MODEL_CARD.md                      # Details about the trained XGBoost model
├── PROJECT_STRUCTURE.md               # This directory structure documentation
├── requirements.txt                   # Environment dependencies (pip freeze)
│
├── src/                               
│   ├── train.py                       # Modularized training pipeline script
│   └── inference.py                   # Model inference CLI with optional dashboard metadata
│
├── notebooks/
│   └── model_training_fixed.ipynb     # The canonical, validated production notebook
│
├── data/
│   ├── raw/                           # Raw satellite and OSM source data
│   ├── processed/
│   │   └── HeatSatAI_Bengaluru_FeatureEngineered.csv
│   └── final/
│       └── HeatSatAI.csv              # The canonical 43-column training and validation dataset
│
├── models/
│   ├── HeatSatAI_XGBoost.pkl          # Final production XGBoost model
│   └── SHAP_Explainer.pkl             # Trained SHAP explainer for interpretability
│
├── outputs/
│   ├── feature_importance.csv         # Computed feature importance rankings
│   ├── prediction_results.csv         # Predictions on the held-out test set
│   ├── recommendations.csv            # Geospatial heat risk mitigation recommendations
│   └── inference_results.csv          # Output from src/inference.py
│
├── scripts/                           # Upstream data engineering and aggregation scripts
├── docs/                              # Auxiliary documentation (e.g., validation reports)
├── tests/                             # Placeholder for future unit and integration tests
│
└── archive/
    └── HeatStatAI-new-main/           # Deprecated structure, obsolete v1 models, and older outputs
```
