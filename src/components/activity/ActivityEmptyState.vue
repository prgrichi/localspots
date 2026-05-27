<!-- src/components/activity/ActivityEmptyState.vue -->
<template>
  <section
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
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';
import { RouterLink } from 'vue-router';
</script>
