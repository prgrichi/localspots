<template>
  <div class="mt-4 px-4 md:px-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="text-sm font-semibold text-slate-900">
          {{ hasLocation ? 'Standort hinterlegt' : 'Kein Standort hinterlegt' }}
        </div>

        <p class="mt-1 text-sm leading-6 text-slate-500">
          {{
            hasLocation
              ? 'Der Standort diesen Spots ist gespeichert und wird auf der Karte angezeigt.'
              : 'Trage einen Standort ein, damit das Spot auf der Karte angezeigt werden kann.'
          }}
        </p>
      </div>

      <n-button type="primary" secondary round @click="$emit('edit-location')">
        {{ hasLocation ? 'Standort ändern' : 'Standort eintragen' }}
      </n-button>
    </div>
  </div>
</template>

<script setup>
import { NButton } from 'naive-ui';

defineProps({
  hasLocation: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['edit', 'delete', 'edit-location']);
</script>
