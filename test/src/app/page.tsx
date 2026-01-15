import { dataService } from '@/services';
import { CatCard } from '@/components';
import { DailyMetric } from '@/types';

export default async function Home() {
  const cats = await dataService.getCats();

  // Get today's date string
  const today = new Date().toISOString().split('T')[0];

  // Fetch metrics for each cat and find today's data
  const catMetricsMap = new Map<string, DailyMetric | null>();
  for (const cat of cats) {
    const metrics = await dataService.getMetricsForCat(cat.id, '7d');
    const todayMetrics = metrics.find((m) => m.date === today) || metrics[metrics.length - 1] || null;
    catMetricsMap.set(cat.id, todayMetrics);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Cat Health Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Monitor your cats&apos; health and habits at a glance
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section>
          <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
            Your Cats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cats.map((cat) => (
              <CatCard
                key={cat.id}
                cat={cat}
                todayMetrics={catMetricsMap.get(cat.id) || null}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
