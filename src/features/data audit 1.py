import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load dataset
df = pd.read_csv(r"D:\perso_pro\HeatSatAI\data\final\HeatSatAI_Bengaluru_Master_V4.csv")

# Drop non-numeric / metadata columns
drop_cols = [
    "system:index",
    ".geo",
    "Latitude",
    "Longitude",
    "Heat_Category"  # Ignore if already removed
]

drop_cols = [c for c in drop_cols if c in df.columns]
df = df.drop(columns=drop_cols)

# Pearson Correlation
pearson = df.corr(method="pearson")

# Spearman Correlation
spearman = df.corr(method="spearman")

# Correlation with LST
pearson_lst = (
    pearson["LST"]
    .drop("LST")
    .sort_values(ascending=False)
)

spearman_lst = (
    spearman["LST"]
    .drop("LST")
    .sort_values(ascending=False)
)

print("\n========== Pearson Correlation with LST ==========\n")
print(pearson_lst)

print("\n========== Spearman Correlation with LST ==========\n")
print(spearman_lst)

# Pearson Heatmap
plt.figure(figsize=(18,15))
sns.heatmap(
    pearson,
    cmap="coolwarm",
    center=0
)
plt.title("Pearson Correlation Matrix")
plt.tight_layout()
plt.show()

# Spearman Heatmap
plt.figure(figsize=(18,15))
sns.heatmap(
    spearman,
    cmap="coolwarm",
    center=0
)
plt.title("Spearman Correlation Matrix")
plt.tight_layout()
plt.show()