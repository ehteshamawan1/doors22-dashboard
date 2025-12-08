/**
 * Pending Approval Page
 * Review and approve/reject/edit pending posts
 */

'use client';

import { useState } from 'react';
import { usePendingPosts } from '@/hooks/usePosts';
import { postsApi } from '@/lib/api';
import PostCard from '@/components/PostCard';

export default function ApprovalPage() {
  const { posts, mutate, isLoading } = usePendingPosts(50);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editCaption, setEditCaption] = useState('');

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const result = await postsApi.approve(id, { approvedBy: 'admin' });
      await mutate();

      // Check if immediate posting was attempted and failed
      if (result.immediatePost === false && result.postingError) {
        alert(`Post approved but publishing failed: ${JSON.stringify(result.postingError)}\n\nThe post will be retried automatically.`);
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

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return; // Cancelled

    setActionLoading(id);
    try {
      await postsApi.reject(id, { reason: reason || 'No reason provided', rejectedBy: 'admin' });
      await mutate();
      alert('Post rejected successfully');
    } catch (error) {
      console.error('Error rejecting post:', error);
      alert('Failed to reject post');
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

  const handleSaveEdit = async () => {
    if (!editingPost) return;

    setActionLoading(editingPost.id);
    try {
      const result = await postsApi.edit(editingPost.id, { caption: editCaption }, 'admin');
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Approval</h1>
        <p className="text-gray-600">
          {posts.length} post{posts.length !== 1 ? 's' : ''} awaiting your review
        </p>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-[600px] rounded-lg"></div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              post={post}
              onApprove={handleApprove}
              onReject={handleReject}
              onEdit={handleEdit}
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">All Caught Up!</h2>
          <p className="text-gray-600 mb-6">No posts pending approval</p>
          <button className="btn-primary">Generate New Content</button>
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
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn-primary flex-1"
                disabled={actionLoading === editingPost.id}
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
    </div>
  );
}
