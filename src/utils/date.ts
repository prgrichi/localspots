// src/utils/date.ts
export function parsePocketBaseDate(value: string) {
  return new Date(value.replace(' ', 'T'));
}

export function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  return date;
}

export function startOfWeek() {
  const date = startOfToday();
  const day = date.getDay();

  const daysSinceMonday = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - daysSinceMonday);

  return date;
}

export function startOfMonth() {
  const date = startOfToday();
  date.setDate(1);

  return date;
}

export function formatRelativeDateLabel(value: string) {
  const date = parsePocketBaseDate(value);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) {
    return `Heute, ${time}`;
  }

  if (isYesterday) {
    return `Gestern, ${time}`;
  }

  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
