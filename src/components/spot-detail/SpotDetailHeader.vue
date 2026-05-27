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
          </div>

          <n-button
            v-if="canEditSpot"
            quaternary
            size="medium"
            class="!h-auto !w-auto !p-0 !text-slate-400 hover:!bg-transparent hover:!text-slate-700 focus:!bg-transparent active:scale-95"
            aria-label="Spot bearbeiten"
            @click="$emit('edit')"
          >
            <template #icon>
              <n-icon size="18">
                <CreateOutline />
              </n-icon>
            </template>
          </n-button>
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

<script setup>
import { NButton, NIcon } from 'naive-ui';
import { CreateOutline } from '@vicons/ionicons5';

defineProps({
  spot: {
    type: Object,
    required: true,
  },
  hasLocation: {
    type: Boolean,
    default: false,
  },
  collectionName: {
    type: String,
    default: 'Nicht angegeben2',
  },
  canEditSpot: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['edit', 'delete']);

const formatDate = value => {
  if (!value) return 'Nicht angegeben';

  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};
</script>
