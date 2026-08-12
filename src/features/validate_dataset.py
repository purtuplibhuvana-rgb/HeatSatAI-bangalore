import os
import numpy as np
import pandas as pd
INPUT_FILE = "data/final/HeatSatAI_Bengaluru_ModelReady.csv"

REPORT_DIR = "docs"
REPORT_FILE = os.path.join(REPORT_DIR, "Dataset_Validation_Report.txt")

os.makedirs(REPORT_DIR, exist_ok=True)
print("=" * 60)
print("Loading Final Dataset")
print("=" * 60)

df = pd.read_csv(INPUT_FILE)

print(f"Rows    : {len(df)}")
print(f"Columns : {len(df.columns)}")

report = []

report.append("=" * 60)
report.append("HEATSAT AI DATASET VALIDATION REPORT")
report.append("=" * 60)

report.append(f"Rows: {len(df)}")
report.append(f"Columns: {len(df.columns)}")

report.append(f"Duplicate Rows: {df.duplicated().sum()}")
report.append(f"Duplicate Columns: {df.columns.duplicated().sum()}")

if ".geo" in df.columns:
    report.append(f"Duplicate .geo values: {df['.geo'].duplicated().sum()}")

report.append("")

report.append("=" * 60)
report.append("COLUMN DATA TYPES")
report.append("=" * 60)

for col, dtype in df.dtypes.items():
    report.append(f"{col:<35} {dtype}")

    report.append("")
report.append("=" * 60)
report.append("MISSING VALUES")
report.append("=" * 60)

missing = df.isna().sum()

for col, value in missing.items():
    report.append(f"{col:<35} {value}")

    report.append("")
report.append("=" * 60)
report.append("INFINITE VALUES")
report.append("=" * 60)

numeric = df.select_dtypes(include=np.number)

inf_count = np.isinf(numeric).sum()

for col, value in inf_count.items():
    report.append(f"{col:<35} {value}")

    osm_columns = [
    "Building_Density",
    "Commercial_Density",
    "Industrial_Density",
    "Residential_Density",
    "Road_Length",
    "Park_Distance",
    "Water_Distance",
    "Forest_Distance",
    "Hospital_Distance",
    "School_Distance",
    "Bus_Stop_Distance",
    "Metro_Distance"
]

report.append("")
report.append("=" * 60)
report.append("NEGATIVE VALUE CHECK")
report.append("=" * 60)

for col in osm_columns:
    negatives = (df[col] < 0).sum()
    report.append(f"{col:<35} {negatives}")

    report.append("")
report.append("=" * 60)
report.append("SUMMARY STATISTICS")
report.append("=" * 60)

stats = df.describe().round(3)

report.append(stats.to_string())

with open(REPORT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(report))

print("\nValidation report saved to:")
print(REPORT_FILE)

print("\n")
print("=" * 60)
print("VALIDATION SUMMARY")
print("=" * 60)

print(f"Rows                : {len(df)}")
print(f"Columns             : {len(df.columns)}")
print(f"Duplicate Rows      : {df.duplicated().sum()}")
print(f"Duplicate Columns   : {df.columns.duplicated().sum()}")
print(f"Missing Values      : {df.isna().sum().sum()}")
inf_total = np.isinf(numeric).sum().sum()

print(f"Infinite Values     : {inf_total}")
print("=" * 60)
print("DATASET VALIDATION COMPLETED")
print("=" * 60)