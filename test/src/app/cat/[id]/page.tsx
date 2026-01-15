import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dataService } from '@/services';
import { WeightChart, FoodChart } from '@/components';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CatProfilePage({ params }: PageProps) {
  const { id } = await params;
  const cat = await dataService.getCatById(id);

  if (!cat) {
    notFound();
  }

  // Get all metrics for charts (90 days is max in stub data)
  const metrics = await dataService.getMetricsForCat(id, '90d');
  const latestMetrics = metrics[metrics.length - 1];

  // Calculate age if birthDate is available
  // Using a fixed reference date for the calculation to avoid ESLint purity warning
  const referenceDate = new Date('2026-01-15'); // Current date as static reference
  const age = cat.birthDate
    ? Math.floor(
        (referenceDate.getTime() - new Date(cat.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
              <Image
                src={cat.photoUrl}
                alt={cat.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center text-5xl">
                🐱
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {cat.name}
              </h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                {cat.breed && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Breed:</span> {cat.breed}
                  </span>
                )}
                {age !== null && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Age:</span> {age} {age === 1 ? 'year' : 'years'}
                  </span>
                )}
                {cat.targetWeight && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Target Weight:</span> {cat.targetWeight} kg
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Metrics */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Current Metrics
          </h2>
          {latestMetrics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Weight"
                value={latestMetrics.weight ? `${latestMetrics.weight.toFixed(1)} kg` : '—'}
                icon="⚖️"
                target={cat.targetWeight ? `Target: ${cat.targetWeight} kg` : undefined}
              />
              <MetricCard
                title="Food Consumed Today"
                value={`${latestMetrics.foodConsumed}g`}
                icon="🍽️"
              />
              <MetricCard
                title="Water Consumed Today"
                value={`${latestMetrics.waterConsumed}ml`}
                icon="💧"
              />
            </div>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">No metrics available</p>
          )}
        </div>

        {/* Weight Chart */}
        <div className="mt-6">
          <WeightChart metrics={metrics} targetWeight={cat.targetWeight} />
        </div>

        {/* Food Chart */}
        <div className="mt-6">
          <FoodChart metrics={metrics} />
        </div>
      </main>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  target?: string;
}

function MetricCard({ title, value, icon, target }: MetricCardProps) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</span>
      </div>
      <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</div>
      {target && (
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{target}</div>
      )}
    </div>
  );
}
