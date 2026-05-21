import { defineStore } from 'pinia';
import { pb } from '@/services/pocketbase';
import type {
  AddSpotPayload,
  Spot,
  UpdateSpotLocationPayload,
  UpdateSpotPayload,
} from '@/types/spot';

export const useSpotStore = defineStore('savedSpots', {
  state: () => ({
    spots: [] as Spot[],
    allSpots: [] as Spot[],
    isLoading: false,
    isLoadingAll: false,
  }),

  actions: {
    async fetchSpots(collectionId: string) {
      this.isLoading = true;

      try {
        const records = await pb.collection('spots').getFullList<Spot>({
          filter: `collection="${collectionId}"`,
          sort: '-created',
        });

        this.spots = records;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSpotById(spotId: string) {
      const spot = await pb.collection('spots').getOne<Spot>(spotId, {
        expand: 'collection',
      });

      return spot;
    },

    async fetchAllSpots() {
      this.isLoadingAll = true;

      try {
        const records = await pb.collection('spots').getFullList<Spot>({
          expand: 'collection',
          sort: '-created',
        });

        this.allSpots = records;
      } finally {
        this.isLoadingAll = false;
      }
    },

    async addSpot(collectionId: string, spot: AddSpotPayload) {
      // const formattedPlate = formatPlate(spot.plate);
      // const normalizedPlate = normalizePlate(spot.plate);

      const createdSpot = await pb.collection('spots').create<Spot>({
        ...spot,
        collection: collectionId,
      });

      this.spots.unshift(createdSpot);
      this.allSpots.unshift(createdSpot);

      return createdSpot;
    },

    async updateSpot(
      id: string,
      updatedSpot: UpdateSpotPayload,
      currentCollectionId: string | null
    ) {
      const savedSpot = await pb.collection('spots').update<Spot>(id, {
        ...updatedSpot,
      });

      const index = this.spots.findIndex(spot => spot.id === id);
      const allIndex = this.allSpots.findIndex(spot => spot.id === id);

      if (index !== -1) {
        if (savedSpot.collection === currentCollectionId) {
          this.spots[index] = savedSpot;
        } else {
          this.spots = this.spots.filter(spot => spot.id !== id);
        }
      }
      if (allIndex !== -1) {
        this.allSpots[allIndex] = savedSpot;
      }

      return savedSpot;
    },

    async updateSpotLocation(
      id: string,
      location: UpdateSpotLocationPayload,
      currentCollectionId: string | null
    ) {
      try {
        const hasLocation = location.locationLat !== null && location.locationLng !== null;

        const savedSpot = await pb.collection('spots').update<Spot>(id, {
          locationLat: location.locationLat,
          locationLng: location.locationLng,
          locationUpdatedAt: hasLocation ? new Date().toISOString() : null,
        });

        const index = this.spots.findIndex(spot => spot.id === id);
        const allIndex = this.allSpots.findIndex(spot => spot.id === id);

        if (index !== -1) {
          if (savedSpot.collection === currentCollectionId) {
            this.spots[index] = savedSpot;
          } else {
            this.spots = this.spots.filter(spot => spot.id !== id);
          }
        }

        if (allIndex !== -1) {
          this.allSpots[allIndex] = savedSpot;
        }

        return savedSpot;
      } catch {
        throw new Error('Standort konnte nicht gespeichert werden');
      }
    },

    async removeSpot(id: string) {
      await pb.collection('spots').delete(id);
      this.spots = this.spots.filter(spot => spot.id !== id);
      this.allSpots = this.allSpots.filter(spot => spot.id !== id);
    },

    clearSpots() {
      this.spots = [];
      this.allSpots = [];
    },
  },
});
