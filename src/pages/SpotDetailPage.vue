<template>
  <main class="mx-auto max-w-4xl pb-10">
    <template v-if="spot">
      <SpotDetailHeader
        :spot="spot"
        :has-location="Boolean(spotLatLng)"
        :collection-name="collectionName"
        :can-edit-spot="canEditSpot"
        @edit="editSpot(spot)"
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
import { useSingleSpotMap } from '@/composables/useSpotMap';
import { confirmDialogOptions } from '@/utils/confirmDialogOptions';

const route = useRoute();
const router = useRouter();
const message = useMessage();
const dialog = useDialog();

const spotStore = useSpotStore();

const showEditModal = ref(false);
const showLocationModal = ref(false);

const selectedSpot = ref<Spot | null>(null);
const spot = ref<Spot | null>(null);

const spotId = computed(() => String(route.params.id));

const { spotLatLng, mapCenter, spotIcon } = useSingleSpotMap(spot);

const collectionName = computed(() => {
  return spot.value?.expand?.collection?.name ?? 'Nicht angegeben';
});

const authUserId = computed(() => pb.authStore.record?.id ?? null);

const canEditSpot = computed(() => {
  return Boolean(spot.value && spot.value.user === authUserId.value);
});

watch(
  spotId,
  async id => {
    spot.value = null;

    if (!id) return;

    try {
      const loadedSpot = await spotStore.fetchSpotById(id);

      spot.value = loadedSpot;
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
