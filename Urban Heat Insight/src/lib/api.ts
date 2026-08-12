import type { Hotspot, GridCell, FeatureImportance, Recommendation } from "./mock-data";

// Base URL for the FastAPI backend.
// In development, Vite proxies /api/* to http://localhost:8000
// In production, same origin is used.
const BASE_URL = "/api/v1";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

// ─── Statistics (KPIs + distributions) ────────────────────────────────────

export interface StatisticsResponse {
  kpi: {
    avgLST: number;
    maxLST: number;
    hotspotCount: number;
    avgNDVI: number;
    coolingPotential: number;
    accuracy: number;
  };
  temp_distribution: { bucket: string; count: number; category: string }[];
  land_cover_dist: { name: string; value: number; color: string }[];
  heat_category_dist: { name: string; value: number; color: string }[];
  heat_trend: { month: string; avg: number; max: number }[];
  model_meta: {
    algorithm: string;
    version: string;
    trainedOn: string;
    samples: number;
    r2: number;
    rmse: number;
    mae: number;
    lastRun: string;
  };
}

export async function fetchStatistics(): Promise<StatisticsResponse> {
  return fetchJson<StatisticsResponse>("/statistics");
}

// ─── Hotspots ─────────────────────────────────────────────────────────────

export async function fetchHotspots(): Promise<Hotspot[]> {
  return fetchJson<Hotspot[]>("/hotspots");
}

// ─── Heatmap grid cells ────────────────────────────────────────────────────

export async function fetchHeatmap(): Promise<GridCell[]> {
  return fetchJson<GridCell[]>("/heatmap");
}

// ─── Feature importance ────────────────────────────────────────────────────

export async function fetchFeatureImportance(): Promise<FeatureImportance[]> {
  return fetchJson<FeatureImportance[]>("/feature-importance");
}

// ─── Recommendations ──────────────────────────────────────────────────────

export async function fetchRecommendations(hotspotId?: string): Promise<Recommendation[]> {
  const query = hotspotId ? `?hotspot_id=${encodeURIComponent(hotspotId)}` : "";
  return fetchJson<Recommendation[]>(`/recommendations${query}`);
}
