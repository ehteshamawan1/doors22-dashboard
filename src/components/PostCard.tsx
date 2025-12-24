/**
 * PostCard Component
 * Display post with media preview and action buttons
 */

'use client';

import Image from 'next/image';
import { formatDate, formatFileSize, getStatusBadgeClass, truncate } from '@/lib/utils';

interface PostCardProps {
  post: any;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  showActions?: boolean;
  allowRejectedApprove?: boolean;
  allowRejectedEdit?: boolean;
}

export default function PostCard({
  post,
  onApprove,
  onReject,
  onEdit,
  onView,
  showActions = true,
  allowRejectedApprove = false,
  allowRejectedEdit = false,
}: PostCardProps) {
  const isVideo = post.type === 'video';
  const mediaUrl = isVideo ? post.thumbnailUrl : post.mediaUrl;
  const statusLabel = String(post.status || 'unknown')
    .replace(/_/g, ' ')
    .replace(/[^a-zA-Z ]/g, '')
    .trim();
  const showPendingActions = showActions && post.status === 'pending';
  const showRejectedApprove = allowRejectedApprove && post.status === 'rejected';
  const showRejectedEdit = allowRejectedEdit && post.status === 'rejected';

  return (
    <div className="card-hover group">
      {/* Media Preview */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100 mb-4">
        {mediaUrl ? (
          <>
            <Image
              src={mediaUrl}
              alt={post.caption || 'Post media'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                  <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`${getStatusBadgeClass(post.status)} capitalize`}>
            {statusLabel}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="badge bg-black/50 text-white backdrop-blur-sm">
            {isVideo ? 'Video' : 'Image'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Caption */}
        <p className="text-sm text-gray-700 line-clamp-3">
          {post.caption || 'No caption'}
        </p>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.hashtags.slice(0, 5).map((tag: string, index: number) => (
              <span key={index} className="text-xs text-primary-600 hover:text-primary-700">
                {tag}
              </span>
            ))}
            {post.hashtags.length > 5 && (
              <span className="text-xs text-gray-500">
                +{post.hashtags.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{formatDate(post.generatedAt, 'relative')}</span>
          {post.fileSize && <span>{formatFileSize(post.fileSize)}</span>}
          {post.duration && <span>{post.duration}s</span>}
        </div>

        {/* Post ID */}
        <div className="text-xs text-gray-400 font-mono">
          ID: {post.postId}
        </div>

        {/* Actions */}
        {(showPendingActions || showRejectedApprove) && (
          <div className="flex gap-2 pt-3 border-t border-gray-200">
            {showPendingActions && (
              <>
                <button
                  type="button"
                  onClick={() => onApprove?.(post.id)}
                  className="btn-success flex-1 btn-sm"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => onEdit?.(post.id)}
                  className="btn-secondary btn-sm"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onReject?.(post.id)}
                  className="btn-danger btn-sm"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </>
            )}

            {showRejectedApprove && (
              <>
                <button
                  type="button"
                  onClick={() => onApprove?.(post.id)}
                  className="btn-success flex-1 btn-sm"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>

                {showRejectedEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit?.(post.id)}
                    className="btn-secondary btn-sm"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Preview Button */}
        {onView && (
          <button
            type="button"
            onClick={() => onView(post.id)}
            className="btn-secondary w-full btn-sm mt-2"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
        )}
      </div>
    </div>
  );
}

