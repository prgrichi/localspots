// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import type { Spot } from '@/types/spot';

const mocks = vi.hoisted(() => ({
  fetchSpots: vi.fn(),
  clearSpots: vi.fn(),
  fetchFavorites: vi.fn(),
  toggleFavorite: vi.fn(),
  isFavorite: vi.fn(),

  messageError: vi.fn(),

  filteredSpots: [] as Spot[],

  collectionStore: {
    activeCollectionId: 'collection-1' as string | null,
    activeCollection: {
      id: 'collection-1',
      name: 'Lieblingsorte',
    },
    hasCollections: true,
  },
}));

vi.mock('@/stores/spotStore', () => ({
  useSpotStore: () => ({
    spots: [],
    fetchSpots: mocks.fetchSpots,
    clearSpots: mocks.clearSpots,
  }),
}));

vi.mock('@/stores/spotFavorites', () => ({
  useSpotFavoritesStore: () => ({
    fetchFavorites: mocks.fetchFavorites,
    toggleFavorite: mocks.toggleFavorite,
    isFavorite: mocks.isFavorite,
  }),
}));

vi.mock('@/stores/collectionStore', () => ({
  useCollectionStore: () => mocks.collectionStore,
}));

vi.mock('@/composables/useEnsureCollections', () => ({
  useEnsureCollections: vi.fn(),
}));

vi.mock('@/composables/useSpotFilters', async () => {
  const { ref } = await import('vue');

  return {
    useSpotFilters: () => ({
      search: ref(''),
      selectedCategory: ref<string | null>(null),
      categoryOptions: [],
      filteredSpots: ref(mocks.filteredSpots),
      resetFilters: vi.fn(),
    }),
  };
});

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {},
  }),
}));

vi.mock('naive-ui', () => ({
  useMessage: () => ({
    error: mocks.messageError,
  }),
  NEmpty: {
    props: ['description'],
    template: '<div>{{ description }}<slot /><slot name="extra" /></div>',
  },
  NButton: {
    template: '<button><slot /></button>',
  },
  NSpace: {
    template: '<div><slot /></div>',
  },
}));

import SpotPage from '../SpotPage.vue';

const mountPage = () =>
  mount(SpotPage, {
    global: {
      stubs: {
        SpotCard: {
          name: 'SpotCard',
          props: ['spot', 'isFavorite', 'highlighted'],
          template: '<div data-testid="spot-card" />',
        },
        SpotFilterBar: true,
        CollectionCreateDrawer: true,
        NoCollectionsState: true,
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  });

describe('SpotPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.collectionStore.activeCollectionId = 'collection-1';
    mocks.collectionStore.activeCollection = {
      id: 'collection-1',
      name: 'Lieblingsorte',
    };
    mocks.collectionStore.hasCollections = true;
    mocks.filteredSpots.splice(0);
    mocks.fetchSpots.mockResolvedValue(undefined);
    mocks.fetchFavorites.mockResolvedValue(undefined);
  });

  it('lädt Spots und Favoriten für die aktive Collection', async () => {
    mountPage();

    await flushPromises();

    expect(mocks.fetchSpots).toHaveBeenCalledWith('collection-1');
    expect(mocks.fetchFavorites).toHaveBeenCalledOnce();
  });

  it('leert die Spots, wenn keine aktive Collection vorhanden ist', async () => {
    mocks.collectionStore.activeCollectionId = null;

    mountPage();

    await flushPromises();

    expect(mocks.clearSpots).toHaveBeenCalledOnce();
    expect(mocks.fetchSpots).not.toHaveBeenCalled();
    expect(mocks.fetchFavorites).not.toHaveBeenCalled();
  });

  it('zeigt eine Fehlermeldung, wenn Spots nicht geladen werden können', async () => {
    mocks.fetchSpots.mockRejectedValue(new Error('Fetch fehlgeschlagen'));

    mountPage();

    await flushPromises();

    expect(mocks.messageError).toHaveBeenCalledWith('Spots konnten nicht geladen werden');
  });

  it('zeigt den Empty State, wenn keine Spots vorhanden sind', () => {
    const wrapper = mountPage();

    expect(wrapper.text()).toContain('Noch keine Spots in dieser Collection');
  });

  it('rendert für jeden Spot eine SpotCard', () => {
    mocks.filteredSpots.push(
      {
        id: 'spot-1',
        name: 'Café Central',
        collection: 'collection-1',
        user: 'user-1',
        description: 'Schönes Café',
        created: '2026-06-23',
        updated: '2026-06-23',
      },
      {
        id: 'spot-2',
        name: 'Stadtpark',
        collection: 'collection-1',
        user: 'user-1',
        description: 'Ruhiger Ort',
        created: '2026-06-23',
        updated: '2026-06-23',
      }
    );

    const wrapper = mountPage();

    expect(wrapper.findAll('[data-testid="spot-card"]')).toHaveLength(2);
  });
});
