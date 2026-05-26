<!-- src/components/collection/CollectionCard.vue -->
<template>
  <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
    <div class="min-w-0">
      <div class="flex items-start justify-between gap-3">
        <h2 class="min-w-0 truncate font-semibold text-slate-950">
          {{ collection.name }}
        </h2>

        <span
          v-if="isOwner"
          class="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
        >
          Von dir erstellt
        </span>
      </div>

      <p class="mt-0.5 text-sm text-slate-500">
        {{ memberCount }}
        {{ memberCount === 1 ? 'Mitglied' : 'Mitglieder' }}
      </p>
    </div>

    <div class="mt-3 flex gap-2">
      <n-button secondary round class="flex-1" @click="emit('primary', collection.id)">
        {{ primaryText }}
      </n-button>

      <n-button
        v-if="!isOwner && isSubscribed"
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
        v-else-if="!isOwner && showJoin"
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
import { computed } from 'vue';
import { NButton } from 'naive-ui';
import type { Collection } from '@/types/collection';

const props = defineProps<{
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

const memberCount = computed(() => props.collection.members?.length ?? 0);
</script>
