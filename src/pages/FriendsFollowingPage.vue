<template>
  <main class="mx-auto max-w-3xl px-4 md:px-8">
    <div class="mb-4">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Freunde</div>

      <div class="flex items-baseline justify-between gap-3">
        <h1 class="truncate text-2xl font-semibold text-slate-900">Freunde</h1>
      </div>
    </div>

    <div class="space-y-3">
      <h2 class="text-l font-semibold">Gefolgte Freunde:</h2>
      <div
        v-for="user in followingUsers"
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

      <p v-if="!isLoading && followingUsers.length === 0" class="text-sm text-slate-500">
        Du folgst noch niemandem.
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { pb } from '@/services/pocketbase';

type FollowingUser = {
  id: string;
  name?: string;
  email?: string;
};

type FollowRecord = {
  id: string;
  expand?: {
    following?: FollowingUser;
  };
};

const follows = ref<FollowRecord[]>([]);
const isLoading = ref(false);

const followingUsers = computed(() =>
  follows.value
    .map(follow => follow.expand?.following)
    .filter((user): user is FollowingUser => !!user)
);

async function fetchFollows() {
  isLoading.value = true;

  try {
    follows.value = await pb.collection('follows').getFullList<FollowRecord>({
      filter: `follower = "${pb.authStore.record?.id}"`,
      expand: 'following',
    });
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchFollows);
</script>
