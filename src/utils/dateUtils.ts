export function getCurrentDate(): Date {
  return new Date();
}

export function getFirstDayOfMonth(date: Date = getCurrentDate()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getLastDayOfMonth(date: Date = getCurrentDate()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function formatDateSwiss(date: Date): string {
  return date.toLocaleDateString('fr-CH');
}

export function getMonthName(date: Date = getCurrentDate()): string {
  return date.toLocaleDateString('fr-CH', { month: 'long' });
}

export function formatFullDateSwiss(date: Date): string {
  return date.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

export function formatTimeSwiss(date: Date): string {
  return date.toLocaleTimeString('fr-CH', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDateTimeSwiss(date: Date): string {
  return `${formatDateSwiss(date)} ${formatTimeSwiss(date)}`;
}