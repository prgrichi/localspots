<!-- src/components/NoCollectionsState.vue -->
<template>
  <section
    class="flex min-h-[calc(100vh-180px)] flex-col items-center justify-center px-4 py-12 text-center"
  >
    <div class="flex size-16 items-center justify-center rounded-full bg-primary-50">
      <span class="block size-6 rounded-full bg-accent-600"></span>
    </div>

    <h2 class="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
      Noch keine Collection vorhanden
    </h2>

    <p class="mt-3 max-w-xs text-sm leading-6 text-slate-500">
      Tritt einer bestehenden Collection bei oder erstelle deine eigene.
    </p>

    <div class="mt-7 space-y-4">
      <RouterLink :to="{ name: 'collections-all' }" class="block no-underline">
        <n-button type="primary" secondary size="large" round> Collections entdecken </n-button>
      </RouterLink>

      <n-button type="primary" secondary size="large" round @click="$emit('create')">
        Collection erstellen
      </n-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';

defineEmits<{
  create: [];
}>();
</script>
