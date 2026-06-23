// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';
import type { SpotActivity } from '@/types/activity';

const mocks = vi.hoisted(() => ({
  useSpotActivities: vi.fn(),
  fetchActivities: vi.fn(),
  loadMoreActivities: vi.fn(),
}));

const activity: SpotActivity = {
  id: 'activity-1',
  name: 'Café Central',
  userLabel: 'Max',
  collectionLabel: 'Lieblingsorte',
  createdLabel: 'vor 2 Minuten',
};

const mockComposable = ({
  activities = [],
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
}: {
  activities?: SpotActivity[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
} = {}) => {
  mocks.useSpotActivities.mockReturnValue({
    activities: ref<SpotActivity[]>(activities),
    isLoading: ref(isLoading),
    isLoadingMore: ref(isLoadingMore),
    hasMore: ref(hasMore),
    fetchActivities: mocks.fetchActivities,
    loadMoreActivities: mocks.loadMoreActivities,
  });
};

vi.mock('@/composables/useSpotActivities', () => ({
  useSpotActivities: mocks.useSpotActivities,
}));

import ActivitiesPage from '../ActivitiesPage.vue';

const mountPage = () =>
  mount(ActivitiesPage, {
    global: {
      stubs: {
        ActivityLoadingState: {
          template: '<div data-testid="loading-state" />',
        },
        ActivityEmptyState: {
          template: '<div data-testid="empty-state" />',
        },
        ActivityList: {
          props: ['activities'],
          template: '<div data-testid="activity-list" />',
        },
        NButton: {
          emits: ['click'],
          template: '<button @click="$emit(\'click\')"><slot /></button>',
        },
      },
    },
  });

describe('ActivitiesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.fetchActivities.mockResolvedValue(undefined);

    mockComposable();
  });

  it('lädt die Aktivitäten beim Mounten', async () => {
    mountPage();

    await flushPromises();

    expect(mocks.fetchActivities).toHaveBeenCalledWith(true);
  });

  it('zeigt den Ladezustand an', () => {
    mockComposable({
      isLoading: true,
    });

    const wrapper = mountPage();

    expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false);
  });

  it('zeigt den Empty State an, wenn keine Aktivitäten vorhanden sind', () => {
    const wrapper = mountPage();

    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="activity-list"]').exists()).toBe(false);
  });

  it('zeigt die Aktivitäten an', () => {
    mockComposable({
      activities: [activity],
    });

    const wrapper = mountPage();

    expect(wrapper.find('[data-testid="activity-list"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false);
  });

  it('lädt weitere Aktivitäten beim Klick auf Mehr laden', async () => {
    mockComposable({
      activities: [activity],
      hasMore: true,
    });

    const wrapper = mountPage();

    await wrapper.get('button').trigger('click');

    expect(mocks.loadMoreActivities).toHaveBeenCalledOnce();
  });
});
