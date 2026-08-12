import pandas as pd
import json
import os

# Input dataset
INPUT_FILE = "data/final/HeatSatAI_Bengaluru_ModelReady.csv"

# Output file
OUTPUT_FILE = "data/processed/HeatSatAI_Points.csv"

# Load dataset
df = pd.read_csv(INPUT_FILE)

# Extract coordinates
longitudes = []
latitudes = []

for geo in df[".geo"]:
    point = json.loads(geo)
    lon, lat = point["coordinates"]
    longitudes.append(lon)
    latitudes.append(lat)

# Create points dataframe
points = pd.DataFrame({
    "Longitude": longitudes,
    "Latitude": latitudes
})

# Save
os.makedirs("data/processed", exist_ok=True)
points.to_csv(OUTPUT_FILE, index=False)

print("Points CSV created successfully.")
print(f"Saved to: {OUTPUT_FILE}")
print(points.head())
print(f"\nTotal Points: {len(points)}")