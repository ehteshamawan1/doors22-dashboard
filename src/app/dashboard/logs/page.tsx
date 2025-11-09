/**
 * Logs Page
 * System activity and event logs
 */

'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

// Mock logs for demonstration
const generateMockLogs = () => [
  {
    id: '1',
    type: 'content_generation',
    status: 'success',
    message: 'Content generated successfully',
    postId: '2025-11-08-001',
    contentType: 'image',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    type: 'trend_analysis',
    status: 'success',
    message: 'Daily trend analysis completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '3',
    type: 'post_approved',
    status: 'info',
    message: 'Post approved by admin',
    postId: '2025-11-07-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    type: 'content_generation',
    status: 'success',
    message: 'Video content generated',
    postId: '2025-11-07-002',
    contentType: 'video',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '5',
    type: 'posting_skipped',
    status: 'warning',
    message: 'Meta API not configured - post skipped',
    postId: '2025-11-07-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
  },
  {
    id: '6',
    type: 'analytics',
    status: 'success',
    message: 'Weekly analytics report generated',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Fetch posts with their approval history to create activity logs
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=50`);

        if (!response.ok) {
          console.error('Failed to fetch logs from API, using mock data');
          setLogs(generateMockLogs());
          return;
        }

        const data = await response.json();
        const posts = data.posts || [];

        // Transform posts into log entries
        const activityLogs = posts.flatMap((post: any) => {
          const logs = [];

          // Add creation log
          logs.push({
            id: `${post.id}-created`,
            type: 'content_generation',
            status: 'success',
            message: `${post.contentType || 'Content'} generated successfully`,
            postId: post.id,
            contentType: post.contentType,
            timestamp: post.createdAt,
          });

          // Add approval logs based on status
          if (post.status === 'approved') {
            logs.push({
              id: `${post.id}-approved`,
              type: 'post_approved',
              status: 'info',
              message: 'Post approved',
              postId: post.id,
              timestamp: post.approvedAt || post.updatedAt,
            });
          } else if (post.status === 'rejected') {
            logs.push({
              id: `${post.id}-rejected`,
              type: 'post_rejected',
              status: 'warning',
              message: post.rejectionReason || 'Post rejected',
              postId: post.id,
              timestamp: post.updatedAt,
            });
          } else if (post.status === 'posted') {
            logs.push({
              id: `${post.id}-posted`,
              type: 'post_published',
              status: 'success',
              message: 'Post published successfully',
              postId: post.id,
              timestamp: post.postedAt || post.updatedAt,
            });
          }

          return logs;
        });

        // Sort by timestamp descending
        activityLogs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setLogs(activityLogs);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setLogs(generateMockLogs());
      }
    };

    fetchLogs();
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
      case 'analytics':
        return '📈';
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

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.length > 0 ? (
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
            <p className="text-gray-600">No system logs match your filter</p>
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
