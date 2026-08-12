import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# ==========================================================
# Paths
# ==========================================================

INPUT = "data/processed/HeatSatAI_Bengaluru_FeatureEngineered.csv"
HOSPITALS = "data/raw/osm/hospitals.geojson"

OUTPUT = "data/processed/osm_hospital_distance.csv"

# ==========================================================
# Load Dataset
# ==========================================================

print("Loading feature dataset...")

df = pd.read_csv(INPUT)

# ==========================================================
# Convert coordinates
# ==========================================================

print("Converting coordinates...")

geometry = []

for geo in df[".geo"]:
    point = json.loads(geo)
    lon, lat = point["coordinates"]
    geometry.append(Point(lon, lat))

gdf = gpd.GeoDataFrame(
    df,
    geometry=geometry,
    crs="EPSG:4326"
)

# ==========================================================
# Project
# ==========================================================

print("Projecting to UTM...")

gdf = gdf.to_crs(epsg=32643)

print("Loading hospitals...")

hospitals = gpd.read_file(HOSPITALS)
hospitals = hospitals.to_crs(epsg=32643)

# ==========================================================
# Distance
# ==========================================================

print("Calculating nearest hospital distance...")

hospital_union = hospitals.union_all()

hospital_distance = gdf.geometry.distance(hospital_union)

print(f"Rows in dataset : {len(gdf)}")
print(f"Distance values : {len(hospital_distance)}")

# ==========================================================
# Add Feature
# ==========================================================

gdf["Hospital_Distance"] = hospital_distance

# ==========================================================
# Save
# ==========================================================

print("Saving...")

gdf.drop(columns="geometry").to_csv(
    OUTPUT,
    index=False
)

# ==========================================================
# Summary
# ==========================================================

print("\nDone!")

print(gdf["Hospital_Distance"].describe())