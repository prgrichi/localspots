import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  formatRelativeDateLabel,
  parsePocketBaseDate,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from '../date';

afterEach(() => {
  vi.useRealTimers();
});

describe('parsePocketBaseDate', () => {
  it('wandelt ein PocketBase-Datum in ein Date-Objekt um', () => {
    const result = parsePocketBaseDate('2026-06-16 14:30:00');

    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(16);
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
  });
});

describe('startOfToday', () => {
  it('setzt die Uhrzeit auf Mitternacht', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 16, 14, 30));

    const result = startOfToday();

    expect(result).toEqual(new Date(2026, 5, 16, 0, 0, 0, 0));
  });
});

describe('startOfWeek', () => {
  it('liefert den Montag der aktuellen Woche', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 18, 14, 30));

    const result = startOfWeek();

    expect(result).toEqual(new Date(2026, 5, 15, 0, 0, 0, 0));
  });

  it('behandelt Sonntag als letzten Tag der Woche', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 21, 14, 30));

    const result = startOfWeek();

    expect(result).toEqual(new Date(2026, 5, 15, 0, 0, 0, 0));
  });
});

describe('startOfMonth', () => {
  it('liefert den ersten Tag des aktuellen Monats', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 16, 14, 30));

    const result = startOfMonth();

    expect(result).toEqual(new Date(2026, 5, 1, 0, 0, 0, 0));
  });
});

describe('formatRelativeDateLabel', () => {
  it('formatiert ein Datum von heute', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 16, 12, 0));

    const result = formatRelativeDateLabel('2026-06-16 09:30:00');

    expect(result).toBe('Heute, 09:30');
  });

  it('formatiert ein Datum von gestern', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 16, 12, 0));

    const result = formatRelativeDateLabel('2026-06-15 09:30:00');

    expect(result).toBe('Gestern, 09:30');
  });

  it('formatiert ältere Daten als normales Datum', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 16, 12, 0));

    const result = formatRelativeDateLabel('2026-06-10 09:30:00');

    expect(result).toBe('10.06.2026');
  });
});
