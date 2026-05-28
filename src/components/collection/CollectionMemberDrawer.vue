<!-- src/components/collection/CollectionMemberDrawer.vue -->
<template>
  <n-drawer
    :show="show"
    placement="bottom"
    height="72vh"
    :style="{
      borderTopLeftRadius: '24px',
      borderTopRightRadius: '24px',
      overflow: 'hidden',
    }"
    @update:show="emit('update:show', $event)"
  >
    <n-drawer-content
      title="Mitglieder"
      closable
      :native-scrollbar="false"
      :body-content-style="{
        padding: '10px 20px 20px 20px',
      }"
    >
      <div class="space-y-4">
        <div>
          <p class="mt-1 text-sm text-slate-500">
            {{ members.length }}
            {{ members.length === 1 ? 'Mitglied' : 'Mitglieder' }}
          </p>
        </div>

        <div
          v-if="members.length"
          class="divide-y divide-slate-100 rounded-2xl bg-white ring-1 ring-slate-200"
        >
          <div v-for="member in members" :key="member.id" class="px-4 py-3">
            <p class="truncate text-sm font-medium text-slate-900">
              {{ member.name || member.email || 'Unbekanntes Mitglied' }}
            </p>

            <p class="mt-0.5 truncate text-xs text-slate-500">
              {{ member.email || member.id }}
            </p>
          </div>
        </div>

        <div
          v-else
          class="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 ring-1 ring-slate-100"
        >
          Keine Mitglieder gefunden.
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NDrawer, NDrawerContent } from 'naive-ui';
import type { Collection } from '@/types/collection';

const props = defineProps<{
  show: boolean;
  collection: Collection | null;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
}>();

const members = computed(() => props.collection?.expand?.members ?? []);
</script>
