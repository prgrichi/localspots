// src/composables/useSpotFilters.ts

import { computed, ref } from 'vue';
import type { Spot } from '@/types/spot';

type SelectOption = {
  label: string;
  value: string;
};

type SpotSortBy = 'newest' | 'category' | 'name';

export function useSpotFilters(getSpots: () => Spot[]) {
  const search = ref('');
  const selectedCategory = ref('');
  const sortBy = ref<SpotSortBy>('newest');

  const sortOptions: SelectOption[] = [
    { label: 'Neueste zuerst', value: 'newest' },
    { label: 'Kategorie A–Z', value: 'category' },
    { label: 'Name A–Z', value: 'name' },
  ];

  const existingCategoryOptions = computed(() => {
    const categories = getSpots()
      .map(spot => spot.category)
      .filter((category): category is string => Boolean(category));

    return [...new Set(categories)]
      .sort((a, b) => a.localeCompare(b, 'de'))
      .map(category => ({
        label: category,
        value: category,
      }));
  });

  const filteredSpots = computed(() => {
    const q = search.value.trim().toLowerCase();

    const filtered = getSpots().filter(spot => {
      const categoryMatches = !selectedCategory.value || spot.category === selectedCategory.value;

      const searchMatches =
        !q ||
        [spot.name, spot.category, spot.description]
          .filter((value): value is string => Boolean(value))
          .some(value => value.toLowerCase().includes(q));

      return categoryMatches && searchMatches;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy.value === 'category') {
        return (a.category ?? '').localeCompare(b.category ?? '', 'de');
      }

      if (sortBy.value === 'name') {
        return (a.name ?? '').localeCompare(b.name ?? '', 'de');
      }

      return new Date(b.created).getTime() - new Date(a.created).getTime();
    });
  });

  const resetFilters = () => {
    selectedCategory.value = '';
    search.value = '';
    sortBy.value = 'newest';
  };

  return {
    search,
    selectedCategory,
    existingCategoryOptions,
    filteredSpots,
    sortBy,
    sortOptions,
    resetFilters,
  };
}
