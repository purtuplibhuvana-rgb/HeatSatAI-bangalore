import json
import pandas as pd

# ---------------------------------------------------
# Load datasets
# ---------------------------------------------------

model = pd.read_csv("data/final/HeatSatAI_Bengaluru_ModelReady.csv")
viirs = pd.read_csv("HeatSatAI_VIIRS_2023.csv")

# ---------------------------------------------------
# Extract Latitude and Longitude from .geo
# ---------------------------------------------------

def extract_coordinates(geo):
    obj = json.loads(geo)
    lon, lat = obj["coordinates"]
    return pd.Series([lat, lon])

model[["Latitude", "Longitude"]] = model[".geo"].apply(extract_coordinates)

# ---------------------------------------------------
# Round coordinates to avoid floating-point mismatch
# ---------------------------------------------------

model["Latitude"] = model["Latitude"].round(6)
model["Longitude"] = model["Longitude"].round(6)

viirs["Latitude"] = viirs["Latitude"].round(6)
viirs["Longitude"] = viirs["Longitude"].round(6)

# ---------------------------------------------------
# Keep only required VIIRS columns
# ---------------------------------------------------

viirs = viirs[[
    "Latitude",
    "Longitude",
    "Nighttime_Lights"
]]

# Remove duplicate coordinate pairs if any
viirs = viirs.drop_duplicates(subset=["Latitude", "Longitude"])

# ---------------------------------------------------
# Merge
# ---------------------------------------------------

merged = model.merge(
    viirs,
    on=["Latitude", "Longitude"],
    how="left"
)

# ---------------------------------------------------
# Remove temporary columns
# ---------------------------------------------------

merged = merged.drop(columns=["Latitude", "Longitude"])

# ---------------------------------------------------
# Validation
# ---------------------------------------------------

print("=" * 60)
print("Merged Dataset")
print("=" * 60)

print("Rows:", len(merged))
print("Columns:", len(merged.columns))

print("\nMissing Nighttime Lights:",
      merged["Nighttime_Lights"].isna().sum())

print("\nDuplicate Rows:",
      merged.duplicated().sum())

# ---------------------------------------------------
# Save
# ---------------------------------------------------

merged.to_csv(
    "data/final/HeatSatAI_Bengaluru_ModelReady_V2.csv",
    index=False
)

print("\nSaved Successfully!")