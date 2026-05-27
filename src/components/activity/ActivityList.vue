<!-- src/components/activity/ActivityList.vue -->
<template>
  <section class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
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

            <p class="mt-0.5 truncate text-sm text-slate-500">in {{ activity.collectionLabel }}</p>

            <RouterLink
              :to="{ name: 'spot-detail', params: { id: activity.id } }"
              class="mt-3 block no-underline"
            >
              <n-button secondary round block> Spot ansehen </n-button>
            </RouterLink>
          </div>
        </div>
      </article>
    </TransitionGroup>
  </section>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';
import { RouterLink } from 'vue-router';
import type { SpotActivity } from '@/types/activity';

defineProps<{
  activities: SpotActivity[];
}>();
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
