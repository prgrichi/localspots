<template>
  <div class="mx-auto max-w-3xl px-4 md:px-8 pb-4">
    <div class="mb-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Collections</div>
      <h1 class="truncate text-2xl font-semibold text-slate-900">Collections entdecken</h1>
    </div>

    <CollectionCreateDrawer v-model:show="showCollectionDrawer" @created="onCollectionCreated" />

    <section v-if="collectionStore.isLoadingAllCollections" class="py-10 text-sm text-slate-500">
      Collections werden geladen...
    </section>

    <section
      v-else-if="!collectionStore.hasAllCollections"
      class="flex min-h-[calc(100vh-180px)] flex-col items-center justify-center px-4 py-12 text-center"
    >
      <div class="flex size-16 items-center justify-center rounded-full bg-primary-50">
        <span class="block size-6 rounded-full bg-accent-600"></span>
      </div>

      <h2 class="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
        Noch keine Collections
      </h2>

      <p class="mt-3 max-w-xs text-sm leading-6 text-slate-500">
        Erstelle die erste Collection und sammle dort deine Spots.
      </p>

      <div class="mt-4">
        <n-button type="primary" secondary size="large" round @click="showCollectionDrawer = true">
          Collection erstellen
        </n-button>
      </div>
    </section>

    <section v-else class="space-y-3">
      <CollectionCard
        v-for="collection in collectionStore.allCollections"
        :key="collection.id"
        :collection="collection"
        primary-text="Mitglieder"
        :is-owner="collectionStore.isOwner(collection)"
        :is-subscribed="collectionStore.isSubscribed(collection)"
        :is-pending="pendingCollectionId === collection.id"
        :is-disabled="!!pendingCollectionId"
        show-join
        @primary="openMembersDrawer"
        @leave="confirmLeaveCollection"
        @join="joinCollection"
      />
    </section>

    <CollectionMemberDrawer :collection="selectedCollection" v-model:show="showMembersDrawer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { NButton, useMessage } from 'naive-ui';
import { useCollectionStore } from '@/stores/collectionStore';
import { useCollectionLeaveDialog } from '@/composables/useCollectionLeaveDialog';
import { confirmDialogOptions } from '@/utils/confirmDialogOptions';

import CollectionCreateDrawer from '@/components/collection/CollectionCreateDrawer.vue';
import CollectionMemberDrawer from '@/components/collection/CollectionMemberDrawer.vue';
import CollectionCard from '@/components/collection/CollectionCard.vue';

const collectionStore = useCollectionStore();
const message = useMessage();

const showCollectionDrawer = ref(false);
const pendingCollectionId = ref<string | null>(null);

const showMembersDrawer = ref(false);
const selectedCollectionId = ref<string | null>(null);

const { confirmLeaveCollection } = useCollectionLeaveDialog({
  pendingCollectionId,
  onLeave: id => collectionStore.unsubscribeCollection(id),
  dialogOptions: confirmDialogOptions,
});

onMounted(async () => {
  await collectionStore.fetchAllCollections();
});

const selectedCollection = computed(
  () =>
    collectionStore.allCollections.find(
      collection => collection.id === selectedCollectionId.value
    ) ?? null
);

function openMembersDrawer(id: string) {
  selectedCollectionId.value = id;
  showMembersDrawer.value = true;
}

const onCollectionCreated = () => {
  showCollectionDrawer.value = false;
};

async function joinCollection(id: string) {
  pendingCollectionId.value = id;

  try {
    await collectionStore.subscribeCollection(id);
    message.success('Collection beigetreten');
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Beitritt fehlgeschlagen';
    message.error(msg);
  } finally {
    pendingCollectionId.value = null;
  }
}
</script>
