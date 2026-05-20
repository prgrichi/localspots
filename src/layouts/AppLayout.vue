<template>
  <n-layout class="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
    <n-layout-content class="pt-6" :class="contentClass">
      <main class="mx-auto max-w-3xl" :class="mainClass">
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition || 'fade'" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </main>
    </n-layout-content>

    <AppBottomNav v-if="authStore.isLoggedIn" @open-menu="showMenu = true" />

    <AppMenuDrawer v-model:show="showMenu" />
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutContent } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useCollectionStore } from '@/stores/collectionStore';
import AppBottomNav from '@/components/navigation/AppBottomNav.vue';
import AppMenuDrawer from '@/components/menu/AppMenuDrawer.vue';

const authStore = useAuthStore();
const collectionStore = useCollectionStore();
const route = useRoute();

const showMenu = ref(false);

const isMapActive = computed(() => route.name === 'map');

const contentClass = computed(() =>
  isMapActive.value
    ? 'h-[calc(100dvh-var(--bottom-nav-height))] overflow-hidden'
    : 'min-h-screen pb-[calc(var(--bottom-nav-height)+1rem)]'
);

const mainClass = computed(() => (isMapActive.value ? 'h-full min-h-0' : ''));

watch(
  () => authStore.isLoggedIn,
  async isLoggedIn => {
    if (!isLoggedIn) {
      collectionStore.clearCollections();
      return;
    }

    if (!collectionStore.hasCollections && !collectionStore.isLoading) {
      await collectionStore.fetchCollections();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
:global(:root) {
  --bottom-nav-height: calc(4rem + env(safe-area-inset-bottom));
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 150ms ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
