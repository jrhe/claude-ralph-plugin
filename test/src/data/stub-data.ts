import { Cat, DailyMetric, SharedResources, Alert } from '@/types';

// Sample cats
export const cats: Cat[] = [
  {
    id: 'cat-1',
    name: 'Whiskers',
    photoUrl: '/cats/whiskers.jpg',
    birthDate: '2020-03-15',
    breed: 'Tabby',
    targetWeight: 4.5,
  },
  {
    id: 'cat-2',
    name: 'Luna',
    photoUrl: '/cats/luna.jpg',
    birthDate: '2019-08-22',
    breed: 'Siamese',
    targetWeight: 4.0,
  },
  {
    id: 'cat-3',
    name: 'Oliver',
    photoUrl: '/cats/oliver.jpg',
    birthDate: '2021-01-10',
    breed: 'Maine Coon',
    targetWeight: 6.5,
  },
];

// Helper to generate dates for the past N days
function generateDates(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// Helper to add random variation
function vary(base: number, variance: number): number {
  return base + (Math.random() - 0.5) * 2 * variance;
}

// Generate 90 days of metrics for each cat
function generateMetrics(): DailyMetric[] {
  const dates = generateDates(90);
  const metrics: DailyMetric[] = [];

  // Whiskers - normal cat with slight weight gain trend
  let whiskersWeight = 4.3;
  dates.forEach((date, index) => {
    // Gradual weight increase
    whiskersWeight += 0.005;

    // Add anomaly: sudden weight drop around day 60-65
    let weight = vary(whiskersWeight, 0.05);
    if (index >= 55 && index <= 60) {
      weight = vary(4.0, 0.05); // Anomaly: weight drop
    }

    // Normal food and water with anomaly around day 70-75
    let food = vary(55, 8);
    let water = vary(180, 20);

    // Anomaly: reduced appetite
    if (index >= 70 && index <= 75) {
      food = vary(25, 5); // Low food consumption
      water = vary(90, 15); // Low water consumption
    }

    metrics.push({
      date,
      catId: 'cat-1',
      weight: Math.round(weight * 100) / 100,
      foodConsumed: Math.max(0, Math.round(food)),
      waterConsumed: Math.max(0, Math.round(water)),
    });
  });

  // Luna - healthy cat, consistent metrics
  let lunaWeight = 3.9;
  dates.forEach((date) => {
    lunaWeight = vary(4.0, 0.08);

    metrics.push({
      date,
      catId: 'cat-2',
      weight: Math.round(lunaWeight * 100) / 100,
      foodConsumed: Math.max(0, Math.round(vary(50, 6))),
      waterConsumed: Math.max(0, Math.round(vary(160, 18))),
    });
  });

  // Oliver - larger cat with some weight fluctuation
  let oliverWeight = 6.3;
  dates.forEach((date, index) => {
    // Some natural fluctuation
    oliverWeight = vary(6.4, 0.15);

    // Anomaly: gradual weight loss over last 20 days (potential health concern)
    if (index >= 70) {
      oliverWeight = 6.4 - (index - 70) * 0.03;
    }

    metrics.push({
      date,
      catId: 'cat-3',
      weight: Math.round(oliverWeight * 100) / 100,
      foodConsumed: Math.max(0, Math.round(vary(75, 10))),
      waterConsumed: Math.max(0, Math.round(vary(220, 25))),
    });
  });

  return metrics;
}

export const dailyMetrics: DailyMetric[] = generateMetrics();

// Current shared resource levels
export const sharedResources: SharedResources = {
  foodBowls: [
    { catId: 'cat-1', currentLevel: 65, capacity: 200 },
    { catId: 'cat-2', currentLevel: 45, capacity: 200 },
    { catId: 'cat-3', currentLevel: 30, capacity: 300 }, // Low food level for alert
  ],
  waterFountain: {
    currentLevel: 72,
    capacity: 2000,
  },
  litterTray: {
    wasteLevel: 78, // High waste level for alert
    hopperLevel: 35, // Low hopper for alert
  },
};

// Pre-computed alerts based on recent data anomalies
export const alerts: Alert[] = [
  {
    id: 'alert-1',
    catId: 'cat-1',
    type: 'low_food',
    severity: 'warning',
    message: 'Whiskers has been eating less than usual over the past few days',
    metric: 'Daily food consumption',
    value: 25,
    threshold: 40,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alert-2',
    catId: 'cat-1',
    type: 'low_water',
    severity: 'warning',
    message: 'Whiskers water intake has decreased significantly',
    metric: 'Daily water consumption',
    value: 90,
    threshold: 120,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alert-3',
    catId: 'cat-3',
    type: 'weight_change',
    severity: 'critical',
    message: 'Oliver has lost weight consistently over the past 3 weeks',
    metric: 'Weight trend',
    value: -0.6,
    threshold: -0.3,
    createdAt: new Date().toISOString(),
  },
];
