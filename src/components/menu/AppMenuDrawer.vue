<template>
  <n-drawer :show="show" placement="right" width="300" @update:show="emit('update:show', $event)">
    <n-drawer-content>
      <template #header>
        <div class="flex items-center gap-3">
          <div
            class="h-10 w-10 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center"
          >
            <n-icon size="22">
              <PinOutline />
            </n-icon>
          </div>

          <div class="leading-tight">
            <div class="font-semibold text-slate-900">LocalSpots App</div>
          </div>
        </div>
      </template>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <div class="text-xs font-medium uppercase tracking-wide text-slate-400">
            Angemeldet als
          </div>

          <div class="text-sm font-semibold text-slate-900">
            {{ userName }}
          </div>
        </div>

        <CollectionMenuSection />

        <RouterLink
          to="/friendsAll"
          class="block w-full rounded-2xl bg-accent-600 px-4 py-2 text-center text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-accent-700"
        >
          Freunde
        </RouterLink>

        <RouterLink
          to="/collections-all"
          class="block w-full rounded-2xl bg-accent-600 px-4 py-2 text-center text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-accent-700"
        >
          Alle Collections
        </RouterLink>

        <button
          type="button"
          class="w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-600 flex items-center justify-between hover:bg-red-100 transition"
          @click="logoutFromMenu"
        >
          <span class="flex items-center gap-3 text-sm font-medium">
            <n-icon size="20">
              <LogOutOutline />
            </n-icon>

            Logout
          </span>

          <n-icon size="18" class="text-red-400">
            <ChevronForwardOutline />
          </n-icon>
        </button>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NIcon, NDrawer, NDrawerContent } from 'naive-ui';
import { PinOutline, LogOutOutline, ChevronForwardOutline } from '@vicons/ionicons5';
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
