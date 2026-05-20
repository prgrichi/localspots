<template>
  <div v-if="collectionStore.hasCollections" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Collection</div>

    <n-select
      :value="collectionStore.activeCollectionId"
      :options="collectionOptions"
      placeholder="Collection wählen"
      @update:value="selectCollection"
      class="mb-3"
    />

    <div class="mb-3">
      <n-button secondary block @click="toggleRenameCollectionForm">
        {{ showRenameCollectionForm ? 'Abbrechen' : 'Collection umbenennen' }}
      </n-button>
    </div>

    <div v-if="showRenameCollectionForm" class="mt-3 mb-3">
      <n-input
        v-model:value="renameCollectionName"
        placeholder="Neuer Name der Collection"
        @keyup.enter="renameCollection"
        class="mb-2"
      />

      <n-button
        type="primary"
        block
        :loading="isRenamingCollection"
        :disabled="isRenamingCollection || !renameCollectionName.trim()"
        @click="renameCollection"
      >
        Speichern
      </n-button>
    </div>

    <n-button secondary block @click="toggleCreateCollectionForm">
      {{ showCreateCollectionForm ? 'Abbrechen' : '+ Neue Collection' }}
    </n-button>

    <div v-if="showCreateCollectionForm" class="mt-3">
      <n-input
        v-model:value="newCollectionName"
        placeholder="Name der Collection"
        @keyup.enter="createCollection"
        class="mb-2"
      />

      <n-button
        type="primary"
        block
        :loading="isCreatingCollection"
        :disabled="isCreatingCollection || !newCollectionName.trim()"
        @click="createCollection"
      >
        Collection erstellen
      </n-button>
    </div>
  </div>

  <div v-else class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Collection</div>

    <div class="mb-3 text-sm text-slate-500">Noch keine Collection vorhanden.</div>

    <n-input
      v-model:value="newCollectionName"
      placeholder="Name der Collection"
      @keyup.enter="createCollection"
      class="mb-2"
    />

    <n-button
      type="primary"
      block
      :loading="isCreatingCollection"
      :disabled="isCreatingCollection || !newCollectionName.trim()"
      @click="createCollection"
    >
      Collection erstellen
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { NSelect, NInput, NButton, useMessage } from 'naive-ui';
import { useCollectionStore } from '@/stores/collectionStore';

const collectionStore = useCollectionStore();
const message = useMessage();

const newCollectionName = ref('');
const isCreatingCollection = ref(false);
const showCreateCollectionForm = ref(false);

const showRenameCollectionForm = ref(false);
const renameCollectionName = ref('');
const isRenamingCollection = ref(false);

const collectionOptions = computed(() => collectionStore.collectionOptions);

const createCollection = async () => {
  const name = newCollectionName.value.trim();

  if (!name) {
    message.error('Bitte gib einen Namen für die Collection ein');
    return;
  }

  isCreatingCollection.value = true;

  try {
    await collectionStore.createCollection(name);

    newCollectionName.value = '';
    showCreateCollectionForm.value = false;
    message.success('Collection erstellt');
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Collection konnte nicht erstellt werden';
    message.error(msg);
  } finally {
    isCreatingCollection.value = false;
  }
};

const cancelRenameCollection = () => {
  showRenameCollectionForm.value = false;
  renameCollectionName.value = '';
};

const renameCollection = async () => {
  const collectionId = collectionStore.activeCollectionId;
  const name = renameCollectionName.value.trim();

  if (!collectionId) {
    message.error('Keine Collection ausgewählt');
    return;
  }

  if (!name) {
    message.error('Bitte gib einen Namen für die Collection ein');
    return;
  }

  isRenamingCollection.value = true;

  try {
    await collectionStore.updateCollection(collectionId, name);

    showRenameCollectionForm.value = false;
    renameCollectionName.value = '';
    message.success('Collection umbenannt');
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Collection konnte nicht umbenannt werden';
    message.error(msg);
  } finally {
    isRenamingCollection.value = false;
  }
};

const selectCollection = (collectionId: string) => {
  collectionStore.setActiveCollection(collectionId);

  showCreateCollectionForm.value = false;
  showRenameCollectionForm.value = false;
  newCollectionName.value = '';
  renameCollectionName.value = '';
};

const toggleRenameCollectionForm = () => {
  if (showRenameCollectionForm.value) {
    cancelRenameCollection();
    return;
  }

  const activeCollection = collectionStore.activeCollection;

  if (!activeCollection) {
    message.error('Keine Collection ausgewählt');
    return;
  }

  showCreateCollectionForm.value = false;
  newCollectionName.value = '';

  renameCollectionName.value = activeCollection.name;
  showRenameCollectionForm.value = true;
};

const toggleCreateCollectionForm = () => {
  showCreateCollectionForm.value = !showCreateCollectionForm.value;

  if (showCreateCollectionForm.value) {
    showRenameCollectionForm.value = false;
    renameCollectionName.value = '';
  }
};
</script>
