<!-- src/components/spot-detail/SpotLocationDrawer.vue -->
<template>
  <n-drawer
    :show="show"
    placement="bottom"
    height="82vh"
    :style="{
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
      overflow: 'hidden',
    }"
    @update:show="emit('update:show', $event)"
  >
    <n-drawer-content
      :title="hasSavedLocation ? 'Standort ändern' : 'Standort eintragen'"
      closable
      :native-scrollbar="false"
      :body-content-style="{
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }"
    >
      <div class="flex min-h-0 h-full flex-col">
        <div class="shrink-0 px-6 pt-2 pb-4">
          <p class="text-sm leading-6 text-slate-500">
            Tippe auf die Karte, um den Standort des Spots zu setzen. Der Marker wird an die
            gewählte Position verschoben.
          </p>
        </div>

        <div class="shrink-0 px-6 pt-1 pb-3">
          <n-button
            block
            secondary
            round
            type="primary"
            :loading="isLocating"
            :disabled="isLocating || !isGeolocationSupported"
            @click="useCurrentBrowserLocation"
          >
            <template #icon>
              <n-icon>
                <LocateOutline />
              </n-icon>
            </template>

            {{ isLocating ? 'Standort wird ermittelt …' : 'Aktuellen Standort verwenden' }}
          </n-button>

          <div v-if="selectedLatLng" class="mt-2 flex justify-center">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isSaving"
              @click="removeLocation"
            >
              <n-icon size="14">
                <CloseCircleOutline />
              </n-icon>
              Auswahl zurücksetzen
            </button>
          </div>

          <p v-if="!isGeolocationSupported" class="mt-2 text-xs leading-5 text-slate-400">
            Dein Browser unterstützt die Standortermittlung nicht.
          </p>
        </div>

        <div class="mx-6 min-h-[180px] flex-1 overflow-hidden rounded-3xl bg-slate-200">
          <LMap
            :zoom="DEFAULT_MAP_ZOOM"
            :center="defaultMapCenter"
            :use-global-leaflet="false"
            class="h-full w-full"
            @ready="handleMapReady"
          >
            <LTileLayer
              :url="`https://api.thunderforest.com/outdoors/{z}/{x}/{y}{r}.png?apikey=${thunderforestApiKey}`"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.thunderforest.com/">Thunderforest</a>'
            />

            <LMarker v-if="selectedLatLng" :lat-lng="selectedLatLng" :icon="spotIcon" />
          </LMap>
        </div>

        <div class="shrink-0 space-y-4 px-6 pt-4 pb-6">
          <div v-if="selectedLatLng" class="rounded-2xl bg-slate-50 p-3">
            <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Ausgewählt
            </div>

            <div class="mt-1 font-mono text-sm text-slate-700">
              {{ selectedLatLng[0].toFixed(6) }},
              {{ selectedLatLng[1].toFixed(6) }}
            </div>
          </div>

          <div v-else class="rounded-2xl bg-slate-50 p-3 text-sm text-slate-500">
            Tippe auf die Karte, um einen Standort auszuwählen.
          </div>

          <div class="grid grid-cols-2 gap-2">
            <n-button block secondary round @click="emit('update:show', false)">
              Abbrechen
            </n-button>

            <n-button
              type="primary"
              secondary
              round
              :loading="isSaving"
              :disabled="!canSave"
              @click="save"
            >
              Speichern
            </n-button>
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import { NButton, NDrawer, NDrawerContent, NIcon, useMessage } from 'naive-ui';
import { LocateOutline, CloseCircleOutline } from '@vicons/ionicons5';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import type { LeafletMouseEvent, Map as LeafletMap } from 'leaflet';

import type { Spot } from '@/types/spot';

import { useSpotStore } from '@/stores/spotStore';
import { useCollectionStore } from '@/stores/collectionStore';
import { DEFAULT_MAP_ZOOM, FOCUSED_MAP_ZOOM, useSingleSpotMap } from '@/composables/useSpotMap';
import { createSpotIcon } from '@/composables/useLeafletSpotIcon';
import { useCurrentGeoLocation } from '@/composables/useCurrentGeoLocation';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    spot?: Spot | null;
  }>(),
  {
    show: false,
    spot: null,
  }
);

const emit = defineEmits<{
  'update:show': [value: boolean];
  saved: [spot: Spot];
}>();

const thunderforestApiKey = import.meta.env.VITE_THUNDERFOREST_API_KEY;

const message = useMessage();
const spotStore = useSpotStore();
const collectionStore = useCollectionStore();

const selectedLatLng = ref<[number, number] | null>(null);
const mapRef = ref<LeafletMap | null>(null);
const isSaving = ref(false);

const spotRef = computed(() => props.spot);
const spotIcon = createSpotIcon();
const { spotLatLng, mapCenter, defaultMapCenter } = useSingleSpotMap(spotRef);
const {
  isSupported: isGeolocationSupported,
  isLocating,
  getCurrentLocation,
} = useCurrentGeoLocation();

const hasSavedLocation = computed(() => spotLatLng.value !== null);

const useCurrentBrowserLocation = async () => {
  try {
    const location = await getCurrentLocation();

    setSelectedLocation([location.lat, location.lng]);
    message.success('Aktueller Standort wurde übernommen.');
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Standort konnte nicht ermittelt werden.';
    message.error(msg);
  }
};

const canSave = computed(() => {
  return Boolean(props.spot && (selectedLatLng.value || hasSavedLocation.value) && !isSaving.value);
});

const removeLocation = () => {
  selectedLatLng.value = null;

  if (!canUseMap()) return;

  mapRef.value?.setView(mapCenter.value, DEFAULT_MAP_ZOOM);
};

const canUseMap = () => {
  const map = mapRef.value;
  if (!map || !props.show) return false;
  const container = map.getContainer?.();
  return Boolean(container && container.isConnected);
};

const invalidateMapSize = async () => {
  await nextTick();

  window.setTimeout(() => {
    if (!canUseMap()) return;

    mapRef.value?.invalidateSize();
    syncMapView();
  }, 250);
};

const setSelectedLocation = (latLng: [number, number]) => {
  selectedLatLng.value = latLng;

  if (!canUseMap()) return;

  mapRef.value?.setView(latLng, FOCUSED_MAP_ZOOM);
};

const syncMapView = () => {
  const latLng = spotLatLng.value;
  selectedLatLng.value = latLng;

  if (!canUseMap()) return;

  mapRef.value?.setView(latLng ?? mapCenter.value, latLng ? FOCUSED_MAP_ZOOM : DEFAULT_MAP_ZOOM);
};

watch(
  () => props.spot,
  () => {
    syncMapView();
  },
  { immediate: true }
);

watch(
  () => props.show,
  show => {
    if (!show) {
      mapRef.value?.off('click', handleMapClick);
      mapRef.value = null;
      return;
    }

    syncMapView();
    invalidateMapSize();
  }
);

const handleMapReady = (map: LeafletMap) => {
  mapRef.value = map;
  map.on('click', handleMapClick);
  syncMapView();
  invalidateMapSize();
};

const handleMapClick = (event: LeafletMouseEvent) => {
  setSelectedLocation([event.latlng.lat, event.latlng.lng]);
};

const save = async () => {
  const spot = props.spot;
  if (!spot) return;

  isSaving.value = true;

  try {
    const savedSpot = await spotStore.updateSpotLocation(
      spot.id,
      {
        locationLat: selectedLatLng.value?.[0] ?? null,
        locationLng: selectedLatLng.value?.[1] ?? null,
      },
      collectionStore.activeCollectionId
    );

    message.success(selectedLatLng.value ? 'Standort gespeichert' : 'Standort entfernt');
    emit('saved', savedSpot);
    emit('update:show', false);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Standort konnte nicht gespeichert werden';
    message.error(msg);
  } finally {
    isSaving.value = false;
  }
};
</script>
