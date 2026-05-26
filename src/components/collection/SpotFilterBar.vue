<template>
  <div class="mb-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
    <n-select
      v-model:value="selectedCategoryModel"
      :options="categoryOptions"
      placeholder="Kategorie filtern"
      clearable
      class="w-full"
    />

    <n-input v-model:value="searchModel" placeholder="Spot suchen..." clearable class="w-full" />

    <n-button
      secondary
      type="default"
      :disabled="!searchModel && !selectedCategoryModel"
      class="w-full sm:w-auto"
      @click="$emit('reset')"
    >
      Reset
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NButton, NInput, NSelect } from 'naive-ui';

type SelectOption = {
  label: string;
  value: string;
};

const props = withDefaults(
  defineProps<{
    selectedCategory: string | null;
    search: string;
    categoryOptions: SelectOption[];
  }>(),
  {
    selectedCategory: null,
    search: '',
    categoryOptions: () => [],
  }
);

const emit = defineEmits<{
  'update:selectedCategory': [value: string | null];
  'update:search': [value: string];
  reset: [];
}>();

const selectedCategoryModel = computed({
  get: () => props.selectedCategory,
  set: value => emit('update:selectedCategory', value ?? null),
});

const searchModel = computed({
  get: () => props.search,
  set: value => emit('update:search', value ?? ''),
});
</script>
