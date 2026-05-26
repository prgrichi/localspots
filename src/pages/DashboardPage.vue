<template>
  <div class="mx-auto max-w-3xl px-4 pb-6 md:px-8">
    <div class="mb-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Dashboard</div>

      <div class="flex items-baseline justify-between gap-3">
        <h1 class="truncate text-2xl font-semibold text-slate-900">Übersicht</h1>
      </div>
    </div>

    <CollectionCreateDrawer v-model:show="showCollectionDrawer" @created="onCollectionCreated" />

    <div class="space-y-6">
      <!-- Wenn keine Collections existieren -->
      <NoCollectionsState
        v-if="!collectionStore.hasCollections"
        @create="showCollectionDrawer = true"
      />

      <!-- Wenn Collections existieren -->
      <div v-else class="space-y-6">
        <section>
          <h2 class="mt-1 text-xl font-bold text-slate-950">Willkommen zurück</h2>

          <p class="mt-2 text-sm text-slate-600">
            Du hast
            <span class="font-semibold text-slate-950">{{ totalSpots }}</span>
            {{ totalSpotsLabel }} eingetragen.
          </p>

          <router-link to="/add" class="mt-5 block no-underline">
            <n-button type="primary" secondary size="large" block round> Spot eintragen </n-button>
          </router-link>
        </section>

        <section class="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-950">Status</h2>
          </div>

          <div class="grid grid-cols-3 divide-x divide-slate-100">
            <div v-for="stat in dashboardStats" :key="stat.label" class="px-2 text-center">
              <div class="text-xl font-bold text-primary-700">
                {{ stat.value }}
              </div>

              <div class="mt-1 text-[11px] font-medium leading-tight text-slate-500">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-950">Eingetragene Spots</h2>
          </div>

          <div class="space-y-2">
            <div
              v-for="stat in activityStats"
              :key="stat.label"
              class="flex items-center justify-between rounded-2xl bg-accent-100/60 px-4 py-3"
            >
              <span class="text-sm font-medium text-slate-600">
                {{ stat.label }}
              </span>

              <span class="text-lg font-bold text-accent-700">
                {{ stat.value }}
              </span>
            </div>
          </div>
        </section>

        <section>
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-950">Spots</h2>
          </div>

          <div class="space-y-3">
            <article
              v-for="collection in collectionSummary"
              :key="collection.id"
              class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <div class="flex items-center justify-between gap-4">
                <div>
                  <h3 class="font-semibold text-slate-950">
                    {{ collection.name }}
                  </h3>

                  <p class="mt-0.5 text-sm text-slate-500">
                    {{ collection.countLabel }}
                  </p>
                </div>

                <div class="text-2xl font-bold text-slate-950">
                  {{ collection.count }}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section>
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-950">Zuletzt eingetragen</h2>
          </div>

          <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <router-link
              v-for="spot in recentSpots"
              :key="spot.id"
              :to="{ name: 'spot-detail', params: { id: spot.id } }"
              class="block border-b border-slate-100 no-underline last:border-b-0"
            >
              <article class="p-4 transition hover:bg-slate-50 active:bg-slate-100">
                <div class="flex items-center justify-between gap-4">
                  <div class="min-w-0">
                    <h3 class="truncate font-semibold text-slate-950">
                      {{ spot.title }}
                    </h3>

                    <p class="mt-0.5 truncate text-sm text-slate-500">
                      {{ spot.createdLabel }} · {{ spot.collectionName }}
                    </p>
                  </div>

                  <n-icon size="18" class="shrink-0 text-slate-400">
                    <ChevronForwardOutline />
                  </n-icon>
                </div>
              </article>
            </router-link>

            <div v-if="recentSpots.length === 0" class="p-4 text-sm text-slate-500">
              Noch keine Spots eingetragen.
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { NButton, NIcon } from 'naive-ui';
import { ChevronForwardOutline } from '@vicons/ionicons5';
import { useDashboardStats } from '@/composables/useDashboardStats';
import { useSpotStore } from '@/stores/spotStore';
import { useCollectionStore } from '@/stores/collectionStore';
import { useEnsureCollections } from '@/composables/useEnsureCollections';

import CollectionCreateDrawer from '@/components/collection/CollectionCreateDrawer.vue';
import NoCollectionsState from '@/components/collection/NoCollectionsState.vue';

const spotStore = useSpotStore();
const collectionStore = useCollectionStore();

const showCollectionDrawer = ref(false);

useEnsureCollections();

onMounted(async () => {
  await spotStore.fetchAllSpots();
});

const onCollectionCreated = () => {
  showCollectionDrawer.value = false;
};

const {
  totalSpots,
  totalSpotsLabel,
  dashboardStats,
  activityStats,
  collectionSummary,
  recentSpots,
} = useDashboardStats();
</script>
