<template>
  <main class="mx-auto max-w-3xl px-4 md:px-8">
    <div class="mb-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">User</div>
      <h1 class="truncate text-2xl font-semibold text-slate-900">User entdecken</h1>
    </div>

    <div class="space-y-3">
      <div
        v-for="user in availableUsers"
        :key="user.id"
        class="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      >
        <div>
          <div class="font-semibold text-slate-900">
            {{ user.name || user.email }}
          </div>

          <div class="text-sm text-slate-500">
            {{ user.email }}
          </div>
        </div>

        <n-button
          size="small"
          round
          :type="followStore.isFollowing(user.id) ? 'default' : 'primary'"
          :loading="followStore.loadingUserId === user.id"
          @click="followStore.toggleFollow(user.id)"
        >
          {{ followStore.isFollowing(user.id) ? 'Entfolgen' : 'Folgen' }}
        </n-button>
      </div>
    </div>

    <section class="mt-8">
      <h2 class="mb-3 text-lg font-semibold text-slate-900">Gefolgte Freunde</h2>

      <div class="space-y-3">
        <div
          v-for="user in followStore.followingUsers"
          :key="user.id"
          class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="font-semibold text-slate-900">
            {{ user.name || user.email }}
          </div>

          <div class="text-sm text-slate-500">
            {{ user.email }}
          </div>
        </div>

        <p
          v-if="!followStore.isLoading && followStore.followingUsers.length === 0"
          class="text-sm text-slate-500"
        >
          Du folgst noch niemandem.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { pb } from '@/services/pocketbase';
import { useFollowStore } from '@/stores/followStore';

const followStore = useFollowStore();

const users = ref([]);

const currentUserId = computed(() => pb.authStore.record?.id);

const availableUsers = computed(() => users.value.filter(user => user.id !== currentUserId.value));

async function fetchUsers() {
  users.value = await pb.collection('users').getFullList({
    sort: 'name',
  });
}

onMounted(async () => {
  await Promise.all([fetchUsers(), followStore.fetchFollows()]);
});
</script>
