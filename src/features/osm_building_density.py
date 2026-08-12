import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# -------------------------------------------------
# Paths
# -------------------------------------------------

SATELLITE_DATA = "HeatSatAI_Bengaluru_FeatureEngineered.csv"
BUILDINGS = "data/raw/osm/buildings.geojson"

OUTPUT = "data/processed/osm_building_density.csv"

BUFFER_DISTANCE = 250      # meters

# -------------------------------------------------
# Load satellite dataset
# -------------------------------------------------

print("Loading satellite dataset...")

df = pd.read_csv(SATELLITE_DATA)

# -------------------------------------------------
# Convert .geo column to geometry
# -------------------------------------------------

print("Converting points...")

geometry = []

for g in df[".geo"]:
    coords = json.loads(g)["coordinates"]
    geometry.append(Point(coords))

gdf = gpd.GeoDataFrame(
    df,
    geometry=geometry,
    crs="EPSG:4326"
)

# -------------------------------------------------
# Project to metric CRS
# -------------------------------------------------

print("Projecting to UTM...")

gdf = gdf.to_crs(32643)

# -------------------------------------------------
# Create buffers
# -------------------------------------------------

print("Creating buffers...")

buffers = gdf.copy()
buffers["geometry"] = buffers.buffer(BUFFER_DISTANCE)

# -------------------------------------------------
# Load buildings
# -------------------------------------------------

print("Loading buildings...")

buildings = gpd.read_file(BUILDINGS)

buildings = buildings.to_crs(32643)

# -------------------------------------------------
# Spatial Join
# -------------------------------------------------

print("Counting buildings...")

joined = gpd.sjoin(
    buffers,
    buildings,
    predicate="contains",
    how="left"
)

counts = joined.groupby(joined.index).size()

gdf["Building_Density"] = counts

gdf["Building_Density"] = gdf["Building_Density"].fillna(0)

# -------------------------------------------------
# Save
# -------------------------------------------------

print("Saving...")

gdf.drop(columns="geometry").to_csv(
    OUTPUT,
    index=False
)

print("\nDone!")

print(gdf["Building_Density"].describe())