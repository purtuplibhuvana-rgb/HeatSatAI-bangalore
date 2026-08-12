import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# ==========================================================
# File Paths
# ==========================================================

INPUT = "data/processed/HeatSatAI_Bengaluru_FeatureEngineered.csv"
ROADS = "data/raw/osm/roads.geojson"

OUTPUT = "data/processed/osm_road_density.csv"

BUFFER_DISTANCE = 250  # meters

# ==========================================================
# Load Feature Dataset
# ==========================================================

print("Loading feature dataset...")

df = pd.read_csv(INPUT)

# ==========================================================
# Convert .geo column to Geometry
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

# ==========================================================
# Create 250 m Buffers
# ==========================================================

print("Creating buffers...")

buffers = gdf.copy()
buffers["geometry"] = buffers.geometry.buffer(BUFFER_DISTANCE)

# ==========================================================
# Load Roads
# ==========================================================

print("Loading roads...")

roads = gpd.read_file(ROADS)
roads = roads.to_crs(epsg=32643)

# ==========================================================
# Calculate Road Length
# ==========================================================

print("Calculating road length...")

road_lengths = []

for buffer_geom in buffers.geometry:

    # Clip roads inside the buffer
    clipped = roads.clip(buffer_geom)

    # Total road length (meters)
    total_length = clipped.length.sum()

    road_lengths.append(total_length)

# ==========================================================
# Safety Check
# ==========================================================

print(f"Rows in dataset : {len(gdf)}")
print(f"Road values     : {len(road_lengths)}")

# ==========================================================
# Add Feature
# ==========================================================

gdf["Road_Length"] = road_lengths

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

print(gdf["Road_Length"].describe())