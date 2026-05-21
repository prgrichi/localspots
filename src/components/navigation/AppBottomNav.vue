<template>
  <div
    class="fixed inset-x-0 bottom-0 z-[1000] border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)]"
  >
    <nav class="mx-auto grid h-16 max-w-3xl grid-cols-5 gap-1 px-2">
      <router-link to="/" class="no-underline">
        <button
          type="button"
          class="opacity-20 flex h-full w-full flex-col items-center justify-center rounded-2xl gap-0.5 text-xs font-medium transition"
          :class="navButtonClass(isDashboardActive)"
        >
          <n-icon size="20">
            <HomeOutline />
          </n-icon>
          <span>Dashboard</span>
        </button>
      </router-link>

      <router-link to="/spots" class="no-underline">
        <button
          type="button"
          class="flex h-full w-full flex-col items-center justify-center rounded-2xl gap-0.5 text-xs font-medium transition"
          :class="navButtonClass(isSpotsActive)"
        >
          <n-icon size="20">
            <ListOutline />
          </n-icon>
          <span>Spots</span>
        </button>
      </router-link>

      <router-link to="/add" class="relative -mt-2.5 flex flex-col items-center no-underline">
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-full bg-accent-600 text-white shadow-md shadow-accent-600/20 transition hover:bg-accent-700 active:scale-95"
          :class="isAddActive ? 'ring-4 ring-accent-100 shadow-accent-600/30' : ''"
        >
          <n-icon size="24">
            <AddOutline />
          </n-icon>
        </button>

        <span
          class="mt-1 text-[11px] font-semibold leading-none"
          :class="isAddActive ? 'text-accent-600' : 'text-slate-600'"
        >
          Eintragen
        </span>
      </router-link>

      <router-link to="/map" class="no-underline">
        <button
          type="button"
          class="flex h-full w-full flex-col items-center justify-center rounded-2xl gap-0.5 text-xs font-medium transition"
          :class="navButtonClass(isMapActive)"
        >
          <n-icon size="20">
            <MapOutline />
          </n-icon>
          <span>Karte</span>
        </button>
      </router-link>

      <button
        type="button"
        class="flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-2xl text-xs font-medium text-slate-500 transition hover:text-primary-700"
        @click="$emit('open-menu')"
      >
        <n-icon size="20">
          <MenuOutline />
        </n-icon>
        <span>Menü</span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { NIcon } from 'naive-ui';
import { AddOutline, HomeOutline, ListOutline, MenuOutline, MapOutline } from '@vicons/ionicons5';

defineEmits<{
  'open-menu': [];
}>();

const route = useRoute();

const isDashboardActive = computed(() => route.name === 'dashboard');
const isSpotsActive = computed(() => route.name === 'spots' || route.name === 'spot-detail');
const isAddActive = computed(() => route.name === 'add-entry');
const isMapActive = computed(() => route.name === 'map');

function navButtonClass(isActive: boolean) {
  return isActive ? 'text-primary-700 font-semibold' : 'text-slate-500 hover:text-primary-700';
}
</script>
