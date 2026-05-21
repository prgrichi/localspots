// src/composables/useEnsureCollections.ts
import { onMounted } from 'vue';
import { useCollectionStore } from '@/stores/collectionStore';

export function useEnsureCollections() {
  const collectionStore = useCollectionStore();

  onMounted(() => {
    collectionStore.ensureMyCollectionsLoaded();
  });

  return collectionStore;
}
