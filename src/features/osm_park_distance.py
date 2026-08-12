import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# ==========================================================
# File Paths
# ==========================================================

INPUT = "data/processed/HeatSatAI_Bengaluru_FeatureEngineered.csv"
PARKS = "data/raw/osm/parks.geojson"

OUTPUT = "data/processed/osm_park_distance.csv"

# ==========================================================
# Load Feature Dataset
# ==========================================================

print("Loading feature dataset...")

df = pd.read_csv(INPUT)

# ==========================================================
# Convert .geo to Geometry
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
# Project to UTM
# ==========================================================

print("Projecting to UTM...")

gdf = gdf.to_crs(epsg=32643)

print("Loading parks...")

parks = gpd.read_file(PARKS)
parks = parks.to_crs(epsg=32643)

# ==========================================================
# Calculate Nearest Park Distance
# ==========================================================

print("Calculating nearest park distance...")

# Merge all park polygons into one geometry
park_union = parks.union_all()

park_distances = gdf.geometry.distance(park_union)

print(f"Rows in dataset : {len(gdf)}")
print(f"Distance values : {len(park_distances)}")

# ==========================================================
# Add Feature
# ==========================================================

gdf["Park_Distance"] = park_distances

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

print(gdf["Park_Distance"].describe())