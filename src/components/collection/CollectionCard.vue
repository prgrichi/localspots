<!-- src/components/collection/CollectionCard.vue -->
<template>
  <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
    <div class="min-w-0">
      <h2 class="truncate font-semibold text-slate-950">
        {{ collection.name }}
      </h2>

      <p class="mt-0.5 text-sm text-slate-500">
        {{ collection.members?.length ?? 0 }}
        Mitglieder
      </p>
    </div>

    <div class="mt-3 flex gap-2">
      <n-button secondary round class="flex-1" @click="emit('primary', collection.id)">
        {{ primaryText }}
      </n-button>

      <span
        v-if="isOwner"
        class="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-slate-100 px-3 text-xs font-medium text-slate-500"
      >
        Deine Collection
      </span>

      <n-button
        v-else-if="isSubscribed"
        secondary
        round
        class="flex-1"
        :loading="isPending"
        :disabled="isDisabled"
        @click="emit('leave', collection.id)"
      >
        Verlassen
      </n-button>

      <n-button
        v-else-if="showJoin"
        type="primary"
        secondary
        round
        class="flex-1"
        :loading="isPending"
        :disabled="isDisabled"
        @click="emit('join', collection.id)"
      >
        Beitreten
      </n-button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';
import type { Collection } from '@/types/collection';

defineProps<{
  collection: Collection;
  primaryText: string;
  isOwner: boolean;
  isSubscribed: boolean;
  isPending: boolean;
  isDisabled: boolean;
  showJoin?: boolean;
}>();

const emit = defineEmits<{
  primary: [id: string];
  leave: [id: string];
  join: [id: string];
}>();
</script>
