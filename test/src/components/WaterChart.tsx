'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DailyMetric, TimeRange } from '@/types';
import { TimeRangeSelector } from './TimeRangeSelector';

interface WaterChartProps {
  metrics: DailyMetric[];
}

interface ChartDataPoint {
  date: string;
  water: number;
  displayDate: string;
}

function filterByRange(metrics: DailyMetric[], range: TimeRange): DailyMetric[] {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  return metrics.filter((m) => m.date >= cutoffStr);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function WaterChart({ metrics }: WaterChartProps) {
  const [range, setRange] = useState<TimeRange>('30d');

  const filteredMetrics = filterByRange(metrics, range);

  const chartData: ChartDataPoint[] = filteredMetrics.map((m) => ({
    date: m.date,
    water: m.waterConsumed,
    displayDate: formatDate(m.date),
  }));

  // Calculate average for reference
  const avgWater =
    chartData.length > 0
      ? chartData.reduce((sum, d) => sum + d.water, 0) / chartData.length
      : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Water Consumption
        </h2>
        <TimeRangeSelector
          value={range}
          onChange={setRange}
          options={['7d', '30d', '90d']}
        />
      </div>

      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 12 }}
                className="text-zinc-600 dark:text-zinc-400"
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="text-zinc-600 dark:text-zinc-400"
                tickFormatter={(value) => `${value}ml`}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--foreground)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value) => {
                  if (typeof value === 'number') {
                    return [`${value}ml`, 'Water'];
                  }
                  return ['—', 'Water'];
                }}
              />
              <Bar
                dataKey="water"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
          No water data available for this time range
        </p>
      )}

      <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Average: {avgWater.toFixed(0)}ml per day
      </div>
    </div>
  );
}
