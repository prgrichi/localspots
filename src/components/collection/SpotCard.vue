<template>
  <RouterLink
    :to="{ name: 'spot-detail', params: { id: spot.id } }"
    class="block rounded-2xl border border-slate-200 bg-white p-4 no-underline shadow-sm transition hover:border-primary-600 hover:shadow-md"
    :class="highlighted ? '!border-primary-600 !bg-primary-50' : ''"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <h2 class="truncate text-base font-semibold text-slate-900">
            {{ spot.name || 'Unbenannter Spot' }}
          </h2>

          <span
            v-if="spot.category"
            class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
            :class="highlighted ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'"
          >
            {{ spot.category }}
          </span>
        </div>

        <p v-if="spot.description" class="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
          {{ spot.description }}
        </p>

        <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span v-if="spot.expand?.collection?.name">
            {{ spot.expand.collection.name }}
          </span>

          <span v-if="hasLocation" class="text-emerald-600"> Mit Standort </span>

          <span v-else> Ohne Standort </span>
        </div>
      </div>

      <div class="shrink-0 pt-1 text-xl leading-none text-slate-300">›</div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { Spot } from '@/types/spot';

const props = defineProps<{
  spot: Spot;
  highlighted?: boolean;
}>();

const hasLocation = computed(() => {
  const lat = props.spot.locationLat;
  const lng = props.spot.locationLng;

  return lat != null && lng != null && !(lat === 0 && lng === 0);
});
</script>
