import { defineStore } from 'pinia';
import { pb } from '@/services/pocketbase';
import type { Collection } from '@/types/collection';

export const useCollectionStore = defineStore('collections', {
  state: () => ({
    collections: [] as Collection[],
    activeCollectionId: null as string | null,
    isLoading: false,
  }),

  getters: {
    activeCollection: state =>
      state.collections.find(collection => collection.id === state.activeCollectionId) ?? null,

    collectionOptions: state =>
      state.collections.map(collection => ({
        label: collection.name,
        value: collection.id,
      })),

    hasCollections: state => state.collections.length > 0,
  },

  actions: {
    async fetchCollections() {
      this.isLoading = true;

      try {
        const records = await pb.collection('collections').getFullList<Collection>({
          sort: 'created',
        });

        this.collections = records;

        if (!this.activeCollectionId && records.length > 0) {
          this.activeCollectionId = records[0].id;
        }

        if (
          this.activeCollectionId &&
          !records.some(collection => collection.id === this.activeCollectionId)
        ) {
          this.activeCollectionId = records[0]?.id ?? null;
        }
      } finally {
        this.isLoading = false;
      }
    },

    async createCollection(name: string) {
      const userId = pb.authStore.record?.id;

      if (!userId) {
        throw new Error('Du musst eingeloggt sein');
      }

      const createdCollection = await pb.collection('collections').create<Collection>({
        name,
        owner: userId,
        members: [userId],
      });

      this.collections.push(createdCollection);
      this.activeCollectionId = createdCollection.id;

      return createdCollection;
    },

    async updateCollection(id: string, name: string) {
      const updatedCollection = await pb.collection('collections').update<Collection>(id, {
        name,
      });

      const index = this.collections.findIndex(collection => collection.id === id);

      if (index !== -1) {
        this.collections[index] = updatedCollection;
      }

      return updatedCollection;
    },

    async removeCollection(id: string) {
      await pb.collection('collections').delete(id);

      this.collections = this.collections.filter(collection => collection.id !== id);

      if (this.activeCollectionId === id) {
        this.activeCollectionId = this.collections[0]?.id ?? null;
      }
    },

    setActiveCollection(id: string) {
      this.activeCollectionId = id;
    },

    clearCollections() {
      this.collections = [];
      this.activeCollectionId = null;
      this.isLoading = false;
    },
  },
});
