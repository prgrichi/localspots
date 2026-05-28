<template>
  <main class="mx-auto max-w-3xl px-4 pb-10 md:px-8">
    <div class="mb-4 lg:hidden">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Aktivitäten</div>
      <h1 class="truncate text-2xl font-semibold text-slate-900">Neueste Spots</h1>
    </div>

    <div
      class="mb-6 hidden overflow-hidden rounded-3xl bg-gradient-to-r from-primary-50 via-white to-accent-100/60 p-5 ring-1 ring-slate-200 lg:block lg:p-6"
    >
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Willkommen zurück
      </div>
      <h1 class="mt-2 text-2xl font-semibold text-slate-900 lg:text-3xl">
        Deine Orte auf einen Blick
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-slate-600 lg:text-base">
        Behalte neue Spots, gemeinsame Collections und gespeicherte Favoriten im Blick — alles an
        einem Ort.
      </p>
    </div>

    <ActivityLoadingState v-if="isLoading" />

    <ActivityEmptyState v-else-if="activities.length === 0" />

    <ActivityList v-else :activities="activities" />

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
import { onMounted } from 'vue';
import { NButton } from 'naive-ui';
import ActivityEmptyState from '@/components/activity/ActivityEmptyState.vue';
import ActivityLoadingState from '@/components/activity/ActivityLoadingState.vue';
import ActivityList from '@/components/activity/ActivityList.vue';
import { useSpotActivities } from '@/composables/useSpotActivities';

const { activities, isLoading, isLoadingMore, hasMore, fetchActivities, loadMoreActivities } =
  useSpotActivities();

onMounted(async () => {
  await fetchActivities(true);
});
</script>
