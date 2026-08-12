import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

INPUT = "data/processed/HeatSatAI_Bengaluru_FeatureEngineered.csv"
POLYGONS = "data/raw/osm/industrial.geojson"
OUTPUT = "data/processed/osm_industrial_density.csv"

BUFFER_DISTANCE = 250

print("Loading feature dataset...")
df = pd.read_csv(INPUT)

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

print("Projecting to UTM...")
gdf = gdf.to_crs(32643)

print("Creating buffers...")
buffers = gdf.copy()
buffers["geometry"] = buffers.buffer(BUFFER_DISTANCE)

print("Loading industrial areas...")
industrial = gpd.read_file(POLYGONS)
industrial = industrial.to_crs(32643)

industrial_index = industrial.sindex

print("Counting industrial areas...")

counts = []

for buffer_geom in buffers.geometry:

    possible = list(industrial_index.intersection(buffer_geom.bounds))

    nearby = industrial.iloc[possible]

    nearby = nearby[nearby.intersects(buffer_geom)]

    counts.append(len(nearby))

print("Rows in dataset :", len(gdf))
print("Industrial values :", len(counts))

gdf["Industrial_Density"] = counts

print("Saving...")

gdf.drop(columns="geometry").to_csv(
    OUTPUT,
    index=False
)

print("\nDone!")

print(gdf["Industrial_Density"].describe())