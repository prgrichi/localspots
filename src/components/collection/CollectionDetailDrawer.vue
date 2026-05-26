<!-- src/components/collections/CollectionDetailDrawer.vue -->
<template>
  <n-drawer
    :show="show"
    placement="bottom"
    height="90vh"
    @update:show="emit('update:show', $event)"
  >
    <n-drawer-content
      :title="collectionName"
      closable
      :native-scrollbar="false"
      :body-content-style="{
        padding: '12px 20px 24px 20px',
      }"
    >
      <div class="space-y-5">
        <!-- Rolle -->
        <div>
          <span
            class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {{ roleLabel }}
          </span>
        </div>

        <!-- Mitglieder -->
        <section class="space-y-2">
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
        </section>

        <!-- Aktionen -->
        <section class="space-y-2">
          <h3 class="text-sm font-semibold text-slate-950">Aktionen</h3>

          <div class="flex flex-col gap-3">
            <n-button
              v-if="isOwner && !isRenaming"
              secondary
              class="w-full"
              round
              :disabled="isPending"
              @click="startRename"
            >
              Namen ändern
            </n-button>

            <div
              v-if="isOwner && isRenaming"
              class="space-y-2 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100"
            >
              <n-input
                v-model:value="draftName"
                placeholder="Collection-Name"
                :disabled="isPending"
                @keyup.enter="submitRename"
                @keyup.esc="cancelRename"
              />

              <div class="flex gap-2">
                <n-button
                  secondary
                  round
                  class="flex-1"
                  :disabled="isPending"
                  @click="cancelRename"
                >
                  Abbrechen
                </n-button>

                <n-button
                  type="primary"
                  secondary
                  round
                  class="flex-1"
                  :loading="isPending"
                  :disabled="!canSubmitRename || isPending"
                  @click="submitRename"
                >
                  Speichern
                </n-button>
              </div>
            </div>

            <n-button
              v-if="isOwner"
              type="error"
              secondary
              class="w-full"
              round
              :loading="isPending"
              :disabled="isPending"
              @click="emitDelete"
            >
              Collection löschen
            </n-button>

            <n-button
              v-else-if="isSubscribed"
              type="error"
              secondary
              class="w-full"
              round
              :loading="isPending"
              :disabled="isPending"
              @click="emitLeave"
            >
              Collection verlassen
            </n-button>
          </div>
        </section>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { NButton, NDrawer, NDrawerContent, NInput } from 'naive-ui';
import type { Collection } from '@/types/collection';

const props = defineProps<{
  show: boolean;
  collection: Collection | null;
  isOwner: boolean;
  isSubscribed: boolean;
  isPending?: boolean;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  rename: [id: string, name: string];
  leave: [id: string];
  delete: [id: string];
}>();

const collectionName = computed(() => props.collection?.name ?? 'Collection');

const roleLabel = computed(() => {
  if (props.isOwner) return 'Owner';
  if (props.isSubscribed) return 'Mitglied';
  return 'Nicht beigetreten';
});

const members = computed(() => props.collection?.expand?.members ?? []);

function emitLeave() {
  if (!props.collection) return;

  emit('leave', props.collection.id);
}

function emitDelete() {
  if (!props.collection) return;

  emit('delete', props.collection.id);
}

const isRenaming = ref(false);
const draftName = ref('');

const canSubmitRename = computed(() => {
  const name = draftName.value.trim();

  return !!name && name !== props.collection?.name;
});

const startRename = () => {
  draftName.value = props.collection?.name ?? '';
  isRenaming.value = true;
};

const cancelRename = () => {
  isRenaming.value = false;
  draftName.value = props.collection?.name ?? '';
};

const submitRename = () => {
  if (!props.collection) return;

  const name = draftName.value.trim();

  if (!name || name === props.collection.name) return;

  emit('rename', props.collection.id, name);
};

watch(
  () => props.show,
  show => {
    if (!show) {
      isRenaming.value = false;
      draftName.value = '';
    }
  }
);

watch(
  () => props.collection?.id,
  () => {
    isRenaming.value = false;
    draftName.value = props.collection?.name ?? '';
  }
);
</script>
