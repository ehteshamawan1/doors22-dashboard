/**
 * Utility Functions
 */

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

function normalizeStatus(status: string): string {
  const normalized = (status || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z_]/g, '');
  if (normalized === 'pending_approval') {
    return 'pending';
  }
  return normalized;
}

// Eastern Time Zone constant
const EASTERN_TIMEZONE = 'America/New_York';

/**
 * Format date to readable string in Eastern Time
 */
export function formatDate(date: string | Date | null | undefined, format: 'short' | 'long' | 'relative' = 'short'): string {
  if (!date) return 'N/A';

  const d = typeof date === 'string' ? new Date(date) : date;

  // Check if date is valid
  if (isNaN(d.getTime())) return 'Invalid Date';

  if (format === 'relative') {
    return formatRelativeTime(d);
  }

  if (format === 'long') {
    return d.toLocaleString('en-US', {
      timeZone: EASTERN_TIMEZONE,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' ET';
  }

  return d.toLocaleString('en-US', {
    timeZone: EASTERN_TIMEZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' ET';
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(date, 'short');
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
    posted: 'blue',
  };

  return colors[normalizeStatus(status)] || 'gray';
}

/**
 * Get status badge classes
 */
export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    pending: 'badge bg-yellow-500 text-white',
    approved: 'badge bg-green-600 text-white',
    rejected: 'badge bg-red-600 text-white',
    posted: 'badge bg-blue-600 text-white',
  };

  return classes[normalizeStatus(status)] || 'badge bg-gray-800 text-white';
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Download file
 */
export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Get media type icon
 */
export function getMediaTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    image: 'IMG',
    video: 'VID',
  };

  return icons[type] || 'FILE';
}


/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
