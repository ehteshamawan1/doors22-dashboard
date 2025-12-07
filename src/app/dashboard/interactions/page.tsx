/**
 * Interactions Page
 * Displays customer interactions (comments and DMs) from Instagram and Facebook
 * Fetches real data from the API
 */

'use client';

import { useState, useEffect } from 'react';
import { interactionsApi } from '@/lib/api';

interface Interaction {
  id: string;
  platform: 'instagram' | 'facebook';
  type: 'comment' | 'dm';
  category: string;
  userMessage: string;
  botResponse?: string;
  user: {
    id: string;
    username: string;
  };
  timestamp: string;
  status: 'pending' | 'responded' | 'failed';
  respondedAt?: string;
  redirected?: boolean;
  postId?: string;
}

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Fetch interactions from API
  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build query params
        const params: any = { limit: 50 };
        if (platformFilter !== 'all') params.platform = platformFilter;
        if (typeFilter !== 'all') params.type = typeFilter;
        if (categoryFilter !== 'all') params.category = categoryFilter;

        const response = await interactionsApi.getAll(params);
        setInteractions(response.interactions || []);
      } catch (err: any) {
        console.error('Error fetching interactions:', err);
        setError(err.message || 'Failed to load interactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInteractions();
  }, [platformFilter, typeFilter, categoryFilter]);

  // Format date to Eastern Time
  const formatDate = (dateString: string, style: 'full' | 'short' | 'relative' = 'short') => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (style === 'relative') {
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
      }

      return date.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) + ' ET';
    } catch {
      return dateString;
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'instagram' ? '📸' : '👥';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'price_inquiry':
      case 'pricing':
        return 'text-blue-600 bg-blue-50';
      case 'technical_question':
      case 'product':
        return 'text-purple-600 bg-purple-50';
      case 'compliment':
      case 'feedback':
        return 'text-green-600 bg-green-50';
      case 'faq':
      case 'support':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'comment' ? '💬' : '📩';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'responded':
        return <span className="badge bg-green-100 text-green-700">Responded</span>;
      case 'pending':
        return <span className="badge bg-yellow-100 text-yellow-700">Pending</span>;
      case 'failed':
        return <span className="badge bg-red-100 text-red-700">Failed</span>;
      default:
        return <span className="badge bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactions</h1>
        <p className="text-gray-600">Monitor and manage comments & DMs from Instagram and Facebook</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="space-y-4">
          {/* Platform Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Platform</label>
            <div className="flex gap-2">
              {['all', 'instagram', 'facebook'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => setPlatformFilter(platform)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    platformFilter === platform
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
            <div className="flex gap-2">
              {['all', 'comment', 'dm'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    typeFilter === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'dm' ? 'DM' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {['all', 'price_inquiry', 'technical_question', 'compliment', 'faq'].map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <svg className="animate-spin w-8 h-8 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Loading interactions...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-center text-red-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Error: {error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 btn-secondary btn-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && interactions.length === 0 && (
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Interactions Yet</h2>
          <p className="text-gray-600">Customer comments and messages will appear here once they interact with your posts</p>
        </div>
      )}

      {/* Interactions List */}
      {!isLoading && !error && interactions.length > 0 && (
        <div className="space-y-3">
          {interactions.map((interaction) => (
            <div key={interaction.id} className="card-hover">
              <div className="flex items-start gap-4">
                {/* Platform & Type Icons */}
                <div className="flex flex-col items-center gap-1">
                  <div className="text-2xl">{getPlatformIcon(interaction.platform)}</div>
                  <div className="text-xl">{getTypeIcon(interaction.type)}</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-medium text-gray-900">@{interaction.user?.username || 'unknown'}</span>
                    <span className={`badge ${getCategoryColor(interaction.category)}`}>
                      {interaction.category?.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'General'}
                    </span>
                    {getStatusBadge(interaction.status)}
                    <span className="text-xs text-gray-500">
                      {formatDate(interaction.timestamp, 'relative')}
                    </span>
                    {interaction.redirected && (
                      <span className="badge bg-green-100 text-green-700 text-xs">
                        ✓ Redirected to Quote Form
                      </span>
                    )}
                  </div>

                  {/* User Message */}
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{interaction.userMessage}</p>
                  </div>

                  {/* Bot Response */}
                  {interaction.botResponse && (
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <p className="text-xs text-primary-600 font-medium mb-1">AI Response:</p>
                      <p className="text-sm text-gray-700">{interaction.botResponse}</p>
                      {interaction.respondedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Sent: {formatDate(interaction.respondedAt)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                    <span>Platform: {interaction.platform}</span>
                    <span>Type: {interaction.type}</span>
                    {interaction.postId && <span>Post ID: {interaction.postId}</span>}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-400 text-right whitespace-nowrap">
                  {formatDate(interaction.timestamp, 'short')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {!isLoading && !error && interactions.length > 0 && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaction Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{interactions.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-900">
                {interactions.filter(i => i.status === 'responded').length}
              </p>
              <p className="text-sm text-green-600">Responded</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-900">
                {interactions.filter(i => i.status === 'pending').length}
              </p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-900">
                {interactions.filter(i => i.platform === 'instagram').length}
              </p>
              <p className="text-sm text-purple-600">Instagram</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
