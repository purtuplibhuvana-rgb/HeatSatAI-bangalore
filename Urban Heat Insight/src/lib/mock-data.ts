// ─── Type definitions ──────────────────────────────────────────────────────

export interface FeatureContribution {
  feature: string;
  value: number;
}

export interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  lst: number;
  ndvi: number;
  ndbi: number;
  population: number;
  landCover: string;
  category: HeatCategory;
  risk: string;
  confidence: number;
  featureContributions: FeatureContribution[];
  recommendations: string[];
}

export interface GridCell {
  id: string;
  lat: number;
  lng: number;
  lst: number;
  category: HeatCategory;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: number;
  priority: string;
  cost: string;
  difficulty: string;
  category: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export type HeatCategory = "cool" | "mild" | "warm" | "hot" | "extreme";

// ─── Constants ────────────────────────────────────────────────────────────

export const BENGALURU_CENTER: [number, number] = [12.9716, 77.5946];

export const MODEL_META = {
  algorithm: "XGBoost Regressor + SHAP",
  version: "v1.4.2 (Production)",
  trainedOn: "HeatSatAI Canonical Data",
  samples: 9695,
  r2: 0.9746,
  rmse: 0.3463,
  mae: 0.2070,
  lastRun: "2026-07-24",
};

// ─── Color helpers ────────────────────────────────────────────────────────

const HEAT_COLORS: Record<HeatCategory, string> = {
  cool: "#3b82f6",
  mild: "#22c55e",
  warm: "#eab308",
  hot: "#f97316",
  extreme: "#ef4444",
};

export function heatHex(category: HeatCategory | string): string {
  return HEAT_COLORS[category as HeatCategory] ?? "#94a3b8";
}

// ─── NDVI–LST scatter (static sample for the analytics chart) ─────────────

export const NDVI_LST_SCATTER = [
  { ndvi: 0.05, lst: 46.2, category: "extreme" },
  { ndvi: 0.08, lst: 44.8, category: "extreme" },
  { ndvi: 0.12, lst: 43.1, category: "extreme" },
  { ndvi: 0.15, lst: 41.5, category: "hot" },
  { ndvi: 0.18, lst: 40.2, category: "hot" },
  { ndvi: 0.20, lst: 39.4, category: "hot" },
  { ndvi: 0.24, lst: 38.1, category: "hot" },
  { ndvi: 0.28, lst: 36.7, category: "warm" },
  { ndvi: 0.31, lst: 35.5, category: "warm" },
  { ndvi: 0.35, lst: 34.2, category: "warm" },
  { ndvi: 0.38, lst: 33.0, category: "warm" },
  { ndvi: 0.42, lst: 31.8, category: "mild" },
  { ndvi: 0.46, lst: 30.4, category: "mild" },
  { ndvi: 0.50, lst: 29.1, category: "mild" },
  { ndvi: 0.54, lst: 28.3, category: "cool" },
  { ndvi: 0.58, lst: 27.5, category: "cool" },
  { ndvi: 0.62, lst: 26.8, category: "cool" },
  { ndvi: 0.65, lst: 26.0, category: "cool" },
] as const;
