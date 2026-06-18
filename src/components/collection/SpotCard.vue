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

      <button
        type="button"
        class="group -mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-full active:scale-95"
        :aria-label="isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
        @click.prevent.stop="emit('toggle-favorite', spot.id)"
      >
        <span
          class="flex size-9 items-center justify-center rounded-full transition"
          :class="
            isFavorite
              ? 'text-accent-600 group-hover:bg-accent-100 group-hover:text-accent-700'
              : 'text-slate-300 group-hover:bg-slate-100 group-hover:text-accent-600'
          "
        >
          <n-icon
            :key="isFavorite ? 'favorite' : 'not-favorite'"
            size="20"
            :class="isFavorite ? 'animate-heart-pop' : ''"
          >
            <Heart v-if="isFavorite" />
            <HeartOutline v-else />
          </n-icon>
        </span>
      </button>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { NIcon } from 'naive-ui';
import { Heart, HeartOutline } from '@vicons/ionicons5';
import type { Spot } from '@/types/spot';

const props = defineProps<{
  spot: Spot;
  highlighted?: boolean;
  isFavorite: boolean;
}>();

const emit = defineEmits<{
  'toggle-favorite': [id: string];
}>();

const hasLocation = computed(() => {
  const lat = props.spot.locationLat;
  const lng = props.spot.locationLng;

  return lat != null && lng != null && !(lat === 0 && lng === 0);
});
</script>

<style scoped>
@keyframes heart-pop {
  0% {
    transform: scale(0.85);
  }

  55% {
    transform: scale(1.22);
  }

  100% {
    transform: scale(1);
  }
}

.animate-heart-pop {
  animation: heart-pop 180ms ease-out;
}
</style>
