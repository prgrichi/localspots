import { defineStore } from 'pinia';
import { pb } from '@/services/pocketbase';
import type { Collection } from '@/types/collection';

export const useCollectionStore = defineStore('collections', {
  state: () => ({
    collections: [] as Collection[], // subscribed collections
    allCollections: [] as Collection[],
    activeCollectionId: null as string | null,
    isLoading: false,
    isLoadingAllCollections: false,
    hasLoadedCollections: false,
    hasLoadedAllCollections: false,
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

    hasAllCollections: state => state.allCollections.length > 0,

    isSubscribed: () => {
      const userId = pb.authStore.record?.id;

      return (collection: Collection) => {
        return !!userId && (collection.members?.includes(userId) ?? false);
      };
    },
    isOwner: () => {
      const userId = pb.authStore.record?.id;

      return (collection: Collection) => {
        return !!userId && collection.owner === userId;
      };
    },
  },

  actions: {
    async fetchCollectionWithMembers(id: string) {
      return pb.collection('collections').getOne<Collection>(id, {
        expand: 'members',
      });
    },

    async ensureMyCollectionsLoaded() {
      if (this.hasLoadedCollections || this.isLoading) {
        return;
      }

      await this.fetchMyCollections();
    },

    async fetchAllCollections() {
      this.isLoadingAllCollections = true;

      try {
        this.allCollections = await pb.collection('collections').getFullList<Collection>({
          sort: 'created',
          expand: 'members',
        });

        this.hasLoadedAllCollections = true;
      } finally {
        this.isLoadingAllCollections = false;
      }
    },

    async fetchMyCollections() {
      const userId = pb.authStore.record?.id;

      if (!userId) {
        this.collections = [];
        this.activeCollectionId = null;
        this.hasLoadedCollections = false;
        return;
      }

      this.isLoading = true;

      try {
        const records = await pb.collection('collections').getFullList<Collection>({
          filter: `owner.id = "${userId}" || members.id ?= "${userId}"`,
          sort: 'created',
          expand: 'members',
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

        this.hasLoadedCollections = true;
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

      this.activeCollectionId = createdCollection.id;

      await this.fetchMyCollections();
      await this.fetchAllCollections();

      return createdCollection;
    },

    async renameCollection(id: string, name: string) {
      await pb.collection('collections').update<Collection>(id, {
        name,
      });

      const updatedCollection = await this.fetchCollectionWithMembers(id);

      const collectionsIndex = this.collections.findIndex(collection => collection.id === id);

      if (collectionsIndex !== -1) {
        this.collections[collectionsIndex] = updatedCollection;
      }

      const allCollectionsIndex = this.allCollections.findIndex(collection => collection.id === id);

      if (allCollectionsIndex !== -1) {
        this.allCollections[allCollectionsIndex] = updatedCollection;
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

    async subscribeCollection(id: string) {
      const userId = pb.authStore.record?.id;

      if (!userId) {
        throw new Error('Du musst eingeloggt sein');
      }

      const collection =
        this.allCollections.find(collection => collection.id === id) ??
        this.collections.find(collection => collection.id === id);

      if (!collection) {
        throw new Error('Collection nicht gefunden');
      }

      const members = collection.members ?? [];

      if (members.includes(userId)) {
        return collection;
      }

      await pb.collection('collections').update<Collection>(id, {
        members: [...members, userId],
      });

      const updatedCollection = await this.fetchCollectionWithMembers(id);

      this.replaceCollectionEverywhere(updatedCollection);

      if (!this.collections.some(collection => collection.id === updatedCollection.id)) {
        this.collections.push(updatedCollection);
      }

      if (!this.activeCollectionId) {
        this.activeCollectionId = updatedCollection.id;
      }

      return updatedCollection;
    },

    async unsubscribeCollection(id: string) {
      const userId = pb.authStore.record?.id;

      if (!userId) {
        throw new Error('Du musst eingeloggt sein');
      }

      const collection =
        this.allCollections.find(collection => collection.id === id) ??
        this.collections.find(collection => collection.id === id);

      if (!collection) {
        throw new Error('Collection nicht gefunden');
      }

      const members = collection.members ?? [];

      await pb.collection('collections').update<Collection>(id, {
        members: members.filter(memberId => memberId !== userId),
      });

      const updatedCollection = await this.fetchCollectionWithMembers(id);

      this.replaceCollectionEverywhere(updatedCollection);

      this.collections = this.collections.filter(collection => collection.id !== id);

      if (this.activeCollectionId === id) {
        this.activeCollectionId = this.collections[0]?.id ?? null;
      }

      return updatedCollection;
    },

    replaceCollectionEverywhere(updatedCollection: Collection) {
      const ownIndex = this.collections.findIndex(
        collection => collection.id === updatedCollection.id
      );

      if (ownIndex !== -1) {
        this.collections[ownIndex] = updatedCollection;
      }

      const allIndex = this.allCollections.findIndex(
        collection => collection.id === updatedCollection.id
      );

      if (allIndex !== -1) {
        this.allCollections[allIndex] = updatedCollection;
      }
    },

    setActiveCollection(id: string) {
      this.activeCollectionId = id;
    },

    clearCollections() {
      this.collections = [];
      this.allCollections = [];
      this.activeCollectionId = null;
      this.isLoading = false;
      this.isLoadingAllCollections = false;
      this.hasLoadedCollections = false;
      this.hasLoadedAllCollections = false;
    },
  },
});
