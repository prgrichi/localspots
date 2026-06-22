import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import type { AddSpotPayload, Spot, UpdateSpotPayload } from '@/types/spot';

const mocks = vi.hoisted(() => ({
  getFullList: vi.fn(),
  getOne: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('@/services/pocketbase', () => ({
  pb: {
    authStore: {
      record: {
        id: 'user-1',
      },
    },

    collection: vi.fn(() => ({
      getFullList: mocks.getFullList,
      getOne: mocks.getOne,
      create: mocks.create,
      update: mocks.update,
      delete: mocks.delete,
    })),
  },
}));

import { useSpotStore } from '../spotStore';

describe('spotStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('fetchSpots', () => {
    it('lädt Spots einer Collection', async () => {
      const spots: Spot[] = [
        {
          id: 'spot-1',
          name: 'Café Central',
          description: 'Gutes Frühstück',
          collection: 'collection-1',
          user: 'user-1',
          created: '2026-06-22 10:00:00.000Z',
          updated: '2026-06-22 10:00:00.000Z',
        },
        {
          id: 'spot-2',
          name: 'Stadtpark',
          description: 'Großer Park',
          collection: 'collection-1',
          user: 'user-1',
          created: '2026-06-21 10:00:00.000Z',
          updated: '2026-06-21 10:00:00.000Z',
        },
      ];

      mocks.getFullList.mockResolvedValue(spots);

      const store = useSpotStore();

      await store.fetchSpots('collection-1');

      expect(mocks.getFullList).toHaveBeenCalledWith({
        filter: 'collection="collection-1"',
        sort: '-created',
      });

      expect(store.spots).toEqual(spots);
      expect(store.isLoading).toBe(false);
    });
  });

  describe('addSpot', () => {
    it('fügt einen Spot hinzu', async () => {
      const spotPayload: AddSpotPayload = {
        name: 'Café Central',
        description: 'Gutes Frühstück',
      };

      const createdSpot: Spot = {
        id: 'spot-1',
        name: 'Café Central',
        description: 'Gutes Frühstück',
        collection: 'collection-1',
        user: 'user-1',
        created: '2026-06-22 10:00:00.000Z',
        updated: '2026-06-22 10:00:00.000Z',
      };

      mocks.create.mockResolvedValue(createdSpot);

      const store = useSpotStore();

      const result = await store.addSpot('collection-1', spotPayload);

      expect(mocks.create).toHaveBeenCalledWith({
        name: 'Café Central',
        description: 'Gutes Frühstück',
        collection: 'collection-1',
        user: 'user-1',
      });

      expect(store.spots).toEqual([createdSpot]);
      expect(store.allSpots).toEqual([createdSpot]);
      expect(result).toEqual(createdSpot);
    });
  });

  describe('removeSpot', () => {
    it('löscht einen Spot aus PocketBase und aus beiden Spot-Listen', async () => {
      const spotToRemove: Spot = {
        id: 'spot-1',
        name: 'Café Central',
        description: 'Gutes Frühstück',
        collection: 'collection-1',
        user: 'user-1',
        created: '2026-06-22 10:00:00.000Z',
        updated: '2026-06-22 10:00:00.000Z',
      };

      const remainingSpot: Spot = {
        id: 'spot-2',
        name: 'Stadtpark',
        description: 'Großer Park',
        collection: 'collection-1',
        user: 'user-1',
        created: '2026-06-21 10:00:00.000Z',
        updated: '2026-06-21 10:00:00.000Z',
      };

      mocks.delete.mockResolvedValue(undefined);

      const store = useSpotStore();

      store.spots = [spotToRemove, remainingSpot];
      store.allSpots = [spotToRemove, remainingSpot];

      await store.removeSpot('spot-1');

      expect(mocks.delete).toHaveBeenCalledWith('spot-1');

      expect(store.spots).toEqual([remainingSpot]);
      expect(store.allSpots).toEqual([remainingSpot]);
    });
  });

  describe('updateSpot', () => {
    it('aktualisiert einen Spot in beiden Listen', async () => {
      const existingSpot: Spot = {
        id: 'spot-1',
        name: 'Altes Café',
        description: 'Alte Beschreibung',
        collection: 'collection-1',
        user: 'user-1',
        created: '2026-06-22 10:00:00.000Z',
        updated: '2026-06-22 10:00:00.000Z',
      };

      const updatedSpotPayload: UpdateSpotPayload = {
        name: 'Neues Café',
        description: 'Neue Beschreibung',
        collection: 'collection-1',
      };

      const savedSpot: Spot = {
        ...existingSpot,
        ...updatedSpotPayload,
        updated: '2026-06-22 11:00:00.000Z',
      };

      mocks.update.mockResolvedValue(savedSpot);

      const store = useSpotStore();

      store.spots = [existingSpot];
      store.allSpots = [existingSpot];

      const result = await store.updateSpot('spot-1', updatedSpotPayload, 'collection-1');

      expect(mocks.update).toHaveBeenCalledWith(
        'spot-1',
        {
          name: 'Neues Café',
          description: 'Neue Beschreibung',
          collection: 'collection-1',
        },
        {
          expand: 'collection,user',
        }
      );

      expect(store.spots).toEqual([savedSpot]);
      expect(store.allSpots).toEqual([savedSpot]);
      expect(result).toEqual(savedSpot);
    });

    it('entfernt den Spot aus der aktuellen Liste, wenn er in eine andere Collection verschoben wurde', async () => {
      const existingSpot: Spot = {
        id: 'spot-1',
        name: 'Café Central',
        description: 'Gutes Frühstück',
        collection: 'collection-1',
        user: 'user-1',
        created: '2026-06-22 10:00:00.000Z',
        updated: '2026-06-22 10:00:00.000Z',
      };

      const updatedSpotPayload: UpdateSpotPayload = {
        name: 'Café Central',
        description: 'Gutes Frühstück',
        collection: 'collection-2',
      };

      const savedSpot: Spot = {
        ...existingSpot,
        collection: 'collection-2',
        updated: '2026-06-22 11:00:00.000Z',
      };

      mocks.update.mockResolvedValue(savedSpot);

      const store = useSpotStore();

      store.spots = [existingSpot];
      store.allSpots = [existingSpot];

      const result = await store.updateSpot('spot-1', updatedSpotPayload, 'collection-1');

      expect(mocks.update).toHaveBeenCalledWith(
        'spot-1',
        {
          name: 'Café Central',
          description: 'Gutes Frühstück',
          collection: 'collection-2',
        },
        {
          expand: 'collection,user',
        }
      );

      expect(store.spots).toEqual([]);
      expect(store.allSpots).toEqual([savedSpot]);
      expect(result).toEqual(savedSpot);
    });
  });
});
