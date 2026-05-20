<template>
  <main class="mx-auto max-w-3xl px-4 md:px-8">
    <n-space vertical size="large">
      <n-space vertical :size="16">
        <CollectionHeader
          :collection-name="collectionStore.activeCollection?.name ?? ''"
          :spot-count="spotStore.spots.length"
        />

        <SpotFilterBar
          v-model:selected-category="selectedCategory"
          v-model:search="search"
          v-model:sort-by="sortBy"
          :category-options="categoryOptions"
          :sort-options="sortOptions"
          @reset="resetFilters"
        />

        <div v-if="isFilterActive" class="text-sm text-slate-500 mb-2">
          {{ filteredSpots.length }}
          {{ filteredSpots.length === 1 ? 'Spot' : 'Spots' }}
          gefunden
        </div>

        <n-empty
          class="mt-6"
          v-if="filteredSpots.length === 0"
          description="Keine Spots gefunden"
        />

        <template v-else>
          <SpotCard
            v-for="spot in filteredSpots"
            :key="spot.id"
            :spot="spot"
            :highlighted="spot.id === highlightedId"
          />
        </template>
      </n-space>
    </n-space>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NEmpty, NSpace, useMessage } from 'naive-ui';
import { useSpotFilters } from '@/composables/useSpotFilters';

import { useSpotStore } from '@/stores/spotStore';
import { useCollectionStore } from '@/stores/collectionStore';
import { useRoute } from 'vue-router';

import CollectionHeader from '@/components/collection/CollectionHeader.vue';
import SpotFilterBar from '@/components/collection/SpotFilterBar.vue';
import SpotCard from '@/components/collection/SpotCard.vue';

const spotStore = useSpotStore();
const collectionStore = useCollectionStore();
const message = useMessage();
const route = useRoute();

const highlightedId = ref<string | null>((route.query.highlight as string) || null);

const { search, selectedCategory, sortBy, sortOptions, filteredSpots, resetFilters } =
  useSpotFilters(() => spotStore.spots);

const categoryOptions = computed(() => {
  const categories = new Set<string>();

  for (const spot of spotStore.spots) {
    if (spot.category) {
      categories.add(spot.category);
    }
  }

  return [...categories]
    .sort((a, b) => a.localeCompare(b, 'de'))
    .map(category => ({
      label: category,
      value: category,
    }));
});

const isFilterActive = computed(() => !!selectedCategory.value || !!search.value.trim());

onMounted(() => {
  if (highlightedId.value) {
    setTimeout(() => {
      highlightedId.value = null;
    }, 2000);
  }
});

watch(
  () => collectionStore.activeCollectionId,
  async (collectionId: string | null) => {
    if (!collectionId) {
      spotStore.clearSpots();
      return;
    }

    try {
      await spotStore.fetchSpots(collectionId);
    } catch {
      message.error('Spots konnten nicht geladen werden');
    }
  },
  { immediate: true }
);
</script>
