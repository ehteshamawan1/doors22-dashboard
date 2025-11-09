/**
 * usePosts Hook
 * Fetch and manage posts data
 */

import useSWR from 'swr';
import { postsApi } from '@/lib/api';

export function usePosts(params?: { status?: string; type?: string; limit?: number }) {
  const { data, error, mutate, isLoading } = useSWR(
    ['/api/posts', params],
    () => postsApi.getAll(params),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    posts: data?.posts || [],
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate,
  };
}

export function usePendingPosts(limit?: number) {
  const { data, error, mutate, isLoading } = useSWR(
    ['/api/posts/pending', limit],
    () => postsApi.getPending(limit),
    {
      refreshInterval: 10000, // Refresh every 10 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    posts: data?.posts || [],
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate,
  };
}

export function usePost(id: string | null) {
  const { data, error, mutate, isLoading } = useSWR(
    id ? `/api/posts/${id}` : null,
    id ? () => postsApi.getById(id) : null
  );

  return {
    post: data?.post,
    isLoading,
    isError: error,
    mutate,
  };
}

export function usePostStatistics() {
  const { data, error, mutate, isLoading } = useSWR(
    '/api/posts/statistics',
    () => postsApi.getStatistics(),
    {
      refreshInterval: 60000, // Refresh every minute
    }
  );

  return {
    statistics: data?.statistics,
    isLoading,
    isError: error,
    mutate,
  };
}
