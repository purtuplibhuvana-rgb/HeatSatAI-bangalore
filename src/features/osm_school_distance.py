import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# ==========================================================
# Paths
# ==========================================================

INPUT = "data/processed/HeatSatAI_Bengaluru_FeatureEngineered.csv"
SCHOOLS = "data/raw/osm/schools.geojson"

OUTPUT = "data/processed/osm_school_distance.csv"

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

print("Loading schools...")

schools = gpd.read_file(SCHOOLS)
schools = schools.to_crs(epsg=32643)

# ==========================================================
# Distance
# ==========================================================

print("Calculating nearest school distance...")

school_union = schools.union_all()

school_distance = gdf.geometry.distance(school_union)

print(f"Rows in dataset : {len(gdf)}")
print(f"Distance values : {len(school_distance)}")

# ==========================================================
# Add Feature
# ==========================================================

gdf["School_Distance"] = school_distance

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

print(gdf["School_Distance"].describe())