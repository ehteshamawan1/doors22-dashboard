/**
 * Content Calendar Page
 * View all posts (pending, approved, rejected, posted)
 */

'use client';

import { useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { postsApi } from '@/lib/api';
import PostCard from '@/components/PostCard';
import PostViewModal from '@/components/PostViewModal';

export default function ContentPage() {
  const [filter, setFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editCaption, setEditCaption] = useState('');
  const [previewingPost, setPreviewingPost] = useState<any>(null);

  const { posts, isLoading, mutate } = usePosts({
    limit: 100,
  });

  const normalizeStatus = (status: string) =>
    (status || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_')
      .replace(/[^a-z_]/g, '');

  const normalizeType = (type: string) =>
    (type || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, '');

  const filters = [
    { value: 'all', label: 'All Posts', count: posts.length },
    { value: 'pending', label: 'Pending', count: posts.filter((p: any) => normalizeStatus(p.status) === 'pending').length },
    { value: 'approved', label: 'Approved', count: posts.filter((p: any) => normalizeStatus(p.status) === 'approved').length },
    { value: 'posted', label: 'Posted', count: posts.filter((p: any) => normalizeStatus(p.status) === 'posted').length },
    { value: 'rejected', label: 'Rejected', count: posts.filter((p: any) => normalizeStatus(p.status) === 'rejected').length },
  ];

  const typeFilters = [
    { value: 'all', label: 'All Types' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
  ];

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const result = await postsApi.approve(id, { approvedBy: 'leobel8@yahoo.com' });
      await mutate();

      if (result.immediatePost === false && result.postingError) {
        alert(`Post approved but publishing failed: ${JSON.stringify(result.postingError)}

The post will be retried automatically.`);
      } else if (result.immediatePost === true) {
        alert('Post approved and published successfully!');
      } else {
        alert('Post approved successfully! It will be published at the scheduled time.');
      }
    } catch (error) {
      console.error('Error approving post:', error);
      alert('Failed to approve post');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (id: string) => {
    const post = posts.find((p: any) => p.id === id);
    if (post) {
      setEditingPost(post);
      setEditCaption(post.caption || '');
    }
  };

  const handleView = (id: string) => {
    const post = posts.find((p: any) => p.id === id);
    if (post) {
      setPreviewingPost(post);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingPost) return;

    setActionLoading(editingPost.id);
    try {
      const result = await postsApi.edit(editingPost.id, { caption: editCaption }, 'leobel8@yahoo.com');
      await mutate();
      setEditingPost(null);

      // Check if immediate posting was attempted and failed
      if (result.immediatePost === false && result.postingError) {
        alert(`Post updated but publishing failed: ${JSON.stringify(result.postingError)}\n\nThe post will be retried automatically.`);
      } else if (result.immediatePost === true) {
        alert('Post updated and published successfully!');
      } else {
        alert('Post updated and approved! It will be published at the scheduled time.');
      }
    } catch (error) {
      console.error('Error editing post:', error);
      alert('Failed to update post');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPosts = posts.filter((post: any) => {
    const status = normalizeStatus(post.status);
    const type = normalizeType(post.type);

    if (filter !== 'all' && status !== filter) return false;
    if (typeFilter !== 'all' && type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Calendar</h1>
        <p className="text-gray-600">View and manage all your content</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div>
            <label className="label">Status</label>
            <div className="flex gap-2">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                  {f.count > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="label">Type</label>
            <div className="flex gap-2">
              {typeFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTypeFilter(f.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    typeFilter === f.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton h-[600px] rounded-lg"></div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post: any) => (
            <PostCard
              key={post.id}
              post={post}
              showActions={false}
              allowRejectedApprove
              allowRejectedEdit
              onApprove={handleApprove}
              onEdit={handleEdit}
              onView={handleView}
            />
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Content Found</h2>
          <p className="text-gray-600">No posts match your filters</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Media Preview */}
              <div>
                <label className="label">Media Preview</label>
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={editingPost.type === 'video' ? editingPost.thumbnailUrl : editingPost.mediaUrl}
                    alt="Post media"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Edit Caption */}
              <div>
                <label htmlFor="caption" className="label">
                  Caption
                </label>
                <textarea
                  id="caption"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="input min-h-[150px] resize-y"
                  placeholder="Enter caption..."
                />
                <p className="text-xs text-gray-500 mt-1">{editCaption.length} characters</p>
              </div>

              {/* Hashtags */}
              <div>
                <label className="label">Hashtags</label>
                <div className="flex flex-wrap gap-2">
                  {editingPost.hashtags?.map((tag: string, i: number) => (
                    <span key={i} className="badge bg-primary-50 text-primary-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setEditingPost(null)}
                className="btn-secondary flex-1"
                disabled={actionLoading === editingPost.id}
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn-primary flex-1"
                disabled={actionLoading === editingPost.id}
                type="button"
              >
                {actionLoading === editingPost.id ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save & Approve'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <PostViewModal
        post={previewingPost}
        isOpen={!!previewingPost}
        onClose={() => setPreviewingPost(null)}
      />
    </div>
  );
}
