<template>
  <main class="mx-auto max-w-3xl px-4 pb-10 md:px-8">
    <div class="mb-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Aktivitäten</div>
      <h1 class="truncate text-2xl font-semibold text-slate-900">Neueste Spots</h1>
    </div>

    <section v-if="isLoading" class="py-10 text-sm text-slate-500">
      Aktivitäten werden geladen...
    </section>

    <section
      v-else-if="activities.length === 0"
      class="flex min-h-[calc(100vh-240px)] flex-col items-center justify-center px-4 py-12 text-center"
    >
      <div class="flex size-16 items-center justify-center rounded-full bg-primary-50">
        <span class="block size-6 rounded-full bg-accent-600"></span>
      </div>

      <h2 class="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
        Noch keine Aktivitäten gefunden
      </h2>

      <p class="mt-3 max-w-xs text-sm leading-6 text-slate-500">
        Sobald in deinen Collections neue Spots eingetragen werden, erscheinen sie hier.
      </p>

      <div class="mt-7 space-y-4">
        <RouterLink :to="{ name: 'add-entry' }" class="block no-underline">
          <n-button type="primary" secondary size="large" round> Spot eintragen </n-button>
        </RouterLink>

        <RouterLink :to="{ name: 'all-collections' }" class="block no-underline">
          <n-button type="primary" secondary size="large" round> Collections entdecken </n-button>
        </RouterLink>
      </div>
    </section>

    <section v-else class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
      <TransitionGroup name="activity-list" tag="div">
        <article
          v-for="activity in activities"
          :key="activity.id"
          class="border-b border-slate-100 p-4 last:border-b-0"
        >
          <div class="flex gap-3">
            <div class="pt-1.5">
              <span class="block size-2 rounded-full bg-accent-600"></span>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <h2 class="truncate font-semibold text-slate-950">
                  {{ activity.name }}
                </h2>

                <span class="shrink-0 text-xs text-slate-400">
                  {{ activity.createdLabel }}
                </span>
              </div>

              <p class="mt-1 truncate text-sm text-slate-500">
                Eingetragen von
                <span class="font-medium text-slate-700">
                  {{ activity.userLabel }}
                </span>
              </p>

              <p class="mt-0.5 truncate text-sm text-slate-500">
                in {{ activity.collectionLabel }}
              </p>

              <router-link
                :to="{ name: 'spot-detail', params: { id: activity.id } }"
                class="mt-3 block no-underline"
              >
                <n-button secondary round block> Spot ansehen </n-button>
              </router-link>
            </div>
          </div>
        </article>
      </TransitionGroup>
    </section>

    <div v-if="hasMore" class="mt-6">
      <n-button
        type="primary"
        secondary
        round
        block
        :disabled="isLoadingMore"
        @click="loadMoreActivities"
      >
        Mehr laden
      </n-button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { NButton } from 'naive-ui';
import { RouterLink } from 'vue-router';
import { pb } from '@/services/pocketbase';
import { useCollectionStore } from '@/stores/collectionStore';
import type { Spot } from '@/types/spot';
import type { SpotActivity } from '@/types/activity';

const collectionStore = useCollectionStore();

const spots = ref<Spot[]>([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const page = ref(1);
const perPage = 15;
const hasMore = ref(false);

const activities = computed<SpotActivity[]>(() =>
  spots.value.map(spot => {
    const userLabel = spot.expand?.user?.name || spot.expand?.user?.email || 'Unbekannter User';

    return {
      id: spot.id,
      name: spot.name,
      userLabel,
      collectionLabel: spot.expand?.collection?.name || 'Unbekannte Collection',
      createdLabel: formatDateTime(spot.created),
    };
  })
);

onMounted(async () => {
  await fetchActivities(true);
});

async function fetchActivities(reset = false) {
  if (reset) {
    page.value = 1;
    spots.value = [];
  }

  if (page.value === 1) {
    isLoading.value = true;
  } else {
    isLoadingMore.value = true;
  }

  try {
    if (!collectionStore.collections.length) {
      await collectionStore.fetchMyCollections();
    }

    const collectionIds = collectionStore.collections.map(collection => collection.id);

    if (collectionIds.length === 0) {
      spots.value = [];
      hasMore.value = false;
      return;
    }

    const collectionFilter = collectionIds.map(id => `collection = "${id}"`).join(' || ');

    const result = await pb.collection('spots').getList<Spot>(page.value, perPage, {
      filter: collectionFilter,
      sort: '-created',
      expand: 'user,collection',
    });

    spots.value = reset ? result.items : [...spots.value, ...result.items];

    hasMore.value = page.value < result.totalPages;
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
}

async function loadMoreActivities() {
  if (isLoading.value || isLoadingMore.value || !hasMore.value) return;

  page.value += 1;
  await fetchActivities();
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
</script>

<style scoped>
.activity-list-enter-active {
  transition:
    opacity 180ms ease-out,
    transform 180ms ease-out;
}

.activity-list-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.activity-list-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
