<template>
  <n-drawer :show="show" placement="right" width="300" @update:show="emit('update:show', $event)">
    <n-drawer-content :body-content-style="{ padding: '16px 20px 24px 20px' }">
      <template #header>
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"
          >
            <n-icon size="22">
              <PinOutline />
            </n-icon>
          </div>

          <div class="leading-tight">
            <div class="font-semibold text-slate-900">LocalSpots</div>
          </div>
        </div>
      </template>

      <div class="flex min-h-full flex-col">
        <div class="space-y-5">
          <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
            <div class="text-xs font-medium uppercase tracking-wide text-slate-400">
              Angemeldet als
            </div>

            <div class="mt-1 truncate text-sm font-semibold text-slate-900">
              {{ userName }}
            </div>
          </div>

          <CollectionMenuSection />

          <nav class="space-y-2" aria-label="Menü">
            <RouterLink
              to="/friends-all"
              class="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3 no-underline ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.99]"
              @click="closeMenu"
            >
              <span
                class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"
              >
                <n-icon size="20">
                  <PeopleOutline />
                </n-icon>
              </span>

              <span class="min-w-0 flex-1 text-sm font-semibold text-slate-900"> Freunde </span>

              <n-icon
                size="18"
                class="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
              >
                <ChevronForwardOutline />
              </n-icon>
            </RouterLink>

            <RouterLink
              to="/collections"
              class="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3 no-underline ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.99]"
              @click="closeMenu"
            >
              <span
                class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"
              >
                <n-icon size="20">
                  <AlbumsOutline />
                </n-icon>
              </span>

              <span class="min-w-0 flex-1 text-sm font-semibold text-slate-900"> Collections </span>

              <n-icon
                size="18"
                class="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
              >
                <ChevronForwardOutline />
              </n-icon>
            </RouterLink>

            <RouterLink
              to="/favorites"
              class="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3 no-underline ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.99]"
              @click="closeMenu"
            >
              <span
                class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"
              >
                <n-icon size="20">
                  <HeartOutline />
                </n-icon>
              </span>

              <span class="min-w-0 flex-1 text-sm font-semibold text-slate-900"> Favoriten </span>

              <n-icon
                size="18"
                class="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
              >
                <ChevronForwardOutline />
              </n-icon>
            </RouterLink>
          </nav>
        </div>

        <div class="mt-auto pt-6">
          <button
            type="button"
            class="group flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.99]"
            @click="logoutFromMenu"
          >
            <span
              class="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500"
            >
              <n-icon size="20">
                <LogOutOutline />
              </n-icon>
            </span>

            <span class="min-w-0 flex-1 text-sm font-semibold text-slate-700"> Logout </span>

            <n-icon
              size="18"
              class="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
            >
              <ChevronForwardOutline />
            </n-icon>
          </button>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NIcon, NDrawer, NDrawerContent } from 'naive-ui';
import {
  AlbumsOutline,
  ChevronForwardOutline,
  LogOutOutline,
  HeartOutline,
  PeopleOutline,
  PinOutline,
} from '@vicons/ionicons5';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useSpotStore } from '@/stores/spotStore';
import { useCollectionStore } from '@/stores/collectionStore';
import CollectionMenuSection from '@/components/menu/CollectionMenuSection.vue';

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
}>();

const authStore = useAuthStore();
const spotStore = useSpotStore();
const collectionStore = useCollectionStore();

const router = useRouter();

const userName = computed(() => {
  const name = authStore.user?.name?.trim();

  return name || authStore.user?.email || 'User';
});

const closeMenu = () => {
  emit('update:show', false);
};

const logout = () => {
  authStore.logout();
  spotStore.clearSpots();
  collectionStore.clearCollections();
  router.push('/login');
};

const logoutFromMenu = () => {
  closeMenu();
  logout();
};
</script>
