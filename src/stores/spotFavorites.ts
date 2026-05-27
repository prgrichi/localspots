import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { pb } from '@/services/pocketbase';
import { useAuthStore } from '@/stores/authStore';
import type { CreateSpotFavoriteData, SpotFavorite } from '@/types/spotFavorite';

export const useSpotFavoritesStore = defineStore('spotFavorites', () => {
  const authStore = useAuthStore();

  const favorites = ref<SpotFavorite[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const favoriteSpotIds = computed(() => new Set(favorites.value.map(favorite => favorite.spot)));

  const favoriteCount = computed(() => favorites.value.length);

  function isFavorite(spotId: string) {
    return favoriteSpotIds.value.has(spotId);
  }

  function getFavoriteBySpotId(spotId: string) {
    return favorites.value.find(favorite => favorite.spot === spotId) ?? null;
  }

  async function fetchFavorites() {
    if (!authStore.user?.id) {
      favorites.value = [];
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      favorites.value = await pb.collection('spot_favorites').getFullList<SpotFavorite>({
        filter: `user = "${authStore.user.id}"`,
        sort: '-created',
        expand: 'spot,spot.collection',
      });
    } catch (err) {
      console.error(err);
      error.value = 'Favoriten konnten nicht geladen werden.';
      favorites.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function addFavorite(spotId: string) {
    if (!authStore.user?.id) {
      throw new Error('User is not authenticated.');
    }

    if (isFavorite(spotId)) {
      return getFavoriteBySpotId(spotId);
    }

    error.value = null;

    const data: CreateSpotFavoriteData = {
      user: authStore.user.id,
      spot: spotId,
    };

    try {
      const favorite = await pb.collection('spot_favorites').create<SpotFavorite>(data, {
        expand: 'spot',
      });

      favorites.value = [favorite, ...favorites.value];

      return favorite;
    } catch (err) {
      console.error(err);
      error.value = 'Favorit konnte nicht gespeichert werden.';
      throw err;
    }
  }

  async function removeFavorite(spotId: string) {
    const favorite = getFavoriteBySpotId(spotId);

    if (!favorite) return;

    error.value = null;

    try {
      await pb.collection('spot_favorites').delete(favorite.id);

      favorites.value = favorites.value.filter(item => item.id !== favorite.id);
    } catch (err) {
      console.error(err);
      error.value = 'Favorit konnte nicht entfernt werden.';
      throw err;
    }
  }

  async function toggleFavorite(spotId: string) {
    if (isFavorite(spotId)) {
      await removeFavorite(spotId);
      return false;
    }

    await addFavorite(spotId);
    return true;
  }

  function resetFavorites() {
    favorites.value = [];
    isLoading.value = false;
    error.value = null;
  }

  return {
    favorites,
    isLoading,
    error,

    favoriteSpotIds,
    favoriteCount,

    fetchFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoriteBySpotId,
    resetFavorites,
  };
});
