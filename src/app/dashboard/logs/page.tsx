/**
 * Logs Page
 * System activity and event logs - fetches REAL logs from Firebase
 */

'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { logsApi } from '@/lib/api';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch real logs from Firebase logs collection
        const data = await logsApi.getAll({ limit: 100 });

        if (data.success && data.logs) {
          // Transform logs to have consistent status field
          const transformedLogs = data.logs.map((log: any) => {
            // Determine status based on log type
            let status = 'info';
            if (log.type?.includes('success') || log.type === 'posting_success' || log.type === 'immediate_posting_success') {
              status = 'success';
            } else if (log.type?.includes('error') || log.type === 'posting_error' || log.type === 'immediate_posting_error') {
              status = 'error';
            } else if (log.type?.includes('warning') || log.type === 'immediate_posting_failed') {
              status = 'warning';
            }

            // Build message from log data
            let message = log.message || log.type || 'Unknown event';
            if (log.error) {
              message = `${message}: ${log.error}`;
            }
            if (log.errors && log.errors.length > 0) {
              message = `${message}: ${log.errors.map((e: any) => e.error || e.message || JSON.stringify(e)).join(', ')}`;
            }

            return {
              ...log,
              status,
              message,
            };
          });

          setLogs(transformedLogs);
        } else {
          setLogs([]);
        }
      } catch (err: any) {
        console.error('Error fetching logs:', err);
        setError(err.message || 'Failed to fetch logs');
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();

    // Refresh logs every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = filter === 'all'
    ? logs
    : logs.filter(log => log.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content_generation':
        return '🎨';
      case 'trend_analysis':
        return '📊';
      case 'post_approved':
        return '✅';
      case 'posting_skipped':
        return '⏭️';
      case 'posting_success':
      case 'immediate_posting_success':
        return '🚀';
      case 'posting_error':
      case 'immediate_posting_error':
      case 'immediate_posting_failed':
        return '❌';
      case 'analytics':
        return '📈';
      case 'auto_reply':
        return '💬';
      default:
        return '📝';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Logs</h1>
        <p className="text-gray-600">Monitor system activity and events</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex gap-2">
          {['all', 'success', 'warning', 'error', 'info'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="card bg-red-50 border border-red-200 mb-6">
          <p className="text-red-700">Error loading logs: {error}</p>
        </div>
      )}

      {/* Logs List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div key={log.id} className="card-hover">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-2xl">{getTypeIcon(log.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`badge ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(log.timestamp, 'relative')}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {log.message}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Type: {log.type}</span>
                    {log.postId && <span>Post ID: {log.postId}</span>}
                    {log.contentType && <span>Content: {log.contentType}</span>}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-400 text-right whitespace-nowrap">
                  {formatDate(log.timestamp, 'short')}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-16">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Logs Found</h2>
            <p className="text-gray-600">
              {logs.length === 0
                ? 'No logs have been recorded yet. Logs will appear when content is generated, approved, or posted.'
                : 'No system logs match your filter'
              }
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-900">
              {logs.filter(l => l.status === 'success').length}
            </p>
            <p className="text-sm text-green-600">Success</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-900">
              {logs.filter(l => l.status === 'warning').length}
            </p>
            <p className="text-sm text-yellow-600">Warnings</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-900">
              {logs.filter(l => l.status === 'error').length}
            </p>
            <p className="text-sm text-red-600">Errors</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-900">
              {logs.filter(l => l.status === 'info').length}
            </p>
            <p className="text-sm text-blue-600">Info</p>
          </div>
        </div>
      </div>
    </div>
  );
}
