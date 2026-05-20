import { computed } from 'vue';
import { useCollectionStore } from '@/stores/collectionStore';
import { useSpotStore } from '@/stores/spotStore';
import {
  formatRelativeDateLabel,
  parsePocketBaseDate,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from '@/utils/date';
import type { Spot } from '@/types/spot';

export function useDashboardStats() {
  const collectionStore = useCollectionStore();
  const spotStore = useSpotStore();

  const totalSpots = computed(() => spotStore.allSpots.length);

  const totalSpotsLabel = computed(() => {
    return totalSpots.value === 1 ? 'Spot' : 'Spots';
  });

  const totalCollections = computed(() => collectionStore.collections.length);

  const totalCollectionsLabel = computed(() => {
    return totalCollections.value === 1 ? 'Collection' : 'Collections';
  });

  const spotsWithLocation = computed(() => {
    return spotStore.allSpots.filter(hasLocation).length;
  });

  const spotsWithoutLocation = computed(() => {
    return spotStore.allSpots.length - spotsWithLocation.value;
  });

  const dashboardStats = computed(() => [
    {
      label: totalCollectionsLabel.value,
      value: totalCollections.value,
    },
    {
      label: 'Spots mit Standort',
      value: spotsWithLocation.value,
    },
    {
      label: 'Spots ohne Standort',
      value: spotsWithoutLocation.value,
    },
  ]);

  const activityStats = computed(() => [
    {
      label: 'Heute',
      value: countSpotsSince(spotStore.allSpots, startOfToday()),
    },
    {
      label: 'Diese Woche',
      value: countSpotsSince(spotStore.allSpots, startOfWeek()),
    },
    {
      label: 'Dieser Monat',
      value: countSpotsSince(spotStore.allSpots, startOfMonth()),
    },
  ]);

  const collectionSummary = computed(() => {
    return collectionStore.collections
      .map(collection => {
        const count = spotStore.allSpots.filter(spot => spot.collection === collection.id).length;

        return {
          id: collection.id,
          name: collection.name,
          count,
          countLabel: count === 1 ? '1 Spot eingetragen' : `${count} Spots eingetragen`,
        };
      })
      .sort((a, b) => b.count - a.count);
  });

  const recentSpots = computed(() => {
    return spotStore.allSpots.slice(0, 3).map(spot => ({
      id: spot.id,
      title: spot.name,
      collectionName: spot.expand?.collection?.name ?? 'Ohne Collection',
      createdLabel: formatRelativeDateLabel(spot.created),
    }));
  });

  return {
    totalSpots,
    totalSpotsLabel,
    dashboardStats,
    activityStats,
    collectionSummary,
    recentSpots,
  };
}

function countSpotsSince(spots: Spot[], date: Date) {
  return spots.filter(spot => parsePocketBaseDate(spot.created) >= date).length;
}

function hasLocation(spot: Spot) {
  const lat = spot.locationLat;
  const lng = spot.locationLng;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return false;
  }

  if (lat === 0 && lng === 0) {
    return false;
  }

  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// function getSpotTitle(spot: Pick<Spot, 'category'>) {
//   return [spot.category].filter(Boolean).join(' ') || 'Unbenannter Spot';
// }
