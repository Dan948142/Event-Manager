/**
 * Date and time utilities for Jain Sangha Activities
 */

export const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

export function isEventArchived(dateTimeStr: string): boolean {
  try {
    const time = new Date(dateTimeStr).getTime();
    if (isNaN(time)) return false;
    return Date.now() - time > FIVE_DAYS_MS;
  } catch {
    return false;
  }
}

export function formatEventDateTime(dateTimeStr: string): string {
  try {
    const d = new Date(dateTimeStr);
    if (isNaN(d.getTime())) return dateTimeStr;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateTimeStr;
  }
}

export function getDaysAgoText(dateTimeStr: string): string {
  try {
    const diff = Date.now() - new Date(dateTimeStr).getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    if (days <= 0) return 'Concluded recently';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  } catch {
    return 'Past event';
  }
}
