// src/composables/useSpotActivities.ts
import { computed, ref } from 'vue';
import { pb } from '@/services/pocketbase';
import { useCollectionStore } from '@/stores/collectionStore';
import { mapSpotToActivity } from '@/utils/spotActivity';
import type { Spot } from '@/types/spot';
import type { SpotActivity } from '@/types/activity';

export function useSpotActivities() {
  const collectionStore = useCollectionStore();

  const spots = ref<Spot[]>([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const page = ref(1);
  const perPage = 15;
  const hasMore = ref(false);

  const activities = computed<SpotActivity[]>(() => spots.value.map(mapSpotToActivity));

  async function fetchActivities(reset = false) {
    if (reset) {
      page.value = 1;
      spots.value = [];
    }

    if (page.value === 1) {
      isLoading.value = true;
    } else {
      isLoadingMore.value = true;
    }

    try {
      if (!collectionStore.collections.length) {
        await collectionStore.fetchMyCollections();
      }

      const collectionIds = collectionStore.collections.map(collection => collection.id);

      if (collectionIds.length === 0) {
        spots.value = [];
        hasMore.value = false;
        return;
      }

      const collectionFilter = collectionIds.map(id => `collection = "${id}"`).join(' || ');

      const result = await pb.collection('spots').getList<Spot>(page.value, perPage, {
        filter: collectionFilter,
        sort: '-created',
        expand: 'user,collection',
      });

      spots.value = reset ? result.items : [...spots.value, ...result.items];
      hasMore.value = page.value < result.totalPages;
    } finally {
      isLoading.value = false;
      isLoadingMore.value = false;
    }
  }

  async function loadMoreActivities() {
    if (isLoading.value || isLoadingMore.value || !hasMore.value) return;

    page.value += 1;
    await fetchActivities();
  }

  return {
    activities,
    isLoading,
    isLoadingMore,
    hasMore,
    fetchActivities,
    loadMoreActivities,
  };
}
