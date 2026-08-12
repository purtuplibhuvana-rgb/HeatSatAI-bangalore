from pydantic_settings import BaseSettings
import pathlib

ROOT_DIR = pathlib.Path(__file__).resolve().parent.parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "HeatSatAI API"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = ["*"]
    
    # File Paths
    MODEL_PATH: pathlib.Path = ROOT_DIR / "models" / "HeatSatAI_XGBoost.pkl"
    SHAP_PATH: pathlib.Path = ROOT_DIR / "models" / "SHAP_Explainer.pkl"
    INFERENCE_RESULTS_PATH: pathlib.Path = ROOT_DIR / "outputs" / "inference_results.csv"
    PREDICTION_RESULTS_PATH: pathlib.Path = ROOT_DIR / "outputs" / "prediction_results.csv"
    FEATURE_IMPORTANCE_PATH: pathlib.Path = ROOT_DIR / "outputs" / "feature_importance.csv"
    RECOMMENDATIONS_PATH: pathlib.Path = ROOT_DIR / "outputs" / "recommendations.csv"

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()
