/**
 * Trends Page
 * View trend analysis and insights
 */

'use client';

import { useTrends } from '@/hooks/useTrends';
import { formatDate } from '@/lib/utils';

export default function TrendsPage() {
  const { trends, isLoading } = useTrends({ limit: 10 });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trend Analysis</h1>
        <p className="text-gray-600">AI-powered market insights for content optimization</p>
      </div>

      {/* Trends List */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-64 rounded-xl"></div>
          ))}
        </div>
      ) : trends.length > 0 ? (
        <div className="space-y-6">
          {trends.map((trend: any, index: number) => (
            <div
              key={trend.id}
              className={`card-hover ${index === 0 ? 'border-2 border-primary-200' : ''}`}
            >
              {index === 0 && (
                <div className="mb-4">
                  <span className="badge bg-primary-600 text-white">Latest Analysis</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Date & Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {formatDate(trend.date, 'long')}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Analyzed at {formatDate(trend.analyzedAt, 'short')}
                  </p>

                  {/* Content Mix */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Content Mix</p>
                    <div className="flex gap-2">
                      <span className="badge bg-blue-100 text-blue-700">
                        {trend.contentMix?.images || 70}% Images
                      </span>
                      <span className="badge bg-purple-100 text-purple-700">
                        {trend.contentMix?.videos || 30}% Videos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top Hashtags */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Top Hashtags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {trend.topHashtags?.slice(0, 12).map((tag: string, i: number) => (
                      <span key={i} className="badge bg-primary-50 text-primary-700 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Post Styles */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Styles</h4>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Images</p>
                      <div className="flex flex-wrap gap-1.5">
                        {trend.imagePostStyles?.slice(0, 4).map((style: string, i: number) => (
                          <span key={i} className="badge bg-blue-50 text-blue-700 text-xs">
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Videos</p>
                      <div className="flex flex-wrap gap-1.5">
                        {trend.videoPostStyles?.slice(0, 4).map((style: string, i: number) => (
                          <span key={i} className="badge bg-purple-50 text-purple-700 text-xs">
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trending Topics */}
              {trend.trendingTopics && trend.trendingTopics.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Trending Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {trend.trendingTopics.map((topic: string, i: number) => (
                      <span key={i} className="badge bg-gray-100 text-gray-700">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Competitor Insights */}
              {trend.competitorInsights && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Competitor Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Common Themes</p>
                      <div className="flex flex-wrap gap-1">
                        {trend.competitorInsights.commonThemes?.map((theme: string, i: number) => (
                          <span key={i} className="text-xs text-gray-700">{theme}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Avg Engagement</p>
                      <p className="text-sm font-medium text-gray-900">
                        {trend.competitorInsights.avgEngagement}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
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
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Trends Available</h2>
          <p className="text-gray-600 mb-6">Run a trend analysis to get started</p>
          <button className="btn-primary">Analyze Trends Now</button>
        </div>
      )}
    </div>
  );
}
