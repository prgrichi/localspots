<template>
  <div
    class="grid w-full grid-cols-1 gap-3 mb-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_180px_auto] lg:items-center"
  >
    <n-select
      v-model:value="selectedCategoryModel"
      :options="categoryOptions"
      placeholder="Kategorie filtern"
      clearable
      class="w-full"
    />

    <n-input v-model:value="searchModel" placeholder="Suchen..." clearable class="w-full" />

    <n-select
      v-model:value="sortByModel"
      :options="sortOptions"
      placeholder="Sortieren"
      class="w-full"
    />

    <n-button
      secondary
      type="default"
      :disabled="!searchModel && !selectedCategoryModel"
      class="w-full lg:w-auto"
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
    selectedCategory: string;
    search: string;
    sortBy: string;
    categoryOptions: SelectOption[];
    sortOptions: SelectOption[];
  }>(),
  {
    selectedCategory: '',
    search: '',
    categoryOptions: () => [],
    sortOptions: () => [],
  }
);

const emit = defineEmits(['update:selectedCategory', 'update:search', 'update:sortBy', 'reset']);

const selectedCategoryModel = computed({
  get: () => props.selectedCategory,
  set: value => emit('update:selectedCategory', value ?? ''),
});

const searchModel = computed({
  get: () => props.search,
  set: value => emit('update:search', value ?? ''),
});

const sortByModel = computed({
  get: () => props.sortBy,
  set: value => {
    if (!value) return;
    emit('update:sortBy', value);
  },
});
</script>
