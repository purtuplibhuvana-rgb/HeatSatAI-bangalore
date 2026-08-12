import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# ==========================================================
# Paths
# ==========================================================

INPUT = "data/processed/HeatSatAI_Bengaluru_FeatureEngineered.csv"
WATER = "data/raw/osm/water.geojson"

OUTPUT = "data/processed/osm_water_distance.csv"

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

print("Loading water bodies...")

water = gpd.read_file(WATER)
water = water.to_crs(epsg=32643)

# ==========================================================
# Distance
# ==========================================================

print("Calculating nearest water distance...")

water_union = water.union_all()

water_distance = gdf.geometry.distance(water_union)

print(f"Rows in dataset : {len(gdf)}")
print(f"Distance values : {len(water_distance)}")

# ==========================================================
# Add Feature
# ==========================================================

gdf["Water_Distance"] = water_distance

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

print(gdf["Water_Distance"].describe())