'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DailyMetric, TimeRange } from '@/types';
import { TimeRangeSelector } from './TimeRangeSelector';

interface WeightChartProps {
  metrics: DailyMetric[];
  targetWeight?: number;
}

interface ChartDataPoint {
  date: string;
  weight: number | null;
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

export function WeightChart({ metrics, targetWeight }: WeightChartProps) {
  const [range, setRange] = useState<TimeRange>('30d');

  const filteredMetrics = filterByRange(metrics, range);

  const chartData: ChartDataPoint[] = filteredMetrics.map((m) => ({
    date: m.date,
    weight: m.weight ?? null,
    displayDate: formatDate(m.date),
  }));

  // Calculate Y-axis domain
  const weights = chartData.map((d) => d.weight).filter((w): w is number => w !== null);
  const minWeight = Math.min(...weights, targetWeight ?? Infinity);
  const maxWeight = Math.max(...weights, targetWeight ?? -Infinity);
  const padding = (maxWeight - minWeight) * 0.1 || 0.5;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Weight Trend
        </h2>
        <TimeRangeSelector value={range} onChange={setRange} />
      </div>

      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 12 }}
                className="text-zinc-600 dark:text-zinc-400"
                tickLine={false}
              />
              <YAxis
                domain={[minWeight - padding, maxWeight + padding]}
                tick={{ fontSize: 12 }}
                className="text-zinc-600 dark:text-zinc-400"
                tickFormatter={(value) => `${value.toFixed(1)}`}
                tickLine={false}
                axisLine={false}
                width={45}
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
                    return [`${value.toFixed(2)} kg`, 'Weight'];
                  }
                  return ['—', 'Weight'];
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
              {targetWeight && (
                <Line
                  type="monotone"
                  dataKey={() => targetWeight}
                  stroke="#10b981"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
          No weight data available for this time range
        </p>
      )}

      {targetWeight && (
        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="w-4 h-0.5 bg-green-500" style={{ borderStyle: 'dashed' }}></span>
          <span>Target: {targetWeight} kg</span>
        </div>
      )}
    </div>
  );
}
