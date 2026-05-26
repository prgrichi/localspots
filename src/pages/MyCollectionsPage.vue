<template>
  <div class="mx-auto max-w-3xl px-4 md:px-8 pb-4">
    <div class="mb-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Collections</div>
      <h1 class="truncate text-2xl font-semibold text-slate-900">Meine Collections</h1>
    </div>

    <CollectionCreateDrawer v-model:show="showCollectionDrawer" @created="onCollectionCreated" />

    <!-- Wenn keine Collections existieren -->
    <NoCollectionsState
      v-if="!collectionStore.hasCollections"
      @create="showCollectionDrawer = true"
    />

    <!-- Wenn Collections existieren -->
    <section v-else class="space-y-3">
      <CollectionCard
        v-for="collection in collectionStore.collections"
        :key="collection.id"
        :collection="collection"
        primary-text="Details"
        :is-owner="collectionStore.isOwner(collection)"
        :is-subscribed="collectionStore.isSubscribed(collection)"
        :is-pending="pendingCollectionId === collection.id"
        :is-disabled="!!pendingCollectionId"
        @primary="openDetailsDrawer"
        @leave="confirmLeaveCollection"
      />
    </section>

    <CollectionDetailDrawer
      v-model:show="showDetailDrawer"
      :collection="selectedCollection"
      :is-owner="selectedCollection ? collectionStore.isOwner(selectedCollection) : false"
      :is-subscribed="selectedCollection ? collectionStore.isSubscribed(selectedCollection) : false"
      :is-pending="pendingCollectionId === selectedCollection?.id"
      @rename="renameCollection"
      @leave="confirmLeaveCollection"
      @delete="confirmDeleteCollection"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useCollectionStore } from '@/stores/collectionStore';
import { useMessage, useDialog } from 'naive-ui';
import { useCollectionLeaveDialog } from '@/composables/useCollectionLeaveDialog';
import { confirmDialogOptions } from '@/utils/confirmDialogOptions';

import CollectionCreateDrawer from '@/components/collection/CollectionCreateDrawer.vue';
import CollectionDetailDrawer from '@/components/collection/CollectionDetailDrawer.vue';
import NoCollectionsState from '@/components/collection/NoCollectionsState.vue';
import CollectionCard from '@/components/collection/CollectionCard.vue';

const collectionStore = useCollectionStore();

const showCollectionDrawer = ref(false);

const message = useMessage();
const dialog = useDialog();

const pendingCollectionId = ref<string | null>(null);

const showDetailDrawer = ref(false);
const selectedCollectionId = ref<string | null>(null);

const { confirmLeaveCollection } = useCollectionLeaveDialog({
  pendingCollectionId,
  onLeave: id => collectionStore.unsubscribeCollection(id),
  dialogOptions: confirmDialogOptions,
});

onMounted(async () => {
  await collectionStore.fetchMyCollections();
});

const selectedCollection = computed(
  () =>
    collectionStore.collections.find(collection => collection.id === selectedCollectionId.value) ??
    null
);

const onCollectionCreated = () => {
  showCollectionDrawer.value = false;
};

function openDetailsDrawer(id: string) {
  selectedCollectionId.value = id;
  showDetailDrawer.value = true;
}

function confirmDeleteCollection(id: string) {
  dialog.warning({
    title: 'Collection löschen?',
    content: 'Diese Collection wird dauerhaft gelöscht. Das kann nicht rückgängig gemacht werden.',
    positiveText: 'Löschen',
    negativeText: 'Abbrechen',
    ...confirmDialogOptions,
    onPositiveClick: () => deleteCollection(id),
  });
}

async function deleteCollection(id: string) {
  pendingCollectionId.value = id;

  try {
    await collectionStore.removeCollection(id);

    message.success('Collection gelöscht');

    if (selectedCollectionId.value === id) {
      showDetailDrawer.value = false;
      selectedCollectionId.value = null;
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Löschen fehlgeschlagen';
    message.error(msg);
  } finally {
    pendingCollectionId.value = null;
  }
}

async function renameCollection(id: string, name: string) {
  pendingCollectionId.value = id;

  try {
    await collectionStore.renameCollection(id, name);
    message.success('Collection umbenannt');
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Umbenennen fehlgeschlagen';
    message.error(msg);
  } finally {
    pendingCollectionId.value = null;
  }
}
</script>
