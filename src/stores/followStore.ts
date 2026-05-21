// src/stores/followStore.ts
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { pb } from '@/services/pocketbase';
import type { FollowRecord } from '@/types/follow';

export const useFollowStore = defineStore('follows', () => {
  const follows = ref<FollowRecord[]>([]);
  const isLoading = ref(false);
  const loadingUserId = ref<string | null>(null);

  const currentUserId = computed(() => pb.authStore.record?.id ?? '');

  const followedUserIds = computed(() => follows.value.map(follow => follow.following));

  const followingUsers = computed(() =>
    follows.value.map(follow => follow.expand?.following).filter(Boolean)
  );

  function isFollowing(userId: string) {
    return followedUserIds.value.includes(userId);
  }

  async function fetchFollows() {
    isLoading.value = true;

    try {
      follows.value = await pb.collection('follows').getFullList<FollowRecord>({
        filter: `follower = "${currentUserId.value}"`,
        expand: 'following',
      });
    } finally {
      isLoading.value = false;
    }
  }

  async function follow(userId: string) {
    const follow = await pb.collection('follows').create<FollowRecord>({
      follower: currentUserId.value,
      following: userId,
    });

    const createdFollow = await pb.collection('follows').getOne<FollowRecord>(follow.id, {
      expand: 'following',
    });

    follows.value.push(createdFollow);
  }

  async function unfollow(userId: string) {
    const follow = follows.value.find(follow => follow.following === userId);

    if (!follow) return;

    await pb.collection('follows').delete(follow.id);

    follows.value = follows.value.filter(item => item.id !== follow.id);
  }

  async function toggleFollow(userId: string) {
    loadingUserId.value = userId;

    try {
      if (isFollowing(userId)) {
        await unfollow(userId);
      } else {
        await follow(userId);
      }
    } finally {
      loadingUserId.value = null;
    }
  }

  return {
    follows,
    isLoading,
    loadingUserId,
    followedUserIds,
    followingUsers,
    isFollowing,
    fetchFollows,
    follow,
    unfollow,
    toggleFollow,
  };
});
