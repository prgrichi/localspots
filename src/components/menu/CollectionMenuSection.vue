<template>
  <div
    v-if="collectionStore.hasCollections"
    class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
  >
    <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
      Aktive Collection
    </div>

    <n-select
      :value="collectionStore.activeCollectionId"
      :options="collectionOptions"
      placeholder="Collection wählen"
      @update:value="selectCollection"
      class="mb-3"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NSelect } from 'naive-ui';
import { useCollectionStore } from '@/stores/collectionStore';

const collectionStore = useCollectionStore();

const collectionOptions = computed(() => collectionStore.collectionOptions);

const selectCollection = (collectionId: string) => {
  collectionStore.setActiveCollection(collectionId);
};
</script>
