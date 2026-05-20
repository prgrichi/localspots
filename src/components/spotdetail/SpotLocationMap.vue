<template>
  <div class="mt-4 h-[250px] w-full overflow-hidden bg-slate-200">
    <LMap
      :zoom="DEFAULT_MAP_ZOOM"
      :center="initialCenter"
      :use-global-leaflet="false"
      class="h-full w-full"
      @ready="handleMapReady"
    >
      <LTileLayer
        :url="`https://api.thunderforest.com/outdoors/{z}/{x}/{y}{r}.png?apikey=${thunderforestApiKey}`"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.thunderforest.com/">Thunderforest</a>'
      />

      <LMarker v-if="latLng" :lat-lng="latLng" :icon="spotIcon">
        <LPopup>
          <strong>{{ spot.name }}</strong>
        </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import { DEFAULT_MAP_ZOOM, FOCUSED_MAP_ZOOM } from '@/composables/useSpotMap';

const props = defineProps({
  spot: {
    type: Object,
    required: true,
  },
  latLng: {
    type: Array,
    default: null,
  },
  mapCenter: {
    type: Array,
    required: true,
  },
  spotIcon: {
    type: Object,
    required: true,
  },
});

const thunderforestApiKey = import.meta.env.VITE_THUNDERFOREST_API_KEY;

const mapRef = ref(null);
const initialCenter = ref(props.mapCenter);

const setMapView = (center, zoom) => {
  if (!mapRef.value) return;
  mapRef.value.setView(center, zoom);
};

const handleMapReady = map => {
  mapRef.value = map;
  if (props.latLng) {
    setMapView(props.latLng, FOCUSED_MAP_ZOOM);
    return;
  }
  setMapView(props.mapCenter, DEFAULT_MAP_ZOOM);
};

watch(
  () => props.latLng,
  latLng => {
    if (!latLng) return;
    setMapView(latLng, FOCUSED_MAP_ZOOM);
  },
  { immediate: true }
);

watch(
  () => props.mapCenter,
  center => {
    if (props.latLng) return;
    setMapView(center, DEFAULT_MAP_ZOOM);
  },
  { immediate: true }
);
</script>
