import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSpotActivities } from '../useSpotActivities';
import type { Spot } from '@/types/spot';

const mocks = vi.hoisted(() => ({
  getList: vi.fn(),
  fetchMyCollections: vi.fn(),
  collections: [{ id: 'collection-1' }],
}));

vi.mock('@/services/pocketbase', () => ({
  pb: {
    collection: vi.fn(() => ({
      getList: mocks.getList,
    })),
  },
}));

vi.mock('@/stores/collectionStore', () => ({
  useCollectionStore: () => ({
    collections: mocks.collections,
    fetchMyCollections: mocks.fetchMyCollections,
  }),
}));

const spot: Spot = {
  id: 'spot-1',
  name: 'Stadtpark',
  collection: 'collection-1',
  user: 'user-1',
  description: 'Großer Park',
  created: '2026-06-01 10:00:00',
  updated: '2026-06-01 10:00:00',
};

const secondSpot: Spot = {
  id: 'spot-2',
  name: 'Waldweg',
  collection: 'collection-1',
  user: 'user-1',
  description: 'Ruhiger Spazierweg',
  created: '2026-06-02 10:00:00',
  updated: '2026-06-02 10:00:00',
};

describe('useSpotActivities', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.getList.mockResolvedValue({
      items: [spot],
      totalPages: 1,
    });
  });

  it('lädt Spots und stellt sie als Activities bereit', async () => {
    const { fetchActivities, activities, isLoading, hasMore } = useSpotActivities();

    await fetchActivities();

    expect(activities.value).toHaveLength(1);
    expect(activities.value[0].name).toBe('Stadtpark');

    expect(isLoading.value).toBe(false);
    expect(hasMore.value).toBe(false);
  });

  it('lädt die nächste Seite und hängt die neuen Activities an', async () => {
    mocks.getList
      .mockResolvedValueOnce({
        items: [spot],
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        items: [secondSpot],
        totalPages: 2,
      });

    const { fetchActivities, loadMoreActivities, activities, hasMore } = useSpotActivities();

    await fetchActivities();

    expect(hasMore.value).toBe(true);
    expect(activities.value).toHaveLength(1);

    await loadMoreActivities();

    expect(mocks.getList).toHaveBeenLastCalledWith(2, 15, expect.any(Object));

    expect(activities.value).toHaveLength(2);
    expect(activities.value[0].name).toBe('Stadtpark');
    expect(activities.value[1].name).toBe('Waldweg');
    expect(hasMore.value).toBe(false);
  });

  it('lädt keine weitere Seite, wenn keine weiteren Activities vorhanden sind', async () => {
    const { loadMoreActivities, activities, hasMore } = useSpotActivities();

    expect(hasMore.value).toBe(false);

    await loadMoreActivities();

    expect(mocks.getList).not.toHaveBeenCalled();
    expect(activities.value).toHaveLength(0);
  });
});
