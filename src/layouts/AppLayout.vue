<template>
  <n-layout class="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
    <div v-if="!authStore.isAuthReady" class="grid h-dvh place-items-center overflow-hidden px-4">
      <div class="text-center">
        <div class="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-50">
          <span class="block size-7 rounded-full bg-accent-600"></span>
        </div>

        <p class="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-400">LocalSpots</p>

        <p class="mt-2 text-sm text-slate-500">App wird vorbereitet …</p>
      </div>
    </div>

    <template v-else>
      <n-layout-content :class="contentClass">
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
    </template>
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
const isLoginRoute = computed(() => route.name === 'login');

const contentClass = computed(() => {
  if (isMapActive.value) {
    return 'h-[calc(100dvh-var(--bottom-nav-height))] overflow-hidden pt-6';
  }

  if (isLoginRoute.value) {
    return 'h-dvh overflow-hidden';
  }

  return 'min-h-screen pt-6 pb-[calc(var(--bottom-nav-height)+1rem)]';
});

const mainClass = computed(() => (isMapActive.value || isLoginRoute.value ? 'h-full min-h-0' : ''));

watch(
  () => authStore.isLoggedIn,
  async isLoggedIn => {
    if (!isLoggedIn) {
      collectionStore.clearCollections();
      return;
    }
  },
  { immediate: true }
);

watch(
  () => route.fullPath,
  () => {
    showMenu.value = false;
  }
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
