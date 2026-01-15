'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Cat, DailyMetric } from '@/types';

interface CatCardProps {
  cat: Cat;
  todayMetrics: DailyMetric | null;
}

interface MetricStatus {
  isNormal: boolean;
  indicator: 'normal' | 'warning' | 'critical';
}

function getWeightStatus(weight: number | undefined, target: number | undefined): MetricStatus {
  if (!weight || !target) return { isNormal: true, indicator: 'normal' };
  const deviation = Math.abs(weight - target) / target;
  if (deviation > 0.15) return { isNormal: false, indicator: 'critical' };
  if (deviation > 0.08) return { isNormal: false, indicator: 'warning' };
  return { isNormal: true, indicator: 'normal' };
}

function getFoodStatus(food: number): MetricStatus {
  if (food < 30) return { isNormal: false, indicator: 'critical' };
  if (food < 40) return { isNormal: false, indicator: 'warning' };
  return { isNormal: true, indicator: 'normal' };
}

function getWaterStatus(water: number): MetricStatus {
  if (water < 100) return { isNormal: false, indicator: 'critical' };
  if (water < 130) return { isNormal: false, indicator: 'warning' };
  return { isNormal: true, indicator: 'normal' };
}

function StatusIndicator({ status }: { status: MetricStatus }) {
  if (status.isNormal) return null;

  const colors = {
    warning: 'bg-amber-500',
    critical: 'bg-red-500',
    normal: 'bg-green-500',
  };

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colors[status.indicator]} ml-1`}
      title={status.indicator === 'warning' ? 'Outside normal range' : 'Critical'}
    />
  );
}

export function CatCard({ cat, todayMetrics }: CatCardProps) {
  const weight = todayMetrics?.weight;
  const food = todayMetrics?.foodConsumed ?? 0;
  const water = todayMetrics?.waterConsumed ?? 0;

  const weightStatus = getWeightStatus(weight, cat.targetWeight);
  const foodStatus = getFoodStatus(food);
  const waterStatus = getWaterStatus(water);

  const hasAnyWarning = !weightStatus.isNormal || !foodStatus.isNormal || !waterStatus.isNormal;

  return (
    <Link href={`/cat/${cat.id}`}>
      <div
        className={`relative bg-white dark:bg-zinc-900 rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer border ${
          hasAnyWarning ? 'border-amber-300 dark:border-amber-600' : 'border-zinc-200 dark:border-zinc-800'
        }`}
      >
        {hasAnyWarning && (
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
        )}

        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
            <Image
              src={cat.photoUrl}
              alt={cat.name}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-3xl">
              🐱
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {cat.name}
            </h3>
            {cat.breed && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{cat.breed}</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-2">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Weight
              <StatusIndicator status={weightStatus} />
            </div>
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {weight ? `${weight.toFixed(1)} kg` : '—'}
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-2">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Food
              <StatusIndicator status={foodStatus} />
            </div>
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {food}g
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-2">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Water
              <StatusIndicator status={waterStatus} />
            </div>
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {water}ml
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
