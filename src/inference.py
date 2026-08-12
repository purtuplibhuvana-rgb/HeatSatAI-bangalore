import argparse
import pandas as pd
import joblib
import pathlib

ROOT_DIR = pathlib.Path(__file__).resolve().parent.parent
DEFAULT_MODEL_PATH = ROOT_DIR / "models" / "HeatSatAI_XGBoost.pkl"
DEFAULT_INPUT_PATH = ROOT_DIR / "data" / "final" / "HeatSatAI.csv"
DEFAULT_OUTPUT_PATH = ROOT_DIR / "outputs" / "inference_results.csv"

def prepare_data(df):
    drop_columns = [
        "LST", "system:index", ".geo", "Latitude", "Longitude",
        "Heat_Risk_Index", "Urban_Heat_Intensity"
    ]
    drop_columns = [c for c in drop_columns if c in df.columns]
    X = df.drop(columns=drop_columns)
    
    # Ensure correct column order if possible, though XGBoost with feature names will handle it
    return X

def main():
    parser = argparse.ArgumentParser(description="HeatSatAI Inference Script")
    parser.add_argument("--input", type=str, default=str(DEFAULT_INPUT_PATH), help="Path to input CSV")
    parser.add_argument("--output", type=str, default=str(DEFAULT_OUTPUT_PATH), help="Path to save predictions CSV")
    parser.add_argument("--model", type=str, default=str(DEFAULT_MODEL_PATH), help="Path to trained XGBoost model (.pkl)")
    parser.add_argument("--include-metadata", action="store_true", help="Include geospatial metadata in output for dashboard")
    args = parser.parse_args()

    input_path = pathlib.Path(args.input)
    output_path = pathlib.Path(args.output)
    model_path = pathlib.Path(args.model)

    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")

    print(f"Loading data from {input_path}...")
    df = pd.read_csv(input_path)

    print(f"Loading model from {model_path}...")
    model = joblib.load(model_path)

    X = prepare_data(df)
    
    # Check if feature names match
    model_features = list(model.feature_names_in_)
    missing_features = [f for f in model_features if f not in X.columns]
    if missing_features:
        raise ValueError(f"Input data is missing required features: {missing_features}")
    
    # Select only the features the model expects, in the correct order
    X = X[model_features]

    print("Running predictions...")
    preds = model.predict(X)

    output_path.parent.mkdir(parents=True, exist_ok=True)

    if args.include_metadata:
        print("Including metadata for dashboard...")
        # Keep identifier and geospatial columns for dashboard mapping
        meta_cols = ["system:index", ".geo", "Latitude", "Longitude"]
        meta_cols = [c for c in meta_cols if c in df.columns]
        out_df = df[meta_cols].copy()
        out_df["Predicted_LST"] = preds
    else:
        out_df = pd.DataFrame({"Predicted_LST": preds})

    print(f"Saving predictions to {output_path}...")
    out_df.to_csv(output_path, index=False)
    print("Inference completed successfully.")

if __name__ == "__main__":
    main()
