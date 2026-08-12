import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# ==========================================================
# Paths
# ==========================================================

INPUT = "data/processed/HeatSatAI_Bengaluru_FeatureEngineered.csv"
BUS_STOPS = "data/raw/osm/bus_stops.geojson"

OUTPUT = "data/processed/osm_bus_stop_distance.csv"

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

print("Loading bus stops...")

bus_stops = gpd.read_file(BUS_STOPS)
bus_stops = bus_stops.to_crs(epsg=32643)

# ==========================================================
# Distance
# ==========================================================

print("Calculating nearest bus stop distance...")

bus_union = bus_stops.union_all()

bus_distance = gdf.geometry.distance(bus_union)

print(f"Rows in dataset : {len(gdf)}")
print(f"Distance values : {len(bus_distance)}")

# ==========================================================
# Add Feature
# ==========================================================

gdf["Bus_Stop_Distance"] = bus_distance

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

print(gdf["Bus_Stop_Distance"].describe())