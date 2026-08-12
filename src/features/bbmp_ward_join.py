import os
import json
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# =====================================================
# Paths
# =====================================================

INPUT_FILE = "data/final/HeatSatAI_Bengaluru_ModelReady.csv"

WARD_FILE = "data/raw/bbmp/bbmp_wards.kml"

OUTPUT_FILE = "data/final/HeatSatAI_Bengaluru_ModelReady_BBMP.csv"

# =====================================================
# Load Dataset
# =====================================================

print("=" * 60)
print("Loading Model Ready Dataset")
print("=" * 60)

df = pd.read_csv(INPUT_FILE)

print(f"Rows    : {len(df)}")
print(f"Columns : {len(df.columns)}")

# =====================================================
# Convert .geo to geometry
# =====================================================

def geo_to_point(geo_string):
    geo = json.loads(geo_string)
    lon, lat = geo["coordinates"]
    return Point(lon, lat)

geometry = df[".geo"].apply(geo_to_point)

gdf = gpd.GeoDataFrame(
    df,
    geometry=geometry,
    crs="EPSG:4326"
)

# =====================================================
# Read BBMP Wards
# =====================================================

print("\nLoading BBMP Ward Boundaries...")

wards = gpd.read_file(WARD_FILE, driver="KML")

print(f"Total Wards : {len(wards)}")

# =====================================================
# CRS Check
# =====================================================

wards = wards.to_crs(gdf.crs)

# =====================================================
# Inspect Available Columns
# =====================================================

print("\nWard Columns:")
print(wards.columns.tolist())

# =====================================================
# Keep Only Required Ward Fields
# =====================================================

wards = wards[
    [
        "WardName",
        "WardNo",
        "WardCode",
        "WardID",
        "geometry"
    ]
]

print("\nWard fields retained:")
print(wards.columns.tolist())

# =====================================================
# Spatial Join
# =====================================================

print("\nPerforming spatial join...")

joined = gpd.sjoin(
    gdf,
    wards,
    how="left",
    predicate="intersects"
)

print("Spatial join completed.")

# =====================================================
# Find Unmatched Points
# =====================================================

missing = joined["WardName"].isna().sum()

print(f"\nUnmatched Points: {missing}")

# =====================================================
# Nearest Join (for unmatched points)
# =====================================================

if missing > 0:

    print("Assigning nearest ward...")

    matched = joined[joined["WardName"].notna()].copy()

    unmatched = joined[joined["WardName"].isna()].copy()

    nearest = gpd.sjoin_nearest(
        unmatched.drop(
            columns=[
                "WardName",
                "WardNo",
                "WardCode",
                "WardID",
                "index_right"
            ],
            errors="ignore"
        ),
        wards,
        how="left"
    )

    joined = pd.concat(
        [matched, nearest],
        ignore_index=True
    )

    print("Nearest assignment completed.")

    # =====================================================
# Validation
# =====================================================

print("\nValidation")

print(f"Rows : {len(joined)}")

print(f"Missing Wards : {joined['WardName'].isna().sum()}")

# =====================================================
# Save
# =====================================================

joined = joined.drop(columns=["geometry", "index_right"], errors="ignore")

joined.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\n" + "="*60)
print("DONE")
print("="*60)

print(f"Saved to:\n{OUTPUT_FILE}")

print(f"\nFinal Shape: {joined.shape}")

print("\nPoint Bounds")
print(gdf.total_bounds)

print("\nWard Bounds")
print(wards.total_bounds)

inside = gdf.within(wards.unary_union)

print(f"Inside BBMP : {inside.sum()}")
print(f"Outside BBMP: {(~inside).sum()}")

