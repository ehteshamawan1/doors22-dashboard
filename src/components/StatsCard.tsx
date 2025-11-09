/**
 * StatsCard Component
 * Display statistics with icon and trend
 */

'use client';

import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = 'blue',
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="stat-card">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>

        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}

        {trend && (
          <div className="flex items-center mt-2">
            <svg
              className={`w-4 h-4 ${trend.isPositive ? 'text-green-500' : 'text-red-500'} ${
                trend.isPositive ? '' : 'rotate-180'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <span
              className={`text-sm font-medium ml-1 ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.value}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs last period</span>
          </div>
        )}
      </div>

      <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
        {icon}
      </div>
    </div>
  );
}
