/**
 * useTrends Hook
 * Fetch and manage trends data
 */

import useSWR from 'swr';
import { trendsApi } from '@/lib/api';

export function useTrends(params?: { limit?: number; date?: string }) {
  const { data, error, mutate, isLoading } = useSWR(
    ['/api/trends', params],
    () => trendsApi.getAll(params),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  );

  return {
    trends: data?.trends || [],
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useLatestTrend() {
  const { data, error, mutate, isLoading } = useSWR(
    '/api/trends/latest',
    () => trendsApi.getLatest(),
    {
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  );

  return {
    trend: data?.trend,
    isLoading,
    isError: error,
    mutate,
  };
}
