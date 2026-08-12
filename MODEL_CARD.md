# Model Card: HeatSatAI XGBoost 

## Model Details
- **Model Name:** HeatSatAI_XGBoost
- **Model Version:** 1.0 (Production)
- **Model Type:** Extreme Gradient Boosting Regressor (XGBRegressor)
- **Date Trained:** July 2026
- **Architecture:** 
  - `n_estimators`: 748
  - `max_depth`: 10
  - `learning_rate`: 0.05158
  - `subsample`: 0.7185
  - `colsample_bytree`: 0.8798
  - `min_child_weight`: 7

## Intended Use
- **Primary Use Case:** Predicting Land Surface Temperature (LST) across the Bengaluru metropolitan region using multi-modal geospatial and remote sensing data.
- **Intended Users:** Urban planners, climate resilience officers, and dashboard applications displaying neighborhood heat risks.
- **Out of Scope:** The model is highly localized to Bengaluru's specific geography and climate zone. It should not be directly applied to other cities without retraining and validation on local data.

## Training Data
- **Dataset:** `HeatSatAI.csv` (Canonical subset of Bengaluru feature-engineered data).
- **Size:** 9,695 rows.
- **Features:** 36 features representing satellite indices (NDVI, NDBI), terrain (Elevation, Slope, Aspect), urban density (Nighttime_Lights), and distances to infrastructure.
- **Target Variable:** `LST` (Land Surface Temperature).
- **Data Splitting:** Spatial Block Split (`block_size_deg=0.01`) was utilized to mitigate spatial leakage, holding out 20% of the blocks for testing.

## Performance Metrics
- **Mean Absolute Error (MAE):** 0.2070
- **Root Mean Squared Error (RMSE):** 0.3463
- **R-Squared ($R^2$):** 0.9746

## Ethical Considerations & Limitations
- **Data Biases:** The model relies heavily on satellite proxies (NDVI, NDBI) and OpenStreetMap distances, which may underrepresent informal settlements or newly built infrastructure missing from OSM.
- **Limitations:** Extreme micro-climate variations (e.g., highly localized shading from individual trees or building materials) are beyond the resolution of the block-level prediction.

## Interpretability
- SHAP (SHapley Additive exPlanations) is configured natively (`SHAP_Explainer.pkl`) allowing global and local feature importance mapping.
