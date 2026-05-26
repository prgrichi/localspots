<template>
  <main class="mx-auto max-w-4xl pb-10">
    <template v-if="spot">
      <SpotDetailHeader
        :spot="spot"
        :has-location="Boolean(spotLatLng)"
        :collection-name="collectionName"
        @edit="editSpot(spot)"
      />

      <SpotLocationMap
        :spot="spot"
        :lat-lng="spotLatLng"
        :map-center="mapCenter"
        :spot-icon="spotIcon"
      />

      <SpotLocationPanel :has-location="Boolean(spotLatLng)" @edit-location="openLocationModal" />
    </template>

    <SpotEditModal
      v-model:show="showEditModal"
      :spot="selectedSpot"
      @saved="handleSpotSaved"
      @delete="deleteSpot(spot)"
    />

    <SpotLocationModal v-model:show="showLocationModal" :spot="spot" @saved="handleSpotSaved" />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useMessage, useDialog } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';
import type { Spot } from '@/types/spot';

import SpotEditModal from '@/components/spot-detail/SpotEditModal.vue';
import SpotDetailHeader from '@/components/spot-detail/SpotDetailHeader.vue';
import SpotLocationMap from '@/components/spot-detail/SpotLocationMap.vue';
import SpotLocationPanel from '@/components/spot-detail/SpotLocationPanel.vue';
import SpotLocationModal from '@/components/spot-detail/SpotLocationModal.vue';

import { useSpotStore } from '@/stores/spotStore';
import { useCollectionStore } from '@/stores/collectionStore';
import { useSingleSpotMap } from '@/composables/useSpotMap';
import { confirmDialogOptions } from '@/utils/confirmDialogOptions';

const route = useRoute();
const router = useRouter();
const message = useMessage();
const dialog = useDialog();

const spotStore = useSpotStore();
const collectionStore = useCollectionStore();

const showEditModal = ref(false);
const showLocationModal = ref(false);

const selectedSpot = ref<Spot | null>(null);
const spot = ref<Spot | null>(null);

const spotId = computed(() => String(route.params.id));

const { spotLatLng, mapCenter, spotIcon } = useSingleSpotMap(spot);

const collectionName = computed(() => {
  return collectionStore.activeCollection?.name ?? 'Nicht angegeben';
});

watch(
  spotId,
  async id => {
    spot.value = null;

    if (!id) return;

    try {
      const loadedSpot = await spotStore.fetchSpotById(id);

      spot.value = loadedSpot;

      if (loadedSpot.collection) {
        collectionStore.setActiveCollection(loadedSpot.collection);
      }
    } catch {
      message.error('Spot konnte nicht geladen werden');
    }
  },
  { immediate: true }
);

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

  const name = [spot.category].filter(Boolean).join(' ') || 'diesen Spot';

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
