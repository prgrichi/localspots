<template>
  <div class="px-4 md:px-8">
    <div class="flex flex-col gap-4">
      <div class="mb-4">
        <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Spot</div>

        <div class="flex items-start justify-between gap-3">
          <h1 class="min-w-0 text-2xl font-semibold text-slate-900">
            {{ spot.name }}
          </h1>

          <n-button
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
      </div>

      <div class="rounded-2xl bg-slate-50 p-3">
        <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Collection</div>

        <div class="mt-1 truncate text-sm font-medium text-slate-900">
          {{ collectionName }}
        </div>
      </div>

      <div class="rounded-2xl bg-slate-50 p-3">
        <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Beschreibung</div>

        <p class="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">
          {{ spot.description || 'Keine Beschreibung hinterlegt' }}
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <div class="rounded-2xl bg-slate-50 p-3">
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Eingetragen
          </div>

          <div class="mt-1 text-sm text-slate-700">
            {{ formatDate(spot.created) }}
          </div>
        </div>

        <div class="rounded-2xl bg-slate-50 p-3">
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Aktualisiert
          </div>

          <div class="mt-1 text-sm text-slate-700">
            {{ formatDate(spot.updated) }}
          </div>
        </div>
      </div>
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
    default: 'Nicht angegeben',
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
