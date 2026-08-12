import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# ==========================================================
# Paths
# ==========================================================

INPUT = "data/processed/HeatSatAI_Bengaluru_FeatureEngineered.csv"
METRO = "data/raw/osm/metro.geojson"

OUTPUT = "data/processed/osm_metro_distance.csv"

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

print("Loading metro stations...")

metro = gpd.read_file(METRO)
metro = metro.to_crs(epsg=32643)

# ==========================================================
# Distance
# ==========================================================

print("Calculating nearest metro distance...")

metro_union = metro.union_all()

metro_distance = gdf.geometry.distance(metro_union)

print(f"Rows in dataset : {len(gdf)}")
print(f"Distance values : {len(metro_distance)}")

# ==========================================================
# Add Feature
# ==========================================================

gdf["Metro_Distance"] = metro_distance

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

print(gdf["Metro_Distance"].describe())