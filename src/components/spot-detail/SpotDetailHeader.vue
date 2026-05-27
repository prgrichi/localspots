<template>
  <div class="px-4 md:px-8">
    <div class="flex flex-col gap-4">
      <header class="mb-2">
        <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Spot</div>

        <div class="mt-1 flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h1 class="min-w-0 text-2xl font-semibold text-slate-900">
              {{ spot.name }}
            </h1>

            <div class="mt-3 flex flex-wrap items-center gap-2">
              <div
                class="inline-flex max-w-full items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700"
              >
                <span class="text-primary-600/60">Collection</span>
                <span class="max-w-[14rem] truncate font-semibold text-primary-800">
                  {{ collectionName }}
                </span>
              </div>

              <div
                class="inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                :class="
                  spot.category ? 'bg-accent-100 text-accent-700' : 'bg-slate-100 text-slate-400'
                "
              >
                <span class="text-current/60">Kategorie</span>
                <span class="max-w-[12rem] truncate">
                  {{ spot.category || 'Keine Kategorie' }}
                </span>
              </div>
            </div>

            <div class="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <div
                class="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500"
              >
                {{ creatorInitials }}
              </div>

              <div class="min-w-0">
                Erstellt von
                <span class="font-medium text-slate-700">
                  {{ creatorName }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-1">
            <button
              type="button"
              class="flex size-11 items-center justify-center rounded-full text-accent-600 transition hover:bg-accent-100 active:scale-95"
              :aria-label="isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
              @click="emit('toggleFavorite')"
            >
              <n-icon
                :key="isFavorite ? 'favorite' : 'not-favorite'"
                size="20"
                :class="isFavorite ? 'animate-heart-pop' : ''"
              >
                <Heart v-if="isFavorite" />
                <HeartOutline v-else />
              </n-icon>
            </button>

            <button
              v-if="canEditSpot"
              type="button"
              class="flex size-11 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95"
              aria-label="Spot bearbeiten"
              @click="emit('edit')"
            >
              <n-icon size="20">
                <CreateOutline />
              </n-icon>
            </button>
          </div>
        </div>
      </header>

      <section class="rounded-3xl bg-slate-50 p-4">
        <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Beschreibung</div>

        <p class="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
          {{ spot.description || 'Keine Beschreibung hinterlegt' }}
        </p>
      </section>

      <section class="rounded-2xl bg-slate-50 px-4 py-3">
        <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Details</div>

        <div
          class="mt-1 flex flex-col gap-1 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3"
        >
          <span>
            Eingetragen:
            <span class="font-medium text-slate-700">
              {{ formatDate(spot.created) }}
            </span>
          </span>

          <span class="hidden text-slate-300 sm:inline">·</span>

          <span>
            Aktualisiert:
            <span class="font-medium text-slate-700">
              {{ formatDate(spot.updated) }}
            </span>
          </span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NIcon } from 'naive-ui';
import { CreateOutline, Heart, HeartOutline } from '@vicons/ionicons5';
import type { Spot } from '@/types/spot';

const props = withDefaults(
  defineProps<{
    spot: Spot;
    hasLocation?: boolean;
    collectionName?: string;
    canEditSpot?: boolean;
    creatorName?: string;
    isFavorite?: boolean;
  }>(),
  {
    hasLocation: false,
    collectionName: 'Nicht angegeben',
    canEditSpot: false,
    creatorName: 'Unbekannt',
    isFavorite: false,
  }
);

const emit = defineEmits<{
  edit: [];
  delete: [];
  toggleFavorite: [];
}>();

const creatorInitials = computed(() => {
  return props.creatorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();
});

const formatDate = (value?: string) => {
  if (!value) return 'Nicht angegeben';

  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};
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
