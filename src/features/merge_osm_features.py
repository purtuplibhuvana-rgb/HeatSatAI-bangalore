import os
import pandas as pd

# ==========================
# Paths
# ==========================

BASE_DATA = "data/processed/HeatSatAI_Bengaluru_FeatureEngineered.csv"

OUTPUT_DIR = "data/final"
OUTPUT_FILE = os.path.join(
    OUTPUT_DIR,
    "HeatSatAI_Bengaluru_ModelReady.csv"
)

# ==========================
# OSM Feature Files
# filename : new feature column
# ==========================

osm_files = {
    "osm_building_density.csv": "Building_Density",
    "osm_road_density.csv": "Road_Length",
    "osm_park_distance.csv": "Park_Distance",
    "osm_water_distance.csv": "Water_Distance",
    "osm_forest_distance.csv": "Forest_Distance",
    "osm_hospital_distance.csv": "Hospital_Distance",
    "osm_school_distance.csv": "School_Distance",
    "osm_bus_stop_distance.csv": "Bus_Stop_Distance",
    "osm_metro_distance.csv": "Metro_Distance",
    "osm_commercial_density.csv": "Commercial_Density",
    "osm_industrial_density.csv": "Industrial_Density",
    "osm_residential_density.csv": "Residential_Density"
}

# ==========================
# Load Base Dataset
# ==========================

print("=" * 60)
print("Loading base dataset...")
print("=" * 60)

df = pd.read_csv(BASE_DATA)

print(f"Rows    : {len(df)}")
print(f"Columns : {len(df.columns)}")

print("\nMerging OSM features...\n")

for filename, feature_name in osm_files.items():

    path = os.path.join("data/processed", filename)

    print(f"Adding {feature_name}")

    temp = pd.read_csv(path)

    if feature_name not in temp.columns:
        raise ValueError(f"{feature_name} not found in {filename}")

    # Append only the engineered feature
    df[feature_name] = temp[feature_name]

print("\nAll OSM features merged successfully.")

print("\n" + "=" * 60)
print("VALIDATION")
print("=" * 60)

print(f"Rows    : {len(df)}")
print(f"Columns : {len(df.columns)}")

# Duplicate columns
duplicates = df.columns[df.columns.duplicated()].tolist()

if duplicates:
    print("\nDuplicate Columns Found:")
    print(duplicates)
else:
    print("\nNo duplicate columns.")

# Duplicate rows
print(f"\nDuplicate Rows : {df.duplicated().sum()}")

# Duplicate coordinates
if ".geo" in df.columns:
    print(f"Duplicate .geo values : {df['.geo'].duplicated().sum()}")

    print("\n" + "=" * 60)
print("MISSING VALUES")
print("=" * 60)

osm_columns = list(osm_files.values())

print(df[osm_columns].isna().sum())

print("\n" + "=" * 60)
print("SUMMARY STATISTICS")
print("=" * 60)

print(df[osm_columns].describe())

os.makedirs(OUTPUT_DIR, exist_ok=True)

df.to_csv(OUTPUT_FILE, index=False)

print("\n" + "=" * 60)
print("DONE")
print("=" * 60)

print(f"Final dataset saved to:\n{OUTPUT_FILE}")

print(f"\nFinal Shape: {df.shape}")

