'use client';

import React from 'react';

interface PostViewModalProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostViewModal({ post, isOpen, onClose }: PostViewModalProps) {
  if (!isOpen || !post) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Preview Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Media Preview */}
          <div>
            <label className="label">Media</label>
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              {post.type === 'video' ? (
                <div className="relative aspect-[9/16]">
                  <video
                    src={post.mediaUrl}
                    controls
                    className="w-full h-full object-cover"
                    poster={post.thumbnailUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="relative aspect-[4/5]">
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="label">Caption</label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 whitespace-pre-wrap">{post.caption || 'No caption'}</p>
            </div>
          </div>

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div>
              <label className="label">Hashtags</label>
              <div className="flex flex-wrap gap-2">
                {post.hashtags.map((tag: string, i: number) => (
                  <span key={i} className="badge bg-primary-50 text-primary-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div>
            <label className="label">Details</label>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-medium text-gray-900 capitalize">{post.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium text-gray-900 capitalize">{post.status}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-medium text-gray-900">{post.category || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Post ID</p>
                <p className="font-mono text-xs text-gray-900">{post.id}</p>
              </div>
              {post.fileSize && (
                <div>
                  <p className="text-xs text-gray-500">File Size</p>
                  <p className="font-medium text-gray-900">
                    {(post.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
              {post.duration && (
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">{post.duration}s</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary w-full"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
