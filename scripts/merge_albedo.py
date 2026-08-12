import pandas as pd

print("=" * 70)
print("HeatSat AI - Merge Surface Albedo")
print("=" * 70)

# -----------------------------------------------------
# Load datasets
# -----------------------------------------------------

master = pd.read_csv("data/final/HeatSatAI_Bengaluru_Master_V3.csv")

albedo = pd.read_csv("HeatSatAI_Albedo_2023 (4).csv")

print("\nMaster Shape :", master.shape)
print("Albedo Shape :", albedo.shape)

# -----------------------------------------------------
# Remove old empty Albedo column
# -----------------------------------------------------

if "Albedo" in master.columns:
    master = master.drop(columns=["Albedo"])

# -----------------------------------------------------
# Keep only required columns
# -----------------------------------------------------

albedo = albedo[
    [
        "Latitude",
        "Longitude",
        "Albedo"
    ]
]

# -----------------------------------------------------
# Round coordinates
# -----------------------------------------------------

master["Latitude"] = master["Latitude"].round(6)
master["Longitude"] = master["Longitude"].round(6)

albedo["Latitude"] = albedo["Latitude"].round(6)
albedo["Longitude"] = albedo["Longitude"].round(6)

# -----------------------------------------------------
# Merge
# -----------------------------------------------------

merged = master.merge(
    albedo,
    on=["Latitude", "Longitude"],
    how="left"
)

# -----------------------------------------------------
# Validation
# -----------------------------------------------------

print("\nMerged Shape :", merged.shape)

print("Missing Albedo :", merged["Albedo"].isna().sum())

print("\nFirst 10 Albedo Values")

print(merged["Albedo"].head(10))

print("\nStatistics")

print(merged["Albedo"].describe())

# -----------------------------------------------------
# Save
# -----------------------------------------------------

merged.to_csv(
    "data/final/HeatSatAI_Bengaluru_Master_V4.csv",
    index=False
)

print("\nSaved Successfully!")

print("Output File:")

print("data/final/HeatSatAI_Bengaluru_Master_V4.csv")