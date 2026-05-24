import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/** "15 Mar 2026" */
export function formatDate(date: string | Date): string {
  return dayjs(date).format('DD MMM YYYY');
}

/** "15 Mar 2026 at 14:30" */
export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('DD MMM YYYY [at] HH:mm');
}

/** "2 days ago", "in 3 days" */
export function formatRelative(date: string | Date): string {
  return dayjs(date).fromNow();
}

/** "15 Mar 2026 (2 days ago)" */
export function formatDateWithRelative(date: string | Date): string {
  return `${formatDate(date)} (${formatRelative(date)})`;
}
