<template>
  <main class="mx-auto max-w-3xl px-4 md:px-8">
    <div>
      <div class="mb-4">
        <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Neuer Spot</div>

        <div class="flex items-baseline justify-between gap-3">
          <h1 class="truncate text-2xl font-semibold text-slate-900">Spot eintragen</h1>
        </div>
      </div>

      <CollectionCreateDrawer v-model:show="showCollectionDrawer" @created="onCollectionCreated" />

      <!-- Wenn keine Collections existieren -->
      <section
        v-if="!collectionStore.hasCollections"
        class="flex min-h-[360px] flex-col items-center justify-center px-4 py-12 text-center"
      >
        <div class="flex size-14 items-center justify-center rounded-2xl bg-primary-50">
          <span class="block size-5 rounded-full bg-accent-600"></span>
        </div>

        <h2 class="mt-5 text-xl font-semibold text-slate-950">Collection erstellen</h2>

        <p class="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Bevor du einen Spot eintragen kannst, brauchst du mindestens eine Collection.
        </p>

        <div class="mt-6">
          <n-button
            type="primary"
            secondary
            size="large"
            round
            @click="showCollectionDrawer = true"
          >
            Collection erstellen
          </n-button>
        </div>
      </section>

      <!-- Wenn Collections existieren -->
      <form @submit.prevent="submit" v-else>
        <n-form :model="form" class="compact-form">
          <div class="flex flex-col">
            <n-form-item label="Name">
              <n-input v-model:value="form.name" placeholder="Name" />
            </n-form-item>

            <n-form-item label="Kategorie">
              <n-select
                v-model:value="form.category"
                :options="spotCategoryOptions"
                placeholder="Kategorie wählen"
                filterable
              />
            </n-form-item>

            <n-form-item label="Collection">
              <n-select
                :value="collectionStore.activeCollectionId"
                :options="collectionStore.collectionOptions"
                placeholder="Collection wählen"
                @update:value="collectionStore.setActiveCollection"
              />
            </n-form-item>

            <n-form-item label="Beschreibung">
              <n-input v-model:value="form.description" placeholder="Beschreibung" />
            </n-form-item>

            <div class="mt-3">
              <n-button
                type="primary"
                block
                secondary
                round
                :loading="isSaving"
                :disabled="isSaving"
                @click="submit"
              >
                Speichern
              </n-button>
            </div>
          </div>
        </n-form>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { NForm, NFormItem, NInput, NSelect, NButton, useMessage } from 'naive-ui';
import { useSpotStore } from '@/stores/spotStore';
import { useCollectionStore } from '@/stores/collectionStore';
import { useRouter } from 'vue-router';

import { spotCategoryOptions } from '@/data/spotCategories';

import CollectionCreateDrawer from '@/components/collection/CollectionCreateDrawer.vue';

const spotStore = useSpotStore();
const collectionStore = useCollectionStore();

const message = useMessage();
const router = useRouter();

const isSaving = ref(false);
const showCollectionDrawer = ref(false);

const form = reactive({
  name: '',
  category: '',
  description: '',
});

const resetForm = () => {
  form.name = '';
  form.category = '';
  form.description = '';
};

const onCollectionCreated = () => {
  showCollectionDrawer.value = false;
};

const submit = async () => {
  if (isSaving.value) return;

  if (!collectionStore.activeCollectionId) {
    message.error('Bitte wähle zuerst eine Collection aus');
    return;
  }

  isSaving.value = true;

  try {
    const createdSpot = await spotStore.addSpot(collectionStore.activeCollectionId, {
      name: form.name,
      category: form.category,
      description: form.description,
    });

    message.success('Spot gespeichert');

    await router.push({
      path: '/spots',
      query: { highlight: createdSpot.id },
    });

    resetForm();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Spot konnte nicht gespeichert werden';
    message.error(msg);
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.compact-form :deep(.n-form-item) {
  margin-bottom: 10px;
}

.compact-form :deep(.n-form-item-label) {
  padding-bottom: 0;
}

.compact-form :deep(.n-form-item-feedback-wrapper) {
  min-height: 0;
  height: 0;
  margin: 0;
  padding: 0;
}
</style>
