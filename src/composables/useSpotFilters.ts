// src/composables/useSpotFilters.ts

import { computed, ref } from 'vue';
import type { Spot } from '@/types/spot';

export function useSpotFilters(getSpots: () => Spot[]) {
  const search = ref('');
  const selectedCategory = ref<string | null>(null);

  const categoryOptions = computed(() => {
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

    return getSpots().filter(spot => {
      const categoryMatches = !selectedCategory.value || spot.category === selectedCategory.value;

      const searchMatches =
        !q ||
        [spot.name, spot.category, spot.description]
          .filter((value): value is string => Boolean(value))
          .some(value => value.toLowerCase().includes(q));

      return categoryMatches && searchMatches;
    });
  });

  const resetFilters = () => {
    selectedCategory.value = null;
    search.value = '';
  };

  return {
    search,
    selectedCategory,
    categoryOptions,
    filteredSpots,
    resetFilters,
  };
}
