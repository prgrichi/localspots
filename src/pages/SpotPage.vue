<template>
  <div class="mx-auto max-w-3xl px-4 md:px-8">
    <div class="mb-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Spots</div>

      <h1 class="mt-1 line-clamp-2 text-2xl font-semibold leading-tight text-slate-900">
        {{ collectionStore.activeCollection?.name ?? 'Collection auswählen' }}
      </h1>

      <p v-if="spotCount" class="mt-1 text-sm text-slate-500">
        {{ spotCount }}
        {{ getSpotLabel(spotCount) }}
      </p>
    </div>

    <CollectionCreateDrawer v-model:show="showCollectionDrawer" @created="onCollectionCreated" />

    <!-- Wenn keine Collections existieren -->
    <NoCollectionsState
      v-if="!collectionStore.hasCollections"
      @create="showCollectionDrawer = true"
    />

    <!-- Wenn Collections existieren -->
    <div v-else class="space-y-6">
      <n-space vertical size="large">
        <n-space vertical :size="16">
          <SpotFilterBar
            v-if="spotCount > 0"
            v-model:selected-category="selectedCategory"
            v-model:search="search"
            :category-options="categoryOptions"
            @reset="resetFilters"
          />

          <div v-if="isFilterActive" class="mb-2 text-sm text-slate-500">
            {{ filteredSpots.length }}
            {{ getSpotLabel(filteredSpots.length) }}
            gefunden
          </div>

          <n-empty
            v-if="!isFilterActive && filteredSpots.length === 0"
            class="mt-10"
            description="Noch keine Spots in dieser Collection"
          >
            <template #extra>
              <RouterLink :to="{ name: 'add-entry' }" class="no-underline">
                <n-button type="primary" secondary round> Spot eintragen </n-button>
              </RouterLink>
            </template>
          </n-empty>

          <n-empty
            v-else-if="filteredSpots.length === 0"
            class="mt-10"
            description="Keine Spots gefunden"
          >
            <template #extra>
              <n-button secondary round @click="resetFilters"> Filter zurücksetzen </n-button>
            </template>
          </n-empty>

          <template v-else>
            <SpotCard
              v-for="spot in filteredSpots"
              :key="spot.id"
              :spot="spot"
              :is-favorite="spotFavoritesStore.isFavorite(spot.id)"
              :highlighted="spot.id === highlightedId"
              @toggle-favorite="toggleFavorite"
            />
          </template>
        </n-space>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NEmpty, NButton, NSpace, useMessage } from 'naive-ui';
import { useSpotFilters } from '@/composables/useSpotFilters';
import { useEnsureCollections } from '@/composables/useEnsureCollections';

import { useSpotStore } from '@/stores/spotStore';
import { useSpotFavoritesStore } from '@/stores/spotFavorites';
import { useCollectionStore } from '@/stores/collectionStore';
import { useRoute } from 'vue-router';

import SpotFilterBar from '@/components/collection/SpotFilterBar.vue';
import SpotCard from '@/components/collection/SpotCard.vue';
import CollectionCreateDrawer from '@/components/collection/CollectionCreateDrawer.vue';
import NoCollectionsState from '@/components/collection/NoCollectionsState.vue';

const spotStore = useSpotStore();
const spotFavoritesStore = useSpotFavoritesStore();
const collectionStore = useCollectionStore();
const message = useMessage();
const route = useRoute();

const showCollectionDrawer = ref(false);

const highlightedId = ref<string | null>((route.query.highlight as string) || null);

useEnsureCollections();

const { search, selectedCategory, categoryOptions, filteredSpots, resetFilters } = useSpotFilters(
  () => spotStore.spots
);

onMounted(() => {
  if (highlightedId.value) {
    setTimeout(() => {
      highlightedId.value = null;
    }, 2000);
  }
});

const onCollectionCreated = () => {
  showCollectionDrawer.value = false;
};

const isFilterActive = computed(() => !!selectedCategory.value || !!search.value.trim());

const spotCount = computed(() => spotStore.spots.length);

function getSpotLabel(count: number) {
  return count === 1 ? 'Spot' : 'Spots';
}

async function toggleFavorite(spotId: string) {
  try {
    await spotFavoritesStore.toggleFavorite(spotId);
  } catch {
    message.error('Favorit konnte nicht gespeichert werden.');
  }
}

watch(
  () => collectionStore.activeCollectionId,
  async (collectionId: string | null) => {
    if (!collectionId) {
      spotStore.clearSpots();
      return;
    }

    try {
      await Promise.all([spotStore.fetchSpots(collectionId), spotFavoritesStore.fetchFavorites()]);
    } catch {
      message.error('Spots konnten nicht geladen werden');
    }
  },
  { immediate: true }
);
</script>
