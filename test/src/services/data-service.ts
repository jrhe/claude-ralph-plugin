import { Cat, DailyMetric, SharedResources, Alert, DataService, TimeRange } from '@/types';
import { cats, dailyMetrics, sharedResources, alerts } from '@/data/stub-data';

// Map time range to number of days
function timeRangeToDays(range: TimeRange): number {
  switch (range) {
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '90d':
      return 90;
    case '1y':
      return 365;
  }
}

// Stub data service implementation
// This can be swapped out for a real data service (e.g., Home Assistant) later
class StubDataService implements DataService {
  private cats: Cat[] = [...cats];
  private nextCatId = 4;

  async getCats(): Promise<Cat[]> {
    return [...this.cats];
  }

  async getCatById(id: string): Promise<Cat | null> {
    return this.cats.find((cat) => cat.id === id) || null;
  }

  async getMetricsForCat(catId: string, range: TimeRange): Promise<DailyMetric[]> {
    const days = timeRangeToDays(range);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    return dailyMetrics.filter(
      (metric) => metric.catId === catId && metric.date >= cutoffStr
    );
  }

  async getSharedResources(): Promise<SharedResources> {
    return { ...sharedResources };
  }

  async getAlerts(): Promise<Alert[]> {
    return [...alerts];
  }

  async addCat(catData: Omit<Cat, 'id'>): Promise<Cat> {
    const newCat: Cat = {
      ...catData,
      id: `cat-${this.nextCatId++}`,
    };
    this.cats.push(newCat);
    return newCat;
  }

  async updateCat(id: string, updates: Partial<Omit<Cat, 'id'>>): Promise<Cat | null> {
    const index = this.cats.findIndex((cat) => cat.id === id);
    if (index === -1) return null;

    this.cats[index] = { ...this.cats[index], ...updates };
    return this.cats[index];
  }
}

// Export a singleton instance
// This can be replaced with a different implementation (e.g., HomeAssistantDataService)
export const dataService: DataService = new StubDataService();

// Re-export the interface for type checking
export type { DataService };
