<!-- src/components/spot-detail/SpotEditDrawer.vue -->
<template>
  <n-drawer
    :show="show"
    placement="bottom"
    height="90vh"
    @update:show="emit('update:show', $event)"
  >
    <n-drawer-content
      title="Spot bearbeiten"
      closable
      :native-scrollbar="false"
      :body-content-style="{
        padding: '12px 24px 24px 24px',
      }"
    >
      <n-form :model="form" class="compact-form">
        <div class="flex flex-col gap-1">
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
              v-model:value="form.collection"
              :options="collectionStore.collectionOptions"
              placeholder="Collection wählen"
              :disabled="!collectionStore.hasCollections"
            />
          </n-form-item>

          <n-form-item label="Beschreibung">
            <n-input
              v-model:value="form.description"
              type="textarea"
              placeholder="Beschreibung"
              :autosize="{
                minRows: 3,
                maxRows: 6,
              }"
            />
          </n-form-item>

          <div class="flex flex-col gap-2">
            <n-button type="primary" secondary round block @click="save"> Speichern </n-button>
            <div class="mt-5 border-t border-slate-100 pt-4">
              <p class="mb-3 text-center text-xs leading-5 text-slate-400">
                Der Spot kann nach dem Löschen nicht wiederhergestellt werden.
              </p>

              <n-button
                block
                quaternary
                round
                type="error"
                class="!text-red-600 hover:!bg-red-50"
                @click="emit('delete')"
              >
                Spot löschen
              </n-button>
            </div>
          </div>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { reactive, watch, onBeforeUnmount } from 'vue';
import {
  NSelect,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NDrawer,
  NDrawerContent,
  useMessage,
} from 'naive-ui';
import { useSpotStore } from '@/stores/spotStore';
import { useCollectionStore } from '@/stores/collectionStore';
import { spotCategoryOptions } from '@/data/spotCategories';

const props = defineProps(['show', 'spot']);

const emit = defineEmits(['update:show', 'saved', 'delete']);

const spotStore = useSpotStore();
const collectionStore = useCollectionStore();
const message = useMessage();

const form = reactive({
  name: '',
  category: '',
  collection: '',
  description: '',
});

watch(
  () => props.spot,
  spot => {
    if (!spot) return;

    form.name = spot.name;
    form.category = spot.category ?? '';
    form.collection = spot.collection;
    form.description = spot.description;
  },
  { immediate: true }
);

async function save() {
  if (!props.spot) return;

  if (!form.collection) {
    message.error('Bitte wähle eine Collection aus');
    return;
  }

  try {
    const updatedSpot = await spotStore.updateSpot(
      props.spot.id,
      {
        name: form.name,
        category: form.category,
        collection: form.collection,
        description: form.description,
      },
      collectionStore.activeCollectionId
    );

    message.success('Spot aktualisiert');
    emit('saved', updatedSpot);
    emit('update:show', false);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Spot konnte nicht aktualisiert werden';
    message.error(msg);
  }
}

const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

const unlockBodyScroll = () => {
  document.body.style.overflow = '';
};

watch(
  () => props.show,
  show => {
    if (show) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  unlockBodyScroll();
});
</script>

<style scoped>
.compact-form :deep(.n-form-item) {
  margin-bottom: 16px;
}

.compact-form :deep(.n-form-item-label) {
  padding-bottom: 3px;
}

.compact-form :deep(.n-form-item-feedback-wrapper) {
  min-height: 0;
  height: 0;
  margin: 0;
  padding: 0;
}
</style>
