// Cat profile types
export interface Cat {
  id: string;
  name: string;
  photoUrl: string;
  birthDate?: string;
  breed?: string;
  targetWeight?: number; // Target healthy weight in kg
}

// Daily metric records for each cat
export interface DailyMetric {
  date: string; // ISO date string (YYYY-MM-DD)
  catId: string;
  weight?: number; // Weight in kg
  foodConsumed: number; // Food consumed in grams
  waterConsumed: number; // Water consumed in ml
}

// Shared resource types
export interface SharedResources {
  foodBowls: FoodBowl[];
  waterFountain: WaterFountain;
  litterTray: LitterTray;
}

export interface FoodBowl {
  catId: string;
  currentLevel: number; // 0-100 percentage
  capacity: number; // Total capacity in grams
}

export interface WaterFountain {
  currentLevel: number; // 0-100 percentage
  capacity: number; // Total capacity in ml
}

export interface LitterTray {
  wasteLevel: number; // 0-100 percentage (how full of waste)
  hopperLevel: number; // 0-100 percentage (fresh litter remaining)
}

// Alert types
export type AlertSeverity = 'warning' | 'critical';
export type AlertType = 'weight_change' | 'low_food' | 'low_water';

export interface Alert {
  id: string;
  catId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  metric: string;
  value: number;
  threshold: number;
  createdAt: string;
}

// Time range options for charts
export type TimeRange = '7d' | '30d' | '90d' | '1y';

// Data service interface for future swapping
export interface DataService {
  getCats(): Promise<Cat[]>;
  getCatById(id: string): Promise<Cat | null>;
  getMetricsForCat(catId: string, range: TimeRange): Promise<DailyMetric[]>;
  getSharedResources(): Promise<SharedResources>;
  getAlerts(): Promise<Alert[]>;
  addCat(cat: Omit<Cat, 'id'>): Promise<Cat>;
  updateCat(id: string, updates: Partial<Omit<Cat, 'id'>>): Promise<Cat | null>;
}
