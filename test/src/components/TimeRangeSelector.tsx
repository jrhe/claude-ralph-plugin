'use client';

import { TimeRange } from '@/types';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  options?: TimeRange[];
}

const defaultOptions: TimeRange[] = ['7d', '30d', '90d', '1y'];

const labels: Record<TimeRange, string> = {
  '7d': '7 Days',
  '30d': '30 Days',
  '90d': '90 Days',
  '1y': '1 Year',
};

export function TimeRangeSelector({
  value,
  onChange,
  options = defaultOptions,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            value === option
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
          }`}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}
