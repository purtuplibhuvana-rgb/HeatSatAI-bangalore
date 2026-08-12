import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# ==========================================================
# Paths
# ==========================================================

INPUT = "data/processed/HeatSatAI_Bengaluru_FeatureEngineered.csv"
FORESTS = "data/raw/osm/forests.geojson"

OUTPUT = "data/processed/osm_forest_distance.csv"

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

print("Loading forests...")

forests = gpd.read_file(FORESTS)
forests = forests.to_crs(epsg=32643)

# ==========================================================
# Distance
# ==========================================================

print("Calculating nearest forest distance...")

forest_union = forests.union_all()

forest_distance = gdf.geometry.distance(forest_union)

print(f"Rows in dataset : {len(gdf)}")
print(f"Distance values : {len(forest_distance)}")

# ==========================================================
# Add Feature
# ==========================================================

gdf["Forest_Distance"] = forest_distance

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

print(gdf["Forest_Distance"].describe())