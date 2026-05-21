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
      <article
        v-for="collection in sortedCollections"
        :key="collection.id"
        class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <h2 class="truncate font-semibold text-slate-950">
              {{ collection.name }}
            </h2>

            <p class="mt-0.5 text-sm text-slate-500">
              {{ collection.members?.length ?? 0 }}
              Mitglieder
            </p>
          </div>

          <span
            v-if="collectionStore.isOwner(collection)"
            class="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500"
          >
            Deine Collection
          </span>

          <n-button
            v-else-if="collectionStore.isSubscribed(collection)"
            secondary
            round
            :loading="pendingCollectionId === collection.id"
            :disabled="!!pendingCollectionId"
            @click="confirmLeaveCollection(collection.id)"
          >
            Verlassen
          </n-button>

          <n-button
            v-else
            type="primary"
            secondary
            round
            :loading="pendingCollectionId === collection.id"
            :disabled="!!pendingCollectionId"
            @click="joinCollection(collection.id)"
          >
            Beitreten
          </n-button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { NButton, useMessage, useDialog } from 'naive-ui';
import { useCollectionStore } from '@/stores/collectionStore';

import CollectionCreateDrawer from '@/components/collection/CollectionCreateDrawer.vue';

const collectionStore = useCollectionStore();
const message = useMessage();
const dialog = useDialog();

const showCollectionDrawer = ref(false);
const pendingCollectionId = ref<string | null>(null);

onMounted(async () => {
  await collectionStore.fetchAllCollections();
});

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

function confirmLeaveCollection(id: string) {
  dialog.warning({
    title: 'Collection verlassen?',
    content: 'Du siehst die Spots dieser Collection danach nicht mehr in deiner App.',
    positiveText: 'Verlassen',
    negativeText: 'Abbrechen',

    style: {
      width: 'calc(100vw - 2rem)',
      maxWidth: '24rem',
      borderRadius: '1.5rem',
      padding: '1rem',
    },

    class: 'localspot-dialog',

    positiveButtonProps: {
      type: 'error',
      secondary: true,
      round: true,
    },

    negativeButtonProps: {
      secondary: true,
      round: true,
    },

    onPositiveClick: () => leaveCollection(id),
  });
}

async function leaveCollection(id: string) {
  pendingCollectionId.value = id;

  try {
    await collectionStore.unsubscribeCollection(id);
    message.success('Collection verlassen');
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Verlassen fehlgeschlagen';
    message.error(msg);
  } finally {
    pendingCollectionId.value = null;
  }
}

const sortedCollections = computed(() =>
  [...collectionStore.allCollections].sort((a, b) => {
    const aMine = collectionStore.isOwner(a) || collectionStore.isSubscribed(a);
    const bMine = collectionStore.isOwner(b) || collectionStore.isSubscribed(b);

    if (aMine !== bMine) return aMine ? -1 : 1;

    return a.name.localeCompare(b.name, 'de');
  })
);
</script>
