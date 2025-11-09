/**
 * Dashboard Home Page
 * Overview with key metrics and stats
 */

'use client';

import { usePostStatistics } from '@/hooks/usePosts';
import { useLatestTrend } from '@/hooks/useTrends';
import { usePendingPosts } from '@/hooks/usePosts';
import StatsCard from '@/components/StatsCard';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { statistics, isLoading: statsLoading } = usePostStatistics();
  const { trend, isLoading: trendLoading } = useLatestTrend();
  const { posts: pendingPosts, isLoading: postsLoading } = usePendingPosts(3);
  const router = useRouter();

  const handleGenerateContent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Content generated successfully! Check the Approval page.');
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to generate content'}`);
      }
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    }
  };

  const handleAnalyzeTrends = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trends/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Trends analyzed successfully! Check the Trends page.');
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to analyze trends'}`);
      }
    } catch (error) {
      console.error('Error analyzing trends:', error);
      alert('Failed to analyze trends. Please try again.');
    }
  };

  const stats = statistics?.byStatus || {};
  const total = statistics?.total || 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your content overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Posts"
          value={total}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          color="blue"
        />

        <StatsCard
          title="Pending Approval"
          value={stats.pending || 0}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="yellow"
          subtitle="Requires action"
        />

        <StatsCard
          title="Approved"
          value={stats.approved || 0}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
          subtitle="Ready to post"
        />

        <StatsCard
          title="Posted"
          value={stats.posted || 0}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
          color="purple"
          subtitle="Successfully published"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Pending Posts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Approval Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Pending Approval</h2>
                <p className="text-sm text-gray-600 mt-1">Review and approve content</p>
              </div>
              <Link href="/dashboard/approval" className="btn-primary btn-sm">
                View All
              </Link>
            </div>

            {postsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-96 rounded-lg"></div>
                ))}
              </div>
            ) : pendingPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pendingPosts.map((post: any) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    showActions={false}
                    onView={(id) => router.push(`/dashboard/approval`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">All caught up!</h3>
                <p className="text-gray-500">No posts pending approval</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleGenerateContent} className="btn-primary justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Generate Content
              </button>
              <button onClick={handleAnalyzeTrends} className="btn-secondary justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Analyze Trends
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Latest Trends */}
        <div className="space-y-6">
          {/* Latest Trend */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Trend Analysis</h3>

            {trendLoading ? (
              <div className="space-y-3">
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-5/6"></div>
              </div>
            ) : trend ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Date</p>
                  <p className="font-medium">{trend.date}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Top Hashtags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {trend.topHashtags?.slice(0, 6).map((tag: string, i: number) => (
                      <span key={i} className="badge bg-primary-50 text-primary-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Content Mix</p>
                  <div className="flex gap-2 text-sm">
                    <span className="badge bg-blue-50 text-blue-700">
                      {trend.contentMix?.images || 70}% Images
                    </span>
                    <span className="badge bg-purple-50 text-purple-700">
                      {trend.contentMix?.videos || 30}% Videos
                    </span>
                  </div>
                </div>

                <Link href="/dashboard/trends" className="btn-secondary w-full btn-sm mt-4">
                  View Full Analysis
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No trend data available</p>
            )}
          </div>

          {/* System Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <StatusItem label="Backend API" status="online" />
              <StatusItem label="Content Generation" status="online" />
              <StatusItem label="Analytics" status="online" />
              <StatusItem label="Meta API" status="offline" subtitle="Pending setup" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusItem({
  label,
  status,
  subtitle,
}: {
  label: string;
  status: 'online' | 'offline';
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
          }`}
        />
        <span
          className={`text-xs font-medium ${
            status === 'online' ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          {status === 'online' ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
}
