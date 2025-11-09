/**
 * Interactions Page
 * Manage comments and DMs from Instagram & Facebook
 */

'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

// Mock interactions for demonstration
const generateMockInteractions = () => [
  {
    id: 'int_001',
    platform: 'instagram',
    type: 'comment',
    postId: '2025-11-08-001',
    user: {
      id: '17841405309211844',
      username: 'johndoe',
      profilePic: null,
    },
    userMessage: 'How much for glass doors?',
    botResponse: 'Hi! Our pricing varies based on size and customization. Get an instant quote here: https://doors22.com/price/ or call us at (305) 394-9922 😊',
    category: 'price_inquiry',
    redirected: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'responded',
  },
  {
    id: 'int_002',
    platform: 'facebook',
    type: 'comment',
    postId: '2025-11-08-001',
    user: {
      id: '123456789',
      username: 'jane_smith',
      profilePic: null,
    },
    userMessage: 'Do you install in Boca Raton?',
    botResponse: 'Yes, we serve all of South Florida including Boca Raton! Request your free consultation: https://doors22.com/price/ 📞 (305) 394-9922',
    category: 'technical_question',
    redirected: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'responded',
  },
  {
    id: 'int_003',
    platform: 'instagram',
    type: 'dm',
    postId: null,
    user: {
      id: '17841405309211845',
      username: 'homedesigner',
      profilePic: null,
    },
    userMessage: 'Beautiful work! Can you send me your portfolio?',
    botResponse: 'Thank you! 😊 You can view our full portfolio at https://doors22.com/gallery/ or visit our Instagram feed. For a personalized quote: https://doors22.com/price/',
    category: 'compliment',
    redirected: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    status: 'responded',
  },
  {
    id: 'int_004',
    platform: 'facebook',
    type: 'dm',
    postId: null,
    user: {
      id: '987654321',
      username: 'office_manager',
      profilePic: null,
    },
    userMessage: 'What types of glass do you offer?',
    botResponse: 'We offer various glass types: clear, frosted, tinted, and decorative options. Each can be customized for your needs. Get detailed info: https://doors22.com/price/ 📞 (305) 394-9922',
    category: 'technical_question',
    redirected: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'responded',
  },
  {
    id: 'int_005',
    platform: 'instagram',
    type: 'comment',
    postId: '2025-11-07-002',
    user: {
      id: '17841405309211846',
      username: 'design_pro',
      profilePic: null,
    },
    userMessage: '🔥🔥🔥 Love this!',
    botResponse: 'Thank you so much! 💙 We'd love to help with your next project. Check out more: https://doors22.com/',
    category: 'compliment',
    redirected: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'responded',
  },
];

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<any[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    // In production, this would fetch from API
    setInteractions(generateMockInteractions());
  }, []);

  const filteredInteractions = interactions.filter((interaction) => {
    if (platformFilter !== 'all' && interaction.platform !== platformFilter) return false;
    if (typeFilter !== 'all' && interaction.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && interaction.category !== categoryFilter) return false;
    return true;
  });

  const getPlatformIcon = (platform: string) => {
    return platform === 'instagram' ? '📸' : '👥';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'price_inquiry':
        return 'text-blue-600 bg-blue-50';
      case 'technical_question':
        return 'text-purple-600 bg-purple-50';
      case 'compliment':
        return 'text-green-600 bg-green-50';
      case 'faq':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'comment' ? '💬' : '📩';
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

      {/* Interactions List */}
      <div className="space-y-3">
        {filteredInteractions.length > 0 ? (
          filteredInteractions.map((interaction) => (
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
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-900">@{interaction.user.username}</span>
                    <span className={`badge ${getCategoryColor(interaction.category)}`}>
                      {interaction.category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
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
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <p className="text-xs text-primary-600 font-medium mb-1">AI Response:</p>
                    <p className="text-sm text-gray-700">{interaction.botResponse}</p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                    <span>Platform: {interaction.platform}</span>
                    <span>Type: {interaction.type}</span>
                    {interaction.postId && <span>Post ID: {interaction.postId}</span>}
                    <span>Status: {interaction.status}</span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-400 text-right whitespace-nowrap">
                  {formatDate(interaction.timestamp, 'short')}
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Interactions Found</h2>
            <p className="text-gray-600">No interactions match your filters</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interaction Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-900">
              {interactions.filter(i => i.category === 'price_inquiry').length}
            </p>
            <p className="text-sm text-blue-600">Price Inquiries</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-900">
              {interactions.filter(i => i.category === 'technical_question').length}
            </p>
            <p className="text-sm text-purple-600">Technical Questions</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-900">
              {interactions.filter(i => i.category === 'compliment').length}
            </p>
            <p className="text-sm text-green-600">Compliments</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-900">
              {interactions.filter(i => i.redirected).length}
            </p>
            <p className="text-sm text-yellow-600">Redirected to Quote</p>
          </div>
        </div>
      </div>
    </div>
  );
}
