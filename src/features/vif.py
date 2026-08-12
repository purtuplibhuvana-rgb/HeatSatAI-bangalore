import pandas as pd
from statsmodels.stats.outliers_influence import variance_inflation_factor

# Load dataset
df = pd.read_csv(r"D:\perso_pro\HeatSatAI\data\final\HeatSatAI_Bengaluru_Master_V4.csv")

# Columns not used for VIF
drop_cols = [
    "system:index",
    ".geo",
    "Latitude",
    "Longitude",
    "LST",
    "LST_Normalized",
    "Heat_Category",
    "Heat_Susceptibility",
    "Population_Normalized",
    "Relative_Elevation",
    "Elevation_Cooling",
    "Vegetation_Deficit"
]

drop_cols = [c for c in drop_cols if c in df.columns]

X = df.drop(columns=drop_cols)

print("Columns used for VIF:")
print(X.columns.tolist())

# Calculate VIF
vif = pd.DataFrame({
    "Feature": X.columns,
    "VIF": [
        variance_inflation_factor(X.values, i)
        for i in range(X.shape[1])
    ]
})

vif = vif.sort_values("VIF", ascending=False)

print(vif)