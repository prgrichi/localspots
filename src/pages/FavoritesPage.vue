<template>
  <div class="mx-auto max-w-3xl px-4 pb-4 md:px-8">
    <div class="mb-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Favoriten</div>
      <h1 class="truncate text-2xl font-semibold text-slate-900">Meine Favoriten</h1>
    </div>

    <div v-if="spotFavoritesStore.isLoading" class="py-10 text-center text-sm text-slate-500">
      Favoriten werden geladen...
    </div>

    <section
      v-else-if="spotFavoritesStore.favorites.length === 0"
      class="flex min-h-[calc(100vh-180px)] flex-col items-center justify-center px-4 py-12 text-center"
    >
      <div
        class="flex size-16 items-center justify-center rounded-full bg-primary-50 text-accent-600"
      >
        <n-icon size="28">
          <Heart />
        </n-icon>
      </div>

      <h2 class="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
        Noch keine Favoriten
      </h2>

      <p class="mt-3 max-w-xs text-sm leading-6 text-slate-500">
        Markiere Spots mit dem Herz, um sie hier schneller wiederzufinden.
      </p>
    </section>

    <div v-else class="space-y-3">
      <RouterLink
        v-for="favorite in spotFavoritesStore.favorites"
        :key="favorite.id"
        :to="{ name: 'spot-detail', params: { id: favorite.spot } }"
        class="block no-underline"
      >
        <article
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-primary-600 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex min-w-0 items-center gap-2">
                <h2 class="truncate text-base font-semibold text-slate-950">
                  {{ favorite.expand?.spot?.name ?? 'Unbekannter Spot' }}
                </h2>

                <span
                  v-if="favorite.expand?.spot?.category"
                  class="shrink-0 rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700"
                >
                  {{ favorite.expand.spot.category }}
                </span>
              </div>

              <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                <span v-if="favorite.expand?.spot?.expand?.collection?.name">
                  {{ favorite.expand.spot.expand.collection.name }}
                </span>

                <span v-if="hasLocation(favorite)" class="text-emerald-600"> Mit Standort </span>

                <span v-else> Ohne Standort </span>
              </div>

              <p
                v-if="favorite.expand?.spot?.description"
                class="mt-2 line-clamp-2 text-sm leading-5 text-slate-500"
              >
                {{ favorite.expand.spot.description }}
              </p>
            </div>

            <button
              type="button"
              class="group -mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-full active:scale-95"
              aria-label="Favorit entfernen"
              @click.prevent.stop="removeFavorite(favorite.spot)"
            >
              <span
                class="flex size-9 items-center justify-center rounded-full text-accent-600 transition group-hover:bg-accent-100 group-hover:text-accent-700"
              >
                <n-icon size="20">
                  <Heart />
                </n-icon>
              </span>
            </button>
          </div>
        </article>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { NIcon, useMessage } from 'naive-ui';
import { Heart } from '@vicons/ionicons5';
import { useSpotFavoritesStore } from '@/stores/spotFavorites';
import type { SpotFavorite } from '@/types/spotFavorite';

const message = useMessage();
const spotFavoritesStore = useSpotFavoritesStore();

onMounted(() => {
  spotFavoritesStore.fetchFavorites();
});

async function removeFavorite(spotId: string) {
  try {
    await spotFavoritesStore.removeFavorite(spotId);
  } catch {
    message.error('Favorit konnte nicht entfernt werden.');
  }
}

const hasLocation = (favorite: SpotFavorite) => {
  const lat = favorite.expand?.spot?.locationLat;
  const lng = favorite.expand?.spot?.locationLng;

  return lat != null && lng != null && !(lat === 0 && lng === 0);
};
</script>
