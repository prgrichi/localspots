<template>
  <main class="mx-auto max-w-4xl pb-10">
    <template v-if="spot">
      <SpotDetailHeader
        :spot="spot"
        :has-location="Boolean(spotLatLng)"
        :collection-name="collectionName"
        :can-edit-spot="canEditSpot"
        :creator-name="creatorName"
        :is-favorite="isFavorite"
        @edit="editSpot(spot)"
        @toggle-favorite="toggleFavorite"
      />

      <SpotLocationMap
        :spot="spot"
        :lat-lng="spotLatLng"
        :map-center="mapCenter"
        :spot-icon="spotIcon"
      />

      <SpotLocationPanel
        :has-location="Boolean(spotLatLng)"
        :can-edit-location="canEditSpot"
        @edit-location="openLocationModal"
      />
    </template>

    <SpotEditDrawer
      v-model:show="showEditModal"
      :spot="selectedSpot"
      @saved="handleSpotSaved"
      @delete="deleteSpot(spot)"
    />

    <SpotLocationDrawer v-model:show="showLocationModal" :spot="spot" @saved="handleSpotSaved" />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useMessage, useDialog } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';
import { pb } from '@/services/pocketbase';
import type { Spot } from '@/types/spot';

import SpotEditDrawer from '@/components/spot-detail/SpotEditDrawer.vue';
import SpotDetailHeader from '@/components/spot-detail/SpotDetailHeader.vue';
import SpotLocationMap from '@/components/spot-detail/SpotLocationMap.vue';
import SpotLocationPanel from '@/components/spot-detail/SpotLocationPanel.vue';
import SpotLocationDrawer from '@/components/spot-detail/SpotLocationDrawer.vue';

import { useSpotStore } from '@/stores/spotStore';
import { useSpotFavoritesStore } from '@/stores/spotFavorites';
import { useSingleSpotMap } from '@/composables/useSpotMap';
import { createSpotIcon } from '@/composables/useLeafletSpotIcon';
import { confirmDialogOptions } from '@/utils/confirmDialogOptions';

const route = useRoute();
const router = useRouter();
const message = useMessage();
const dialog = useDialog();

const spotStore = useSpotStore();
const spotFavoritesStore = useSpotFavoritesStore();

const showEditModal = ref(false);
const showLocationModal = ref(false);

const selectedSpot = ref<Spot | null>(null);
const spot = ref<Spot | null>(null);

const spotId = computed(() => String(route.params.id));

const spotIcon = createSpotIcon();
const { spotLatLng, mapCenter } = useSingleSpotMap(spot);

const authUserId = computed(() => pb.authStore.record?.id ?? null);

const isFavorite = computed(() => {
  if (!spot.value) return false;

  return spotFavoritesStore.isFavorite(spot.value.id);
});

const isOwnSpot = computed(() => {
  return Boolean(spot.value && spot.value.user === authUserId.value);
});

const canEditSpot = computed(() => {
  return isOwnSpot.value;
});

const creatorName = computed(() => {
  if (isOwnSpot.value) return 'dir';

  return spot.value?.expand?.user?.name ?? 'Unbekannt';
});

const collectionName = computed(() => {
  return spot.value?.expand?.collection?.name ?? 'Nicht angegeben';
});

watch(
  spotId,
  async id => {
    spot.value = null;

    if (!id) return;

    try {
      const [loadedSpot] = await Promise.all([
        spotStore.fetchSpotById(id),
        spotFavoritesStore.fetchFavorites(),
      ]);

      spot.value = loadedSpot;
    } catch {
      message.error('Spot konnte nicht geladen werden');
    }
  },
  { immediate: true }
);

const toggleFavorite = async () => {
  if (!spot.value) return;

  try {
    await spotFavoritesStore.toggleFavorite(spot.value.id);
  } catch {
    message.error('Favorit konnte nicht gespeichert werden');
  }
};

const handleSpotSaved = (updatedSpot: Spot) => {
  spot.value = updatedSpot;
  selectedSpot.value = updatedSpot;
};

const editSpot = (spot: Spot | null) => {
  if (!spot) return;

  selectedSpot.value = spot;
  showEditModal.value = true;
};

const openLocationModal = () => {
  showLocationModal.value = true;
};

const deleteSpot = (spot: Spot | null) => {
  if (!spot) return;

  const name = [spot.name].filter(Boolean).join(' ') || 'diesen Spot';

  dialog.warning({
    title: 'Spot löschen',
    content: `Möchtest du "${name}" wirklich löschen?`,
    positiveText: 'Löschen',
    negativeText: 'Abbrechen',
    ...confirmDialogOptions,

    async onPositiveClick() {
      try {
        await spotStore.removeSpot(spot.id);
        message.success('Spot gelöscht');
        await router.push('/spots');
      } catch {
        message.error('Spot konnte nicht gelöscht werden');
      }
    },
  });
};
</script>
