<!-- src/components/collection/CollectionCreateDrawer.vue -->
<template>
  <n-drawer
    :show="show"
    placement="bottom"
    height="50vh"
    @update:show="emit('update:show', $event)"
  >
    <n-drawer-content
      title="Collection erstellen"
      closable
      :native-scrollbar="false"
      :body-content-style="{
        padding: '12px 24px 24px 24px',
      }"
    >
      <n-form :model="form" class="compact-form">
        <div class="flex flex-col gap-1">
          <n-form-item label="Collection">
            <n-input
              v-model:value="form.name"
              placeholder="Name der Collection"
              @keyup.enter="save"
            />
          </n-form-item>

          <div class="flex flex-col gap-2">
            <n-button
              type="primary"
              secondary
              round
              block
              :loading="isSaving"
              :disabled="isSaving || !form.name.trim()"
              @click="save"
            >
              Speichern
            </n-button>
          </div>
        </div>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onBeforeUnmount } from 'vue';
import { NButton, NForm, NFormItem, NInput, NDrawer, NDrawerContent, useMessage } from 'naive-ui';
import { useCollectionStore } from '@/stores/collectionStore';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  created: [collectionId: string];
}>();

const collectionStore = useCollectionStore();
const message = useMessage();

const isSaving = ref(false);

const form = reactive({
  name: '',
});

async function save() {
  const name = form.name.trim();

  if (!name || isSaving.value) return;

  isSaving.value = true;

  try {
    const createdCollection = await collectionStore.createCollection(name);

    message.success('Collection erstellt');

    emit('created', createdCollection.id);
    emit('update:show', false);

    form.name = '';
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Collection konnte nicht erstellt werden';
    message.error(msg);
  } finally {
    isSaving.value = false;
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
