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
        <div class="mx-auto w-full max-w-6xl px-4 md:px-8">
          <div v-if="showDesktopShell" class="mb-6 hidden lg:block">
            <div class="fixed inset-x-0 top-3 z-30">
              <div class="mx-auto w-full max-w-6xl px-4 md:px-8">
                <div class="rounded-2xl bg-white/85 px-4 py-3 shadow-sm ring-1 ring-slate-200 backdrop-blur">
                  <div class="flex items-center gap-4">
                    <RouterLink to="/" class="shrink-0 no-underline">
                      <div class="text-sm font-semibold uppercase tracking-wide text-slate-700">
                        LocalSpots
                      </div>
                    </RouterLink>

                    <nav class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <RouterLink
                        v-for="item in desktopNavItems"
                        :key="item.to"
                        :to="item.to"
                        class="rounded-xl px-3 py-2 text-sm font-medium no-underline transition"
                        :class="
                          route.path === item.to
                            ? 'bg-primary-50 text-primary-800'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        "
                      >
                        {{ item.label }}
                      </RouterLink>
                    </nav>

                    <button
                      type="button"
                      class="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                      @click="showMenu = true"
                    >
                      Konto
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="h-16"></div>
          </div>

          <main class="mx-auto max-w-3xl lg:max-w-4xl" :class="mainClass">
            <router-view v-slot="{ Component, route: currentRoute }">
              <transition :name="currentRoute.meta.transition || 'fade'" mode="out-in">
                <component :is="Component" :key="currentRoute.fullPath" />
              </transition>
            </router-view>
          </main>
        </div>
      </n-layout-content>

      <AppBottomNav v-if="authStore.isLoggedIn" class="lg:hidden" @open-menu="showMenu = true" />

      <AppMenuDrawer v-model:show="showMenu" />
    </template>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutContent } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
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
const showDesktopShell = computed(() => authStore.isLoggedIn && !isMapActive.value && !isLoginRoute.value);
const desktopNavItems = [
  { to: '/', label: 'Aktivitäten' },
  { to: '/spots', label: 'Spots' },
  { to: '/add', label: 'Eintragen' },
  { to: '/collections', label: 'Collections' },
  { to: '/friends-all', label: 'Freunde entdecken' },
  { to: '/favorites', label: 'Favoriten' },
];

const contentClass = computed(() => {
  if (isMapActive.value) {
    return 'h-[calc(100dvh-var(--bottom-nav-height))] overflow-hidden pt-6';
  }

  if (isLoginRoute.value) {
    return 'h-dvh overflow-hidden';
  }

  return 'min-h-screen pt-6 pb-[calc(var(--bottom-nav-height)+1rem)] lg:pb-8';
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
