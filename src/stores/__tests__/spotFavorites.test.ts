import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import type { SpotFavorite } from '@/types/spotFavorite';

const mocks = vi.hoisted(() => ({
  getFullList: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('@/services/pocketbase', () => ({
  pb: {
    collection: vi.fn(() => ({
      getFullList: mocks.getFullList,
      create: mocks.create,
      delete: mocks.delete,
    })),
  },
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: {
      id: 'user-1',
    },
  }),
}));

import { useSpotFavoritesStore } from '../spotFavorites';

describe('spotFavoritesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('fetchFavorites', () => {
    it('lädt Favoriten', async () => {
      const favorites: SpotFavorite[] = [
        {
          id: 'favorite-1',
          user: 'user-1',
          spot: 'spot-1',
          created: '2026-06-22 10:00:00.000Z',
          updated: '2026-06-22 10:00:00.000Z',
        },
        {
          id: 'favorite-2',
          user: 'user-1',
          spot: 'spot-2',
          created: '2026-06-21 10:00:00.000Z',
          updated: '2026-06-21 10:00:00.000Z',
        },
      ];

      mocks.getFullList.mockResolvedValue(favorites);

      const store = useSpotFavoritesStore();

      await store.fetchFavorites();

      expect(mocks.getFullList).toHaveBeenCalledWith({
        filter: 'user = "user-1"',
        sort: '-created',
        expand: 'spot,spot.collection',
      });

      expect(store.favorites).toHaveLength(2);
      expect(store.favoriteCount).toBe(2);
      expect(store.isFavorite('spot-1')).toBe(true);
      expect(store.isFavorite('spot-3')).toBe(false);
    });

    it('setzt einen Fehler, wenn Favoriten nicht geladen werden können', async () => {
      mocks.getFullList.mockRejectedValue(new Error('Request failed'));

      const store = useSpotFavoritesStore();

      const existingFavorite: SpotFavorite = {
        id: 'favorite-1',
        user: 'user-1',
        spot: 'spot-1',
        created: '2026-06-22 10:00:00.000Z',
        updated: '2026-06-22 10:00:00.000Z',
      };

      store.favorites = [existingFavorite];

      await store.fetchFavorites();

      expect(store.error).toBe('Favoriten konnten nicht geladen werden.');
      expect(store.favorites).toHaveLength(0);
      expect(store.isLoading).toBe(false);
    });
  });

  describe('addFavorite', () => {
    it('fügt einen Favoriten hinzu', async () => {
      const createdFavorite: SpotFavorite = {
        id: 'favorite-1',
        user: 'user-1',
        spot: 'spot-1',
        created: '2026-06-22 10:00:00.000Z',
        updated: '2026-06-22 10:00:00.000Z',
      };

      mocks.create.mockResolvedValue(createdFavorite);

      const store = useSpotFavoritesStore();

      const result = await store.addFavorite('spot-1');

      expect(mocks.create).toHaveBeenCalledWith(
        {
          user: 'user-1',
          spot: 'spot-1',
        },
        {
          expand: 'spot',
        }
      );

      expect(store.favorites).toHaveLength(1);
      expect(store.isFavorite('spot-1')).toBe(true);
      expect(store.favoriteCount).toBe(1);
      expect(result).toEqual(createdFavorite);
    });

    it('setzt einen Fehler, wenn ein Favorit nicht gespeichert werden kann', async () => {
      mocks.create.mockRejectedValue(new Error('Request failed'));

      const store = useSpotFavoritesStore();

      await expect(store.addFavorite('spot-1')).rejects.toThrow('Request failed');

      expect(store.error).toBe('Favorit konnte nicht gespeichert werden.');
      expect(store.favorites).toHaveLength(0);
    });

    it('fügt einen bereits vorhandenen Favoriten nicht erneut hinzu', async () => {
      const existingFavorite: SpotFavorite = {
        id: 'favorite-1',
        user: 'user-1',
        spot: 'spot-1',
        created: '2026-06-22 10:00:00.000Z',
        updated: '2026-06-22 10:00:00.000Z',
      };

      const store = useSpotFavoritesStore();

      store.favorites = [existingFavorite];

      const result = await store.addFavorite('spot-1');

      expect(mocks.create).not.toHaveBeenCalled();
      expect(store.favorites).toHaveLength(1);
      expect(result).toEqual(existingFavorite);
    });
  });

  describe('removeFavorite', () => {
    it('entfernt einen Favoriten', async () => {
      const store = useSpotFavoritesStore();

      const favorite: SpotFavorite = {
        id: 'favorite-1',
        user: 'user-1',
        spot: 'spot-1',
        created: '2026-06-22 10:00:00.000Z',
        updated: '2026-06-22 10:00:00.000Z',
      };

      store.favorites = [favorite];

      mocks.delete.mockResolvedValue(undefined);

      await store.removeFavorite('spot-1');

      expect(mocks.delete).toHaveBeenCalledWith('favorite-1');
      expect(store.favorites).toHaveLength(0);
      expect(store.isFavorite('spot-1')).toBe(false);
      expect(store.favoriteCount).toBe(0);
    });

    it('setzt einen Fehler, wenn ein Favorit nicht entfernt werden kann', async () => {
      const store = useSpotFavoritesStore();

      const favorite: SpotFavorite = {
        id: 'favorite-1',
        user: 'user-1',
        spot: 'spot-1',
        created: '2026-06-22 10:00:00.000Z',
        updated: '2026-06-22 10:00:00.000Z',
      };

      store.favorites = [favorite];

      mocks.delete.mockRejectedValue(new Error('Request failed'));

      await expect(store.removeFavorite('spot-1')).rejects.toThrow('Request failed');

      expect(mocks.delete).toHaveBeenCalledWith('favorite-1');
      expect(store.error).toBe('Favorit konnte nicht entfernt werden.');
      expect(store.favorites).toHaveLength(1);
      expect(store.isFavorite('spot-1')).toBe(true);
    });

    it('führt keinen Request aus, wenn kein Favorit vorhanden ist', async () => {
      const store = useSpotFavoritesStore();

      await store.removeFavorite('spot-1');

      expect(mocks.delete).not.toHaveBeenCalled();
      expect(store.favorites).toHaveLength(0);
    });
  });

  describe('resetFavorites', () => {
    it('setzt den Favoriten-Store zurück', () => {
      const store = useSpotFavoritesStore();

      const favorite: SpotFavorite = {
        id: 'favorite-1',
        user: 'user-1',
        spot: 'spot-1',
        created: '2026-06-22 10:00:00.000Z',
        updated: '2026-06-22 10:00:00.000Z',
      };

      store.favorites = [favorite];
      store.isLoading = true;
      store.error = 'Irgendein Fehler';

      store.resetFavorites();

      expect(store.favorites).toHaveLength(0);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
      expect(store.favoriteCount).toBe(0);
    });
  });
});
