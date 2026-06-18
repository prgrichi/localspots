import { describe, expect, it } from 'vitest';
import { useSpotFilters } from '../useSpotFilters';
import type { Spot } from '@/types/spot';

const spots: Spot[] = [
  {
    id: 'spot-1',
    name: 'Stadtpark',
    category: 'Natur',
    collection: 'collection-1',
    user: 'user-1',
    description: 'Großer Park',
    created: '2026-06-01 10:00:00',
    updated: '2026-06-01 10:00:00',
  },
  {
    id: 'spot-2',
    name: 'Waldweg',
    category: 'Wandern',
    collection: 'collection-1',
    user: 'user-1',
    description: 'Ruhiger Spazierweg',
    created: '2026-06-03 10:00:00',
    updated: '2026-06-03 10:00:00',
  },
];

describe('useSpotFilters', () => {
  it('filtert Spots nach Suchbegriff', () => {
    const { search, filteredSpots } = useSpotFilters(() => spots);

    search.value = 'spazierweg';

    expect(filteredSpots.value).toEqual([spots[1]]);
  });

  it('filtert Spots nach Kategorie', () => {
    const { selectedCategory, filteredSpots } = useSpotFilters(() => spots);

    selectedCategory.value = 'Natur';

    expect(filteredSpots.value).toEqual([spots[0]]);
  });

  it('liefert eindeutige und sortierte Kategorien', () => {
    const { categoryOptions } = useSpotFilters(() => spots);

    expect(categoryOptions.value).toEqual([
      { label: 'Natur', value: 'Natur' },
      { label: 'Wandern', value: 'Wandern' },
    ]);
  });

  it('ignoriert Groß-/Kleinschreibung und Leerzeichen bei der Suche', () => {
    const { search, filteredSpots } = useSpotFilters(() => spots);

    search.value = '  SPAZIERWEG  ';

    expect(filteredSpots.value).toEqual([spots[1]]);
  });

  it('kombiniert Suchbegriff und Kategorie', () => {
    const { search, selectedCategory, filteredSpots } = useSpotFilters(() => spots);

    search.value = 'park';
    selectedCategory.value = 'Natur';

    expect(filteredSpots.value).toEqual([spots[0]]);
  });

  it('setzt alle Filter zurück', () => {
    const { search, selectedCategory, resetFilters } = useSpotFilters(() => spots);

    search.value = 'park';
    selectedCategory.value = 'Natur';

    resetFilters();

    expect(search.value).toBe('');
    expect(selectedCategory.value).toBeNull();
  });
});
