import pandas as pd

df = pd.read_csv("HeatSatAI_Albedo_2023.csv")

print("=" * 60)
print("Rows:", len(df))
print("Columns:", len(df.columns))
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head())