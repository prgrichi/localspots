<template>
  <main class="flex h-full min-h-0 flex-col">
    <div class="mb-4 px-4 md:px-8">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Kartenansicht</div>

      <h1 class="mt-1 line-clamp-2 text-2xl font-semibold leading-tight text-slate-900">
        {{ collectionStore.activeCollection?.name ?? 'Collection wählen' }}
      </h1>

      <p v-if="collectionStore.activeCollectionId" class="mt-1 text-sm text-slate-500">
        {{ spotMarkers.length }}
        {{ spotMarkers.length === 1 ? 'Standort' : 'Standorte' }}
      </p>
    </div>

    <div class="relative z-0 min-h-0 flex-1 overflow-hidden bg-slate-200">
      <LMap
        :zoom="defaultMapZoom"
        :center="mapCenter"
        :use-global-leaflet="false"
        class="relative z-0 h-full w-full"
        @ready="handleMapReady"
      >
        <LTileLayer
          :url="`https://api.thunderforest.com/outdoors/{z}/{x}/{y}{r}.png?apikey=${thunderforestApiKey}`"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.thunderforest.com/">Thunderforest</a>'
        />
        <LMarker
          v-for="{ spot, latLng } in spotMarkers"
          :key="spot.id"
          :lat-lng="latLng"
          :icon="spotIcon"
        >
          <LPopup>
            <div class="min-w-40 max-w-56 py-0.5">
              <div class="space-y-1.5">
                <div class="text-sm font-semibold leading-5 text-slate-900">
                  {{ spot.name || 'Unbenannter Spot' }}
                </div>

                <div v-if="spot.category">
                  <span
                    class="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                  >
                    {{ spot.category }}
                  </span>
                </div>
              </div>

              <div class="mt-3 border-t border-slate-100 pt-2">
                <RouterLink
                  :to="{ name: 'spot-detail', params: { id: spot.id } }"
                  class="localspot-link inline-flex items-center gap-1 text-xs font-semibold transition"
                >
                  Spot ansehen
                  <span aria-hidden="true">→</span>
                </RouterLink>
              </div>
            </div>
          </LPopup>
        </LMarker>
      </LMap>

      <div
        v-if="hasLoadedSpots && !isLoadingSpots && spotMarkers.length === 0"
        class="absolute left-4 right-4 top-4 z-[500] rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur md:left-8 md:right-8"
      >
        <div class="text-sm font-semibold text-slate-900">Keine Standorte vorhanden</div>
        <div class="mt-1 text-sm text-slate-500">
          Für diese Collection sind noch keine Spot-Standorte hinterlegt.
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { RouterLink } from 'vue-router';

import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import { useMessage } from 'naive-ui';

import { useSpotStore } from '@/stores/spotStore';
import { useCollectionStore } from '@/stores/collectionStore';
import { useSpotMap } from '@/composables/useSpotMap';

import { useEnsureCollections } from '@/composables/useEnsureCollections';

const thunderforestApiKey = import.meta.env.VITE_THUNDERFOREST_API_KEY;

const spotStore = useSpotStore();
const collectionStore = useCollectionStore();
const message = useMessage();

const hasLoadedSpots = ref(false);
const isLoadingSpots = ref(false);
const isMapReady = ref(false);
const mapRef = ref<LeafletMap | null>(null);

const spots = computed(() => spotStore.spots);

useEnsureCollections();

const { spotMarkers, mapCenter, spotIcon, mapBounds, spotLatLngs, defaultMapZoom, focusedMapZoom } =
  useSpotMap(spots);

function handleMapReady(map: LeafletMap) {
  mapRef.value = map;
  isMapReady.value = true;
}

watch(
  [mapBounds, spotLatLngs, isMapReady],
  ([bounds, coordinates, ready]) => {
    if (!ready) {
      return;
    }

    const leafletMap = mapRef.value;

    if (!leafletMap) {
      return;
    }

    if (bounds) {
      leafletMap.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: focusedMapZoom,
        animate: false,
      });

      return;
    }

    if (coordinates.length === 1) {
      leafletMap.setView(coordinates[0], focusedMapZoom, {
        animate: false,
      });

      return;
    }

    leafletMap.setView(mapCenter, defaultMapZoom, {
      animate: false,
    });
  },
  { immediate: true }
);

watch(
  () => collectionStore.activeCollectionId,
  async (collectionId: string | null) => {
    hasLoadedSpots.value = false;

    if (!collectionId) {
      spotStore.clearSpots();
      isLoadingSpots.value = false;
      return;
    }

    isLoadingSpots.value = true;

    try {
      await spotStore.fetchSpots(collectionId);
    } catch {
      message.error('Spot-Standorte konnten nicht geladen werden');
    } finally {
      isLoadingSpots.value = false;
      hasLoadedSpots.value = true;
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  isMapReady.value = false;
  mapRef.value = null;
});
</script>
