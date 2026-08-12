import json
import pandas as pd

# ---------------------------------------------------
# Load the current model-ready dataset
# ---------------------------------------------------

df = pd.read_csv("data/final/HeatSatAI_Bengaluru_ModelReady_V2.csv")

# ---------------------------------------------------
# Extract coordinates from .geo
# ---------------------------------------------------

def extract_coordinates(geo):
    obj = json.loads(geo)
    lon, lat = obj["coordinates"]
    return pd.Series([lat, lon])

df[["Latitude", "Longitude"]] = df[".geo"].apply(extract_coordinates)

# ---------------------------------------------------
# Round coordinates
# ---------------------------------------------------

df["Latitude"] = df["Latitude"].round(6)
df["Longitude"] = df["Longitude"].round(6)

# ---------------------------------------------------
# Move Latitude & Longitude next to .geo
# ---------------------------------------------------

cols = df.columns.tolist()

cols.remove("Latitude")
cols.remove("Longitude")

geo_index = cols.index(".geo")

cols.insert(geo_index + 1, "Latitude")
cols.insert(geo_index + 2, "Longitude")

df = df[cols]

# ---------------------------------------------------
# Validation
# ---------------------------------------------------

print("=" * 60)
print("MASTER DATASET")
print("=" * 60)

print("Rows:", len(df))
print("Columns:", len(df.columns))

print("\nMissing Latitude :", df["Latitude"].isna().sum())
print("Missing Longitude:", df["Longitude"].isna().sum())

print("\nDuplicate Coordinate Pairs:",
      df.duplicated(subset=["Latitude", "Longitude"]).sum())

# ---------------------------------------------------
# Save
# ---------------------------------------------------

df.to_csv(
    "data/final/HeatSatAI_Bengaluru_Master.csv",
    index=False
)

print("\nMaster dataset saved successfully!")