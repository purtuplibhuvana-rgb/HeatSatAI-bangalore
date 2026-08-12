import type { Hotspot, GridCell, FeatureImportance, Recommendation } from "./mock-data";
import { BENGALURU_CENTER } from "./mock-data";

// ─── Inline mock data (used when the FastAPI backend is unavailable) ───────

const MOCK_STATISTICS: StatisticsResponse = {
  kpi: {
    avgLST: 34.2,
    maxLST: 46.8,
    hotspotCount: 128,
    avgNDVI: 0.28,
    coolingPotential: 4.6,
    accuracy: 0.923,
  },
  temp_distribution: [
    { bucket: "24-28°C", count: 42, category: "cool" },
    { bucket: "28-32°C", count: 96, category: "mild" },
    { bucket: "32-36°C", count: 168, category: "warm" },
    { bucket: "36-40°C", count: 124, category: "hot" },
    { bucket: "40-44°C", count: 76, category: "hot" },
    { bucket: "44-48°C", count: 34, category: "extreme" },
  ],
  land_cover_dist: [
    { name: "Urban",       value: 34, color: "#94a3b8" },
    { name: "Residential", value: 22, color: "#a78bfa" },
    { name: "Industrial",  value: 14, color: "#f97316" },
    { name: "Vegetation",  value: 18, color: "#22c55e" },
    { name: "Water",       value:  6, color: "#3b82f6" },
    { name: "Barren",      value:  6, color: "#eab308" },
  ],
  heat_category_dist: [
    { name: "Cool",    value:  42, color: "#3b82f6" },
    { name: "Mild",    value:  96, color: "#22c55e" },
    { name: "Warm",    value: 168, color: "#eab308" },
    { name: "Hot",     value: 200, color: "#f97316" },
    { name: "Extreme", value:  34, color: "#ef4444" },
  ],
  heat_trend: [
    { month: "Jan", avg: 28.0, max: 34.0 },
    { month: "Feb", avg: 29.5, max: 36.5 },
    { month: "Mar", avg: 32.1, max: 39.2 },
    { month: "Apr", avg: 33.0, max: 41.5 },
    { month: "May", avg: 31.8, max: 40.0 },
    { month: "Jun", avg: 29.4, max: 37.1 },
    { month: "Jul", avg: 28.6, max: 35.8 },
    { month: "Aug", avg: 29.1, max: 36.2 },
    { month: "Sep", avg: 30.4, max: 38.0 },
    { month: "Oct", avg: 31.2, max: 39.5 },
    { month: "Nov", avg: 29.8, max: 37.4 },
    { month: "Dec", avg: 28.2, max: 34.8 },
  ],
  model_meta: {
    algorithm: "XGBoost Regressor + SHAP",
    version: "v1.4.2 (Production)",
    trainedOn: "HeatSatAI Canonical Data",
    samples: 9695,
    r2: 0.9746,
    rmse: 0.3463,
    mae: 0.2070,
    lastRun: "2026-07-24",
  },
};

// Generate realistic hotspot grid around Bengaluru
function _makeHotspots(): Hotspot[] {
  const base = BENGALURU_CENTER;
  const areas = [
    "Majestic", "Koramangala", "Whitefield", "Electronic City", "Hebbal",
    "Yelahanka", "Marathahalli", "HSR Layout", "BTM Layout", "Jayanagar",
    "Rajajinagar", "Basavanagudi", "Indiranagar", "Banashankari", "Peenya",
    "KR Puram", "Anekal", "Devanahalli", "Doddaballapur", "Tumkur Road",
    "Sarjapur", "Bommanahalli", "Bellandur", "Varthur", "Kadugodi",
    "Horamavu", "Banaswadi", "CV Raman Nagar", "Nagarbhavi", "Kengeri",
  ];
  const landCovers = ["urban", "industrial", "residential", "barren", "vegetation"];

  return areas.map((name, i) => {
    const lst = 44 - i * 0.5 + Math.sin(i) * 1.2;
    const cat = lst > 43 ? "extreme" : lst > 38 ? "hot" : lst > 33 ? "warm" : lst > 28 ? "mild" : "cool";
    const risk = lst > 43 ? "critical" : lst > 38 ? "high" : lst > 33 ? "moderate" : "low";
    return {
      id: `hs-${String(i).padStart(3, "0")}`,
      name,
      lat: base[0] + (Math.sin(i * 0.9) * 0.18),
      lng: base[1] + (Math.cos(i * 0.9) * 0.22),
      lst,
      ndvi: Math.max(0.05, 0.4 - i * 0.008),
      ndbi: Math.min(0.6, 0.15 + i * 0.012),
      population: 8000 + i * 1200,
      landCover: landCovers[i % landCovers.length],
      category: cat as Hotspot["category"],
      risk,
      confidence: 0.88 + Math.random() * 0.1,
      featureContributions: [
        { feature: "NDBI (Built-up Index)", value:  0.28 + i * 0.004 },
        { feature: "NDVI (Vegetation)",     value: -0.18 - i * 0.003 },
        { feature: "Albedo",                value:  0.14 },
        { feature: "Impervious Surface %",  value:  0.10 },
        { feature: "Night Lights",          value:  0.07 },
      ],
      recommendations: ["Increase tree canopy coverage", "Cool / Reflective Roofs", "Green corridors"],
    };
  });
}

function _makeGridCells(): GridCell[] {
  const base = BENGALURU_CENTER;
  const cells: GridCell[] = [];
  for (let i = 0; i < 500; i++) {
    const lat = base[0] + (Math.random() - 0.5) * 0.5;
    const lng = base[1] + (Math.random() - 0.5) * 0.5;
    const lst = 26 + Math.random() * 20;
    const cat = lst > 43 ? "extreme" : lst > 38 ? "hot" : lst > 33 ? "warm" : lst > 28 ? "mild" : "cool";
    cells.push({ id: `g-${i}`, lat, lng, lst, category: cat as GridCell["category"] });
  }
  return cells;
}

const MOCK_HOTSPOTS: Hotspot[] = _makeHotspots();
const MOCK_GRID: GridCell[] = _makeGridCells();

const MOCK_FEATURE_IMPORTANCE: FeatureImportance[] = [
  { feature: "NDBI (Built-up Index)",     importance: 0.282 },
  { feature: "NDVI (Vegetation Index)",   importance: 0.224 },
  { feature: "Albedo",                    importance: 0.148 },
  { feature: "Impervious Surface %",      importance: 0.121 },
  { feature: "Night Light Intensity",     importance: 0.089 },
  { feature: "Distance to Water",         importance: 0.067 },
  { feature: "Building Density",          importance: 0.042 },
  { feature: "Road Density",              importance: 0.027 },
];

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: "r1", title: "Increase Tree Canopy",       description: "Plant native shade trees along major roads and residential blocks to provide direct shading and evapotranspirative cooling.", impact: 2.8, priority: "high",   cost: "low",    difficulty: "moderate", category: "Green Infrastructure" },
  { id: "r2", title: "Cool / Reflective Roofs",    description: "Retrofit flat rooftops with high-albedo cool-roof coatings or white paint to reflect more solar radiation.", impact: 2.1, priority: "high",   cost: "medium", difficulty: "easy",     category: "Building Retrofit" },
  { id: "r3", title: "Urban Wetland Restoration",  description: "Restore or create urban wetlands and detention ponds to leverage evaporative cooling effects.", impact: 1.9, priority: "medium", cost: "high",   difficulty: "hard",     category: "Blue Infrastructure" },
  { id: "r4", title: "Green Corridors",            description: "Connect isolated green patches with tree-lined corridors to enable cool-air ventilation pathways.", impact: 1.6, priority: "medium", cost: "medium", difficulty: "moderate", category: "Green Infrastructure" },
  { id: "r5", title: "Permeable Pavements",        description: "Replace impervious asphalt with permeable paving to allow water infiltration and reduce surface heating.", impact: 1.2, priority: "low",    cost: "medium", difficulty: "moderate", category: "Urban Design" },
  { id: "r6", title: "Vertical Green Walls",       description: "Install planted vertical surfaces on building façades to insulate walls and reduce surface temperatures.", impact: 0.9, priority: "low",    cost: "medium", difficulty: "easy",     category: "Building Retrofit" },
];

// ─── Try real API, fall back to mock data ─────────────────────────────────

const BASE_URL = "/api/v1";

async function tryFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 3000); // 3 s timeout
    const res = await fetch(`${BASE_URL}${path}`, { signal: ctrl.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json() as Promise<T>;
  } catch {
    // API unavailable — return pre-computed mock data instantly
    return fallback;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────

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
  land_cover_dist:   { name: string; value: number; color: string }[];
  heat_category_dist: { name: string; value: number; color: string }[];
  heat_trend: { month: string; avg: number; max: number }[];
  model_meta: {
    algorithm: string; version: string; trainedOn: string;
    samples: number; r2: number; rmse: number; mae: number; lastRun: string;
  };
}

export async function fetchStatistics(): Promise<StatisticsResponse> {
  return tryFetch<StatisticsResponse>("/statistics", MOCK_STATISTICS);
}

export async function fetchHotspots(): Promise<Hotspot[]> {
  return tryFetch<Hotspot[]>("/hotspots", MOCK_HOTSPOTS);
}

export async function fetchHeatmap(): Promise<GridCell[]> {
  return tryFetch<GridCell[]>("/heatmap", MOCK_GRID);
}

export async function fetchFeatureImportance(): Promise<FeatureImportance[]> {
  return tryFetch<FeatureImportance[]>("/feature-importance", MOCK_FEATURE_IMPORTANCE);
}

export async function fetchRecommendations(hotspotId?: string): Promise<Recommendation[]> {
  const query = hotspotId ? `?hotspot_id=${encodeURIComponent(hotspotId)}` : "";
  // Deterministic selection per hotspot for the mock path
  if (hotspotId) {
    const idx = [...hotspotId].reduce((a, c) => a + c.charCodeAt(0), 0) % MOCK_RECOMMENDATIONS.length;
    const fallback = MOCK_RECOMMENDATIONS.slice(idx, idx + 3).concat(MOCK_RECOMMENDATIONS.slice(0, Math.max(0, 3 - (MOCK_RECOMMENDATIONS.length - idx))));
    return tryFetch<Recommendation[]>(`/recommendations${query}`, fallback);
  }
  return tryFetch<Recommendation[]>("/recommendations", MOCK_RECOMMENDATIONS);
}
