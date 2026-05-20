<template>
  <div class="mb-4">
    <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Collection</div>

    <div class="flex items-baseline justify-between gap-3">
      <h1 class="truncate text-2xl font-semibold text-slate-900">
        {{ collectionName || 'Collection wählen' }}
      </h1>

      <span v-if="collectionName" class="shrink-0 text-sm text-slate-500">
        {{ spotCount }}
        {{ spotCount === 1 ? 'Spot' : 'Spots' }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  collectionName: {
    type: String,
    default: '',
  },
  spotCount: {
    type: Number,
    required: true,
  },
});
</script>
