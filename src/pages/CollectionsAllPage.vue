<template>
  <div class="mx-auto max-w-3xl px-4 md:px-8 pb-4">
    <div class="mb-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Collections</div>
      <h1 class="truncate text-2xl font-semibold text-slate-900">Collections entdecken</h1>
    </div>

    <section v-if="collectionStore.isLoadingAllCollections" class="py-10 text-sm text-slate-500">
      Collections werden geladen...
    </section>

    <section v-else-if="!collectionStore.hasAllCollections" class="py-10 text-sm text-slate-500">
      Noch keine Collections vorhanden
    </section>

    <section v-else class="space-y-3">
      <article
        v-for="collection in collectionStore.allCollections"
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
            @click="collectionStore.unsubscribeCollection(collection.id)"
          >
            Unsubscriben
          </n-button>

          <n-button
            v-else
            type="primary"
            secondary
            round
            @click="collectionStore.subscribeCollection(collection.id)"
          >
            SubscrBiben
          </n-button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { NButton } from 'naive-ui';
import { useCollectionStore } from '@/stores/collectionStore';

const collectionStore = useCollectionStore();

onMounted(async () => {
  await collectionStore.fetchAllCollections();
});
</script>
