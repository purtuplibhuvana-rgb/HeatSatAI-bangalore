import pandas as pd

# ---------------------------------------------------
# Load datasets
# ---------------------------------------------------

master = pd.read_csv(
    "data/final/HeatSatAI_Bengaluru_Master.csv"
)

emissivity = pd.read_csv(
    "HeatSatAI_Emissivity_2023.csv"
)

# ---------------------------------------------------
# Round coordinates
# ---------------------------------------------------

master["Latitude"] = master["Latitude"].round(6)
master["Longitude"] = master["Longitude"].round(6)

emissivity["Latitude"] = emissivity["Latitude"].round(6)
emissivity["Longitude"] = emissivity["Longitude"].round(6)

# ---------------------------------------------------
# Keep only required columns
# ---------------------------------------------------

emissivity = emissivity[
    [
        "Latitude",
        "Longitude",
        "Emissivity"
    ]
]

# Remove duplicate coordinate pairs if any
emissivity = emissivity.drop_duplicates(
    subset=["Latitude", "Longitude"]
)

# ---------------------------------------------------
# Merge
# ---------------------------------------------------

merged = master.merge(
    emissivity,
    on=["Latitude", "Longitude"],
    how="left"
)

# ---------------------------------------------------
# Validation
# ---------------------------------------------------

print("=" * 60)
print("MASTER + EMISSIVITY")
print("=" * 60)

print("Rows:", len(merged))
print("Columns:", len(merged.columns))

print()

print("Missing Emissivity:",
      merged["Emissivity"].isna().sum())

print()

print("Duplicate Rows:",
      merged.duplicated().sum())

# ---------------------------------------------------
# Save
# ---------------------------------------------------

merged.to_csv(
    "data/final/HeatSatAI_Bengaluru_Master_V2.csv",
    index=False
)

print("\nSaved Successfully!")