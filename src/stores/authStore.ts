import { defineStore } from 'pinia';
import { pb } from '@/services/pocketbase';
import type { RecordModel } from 'pocketbase';

let authChangeUnsubscribe: null | (() => void) = null;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as RecordModel | null,
    isAuthReady: false,
  }),

  getters: {
    isLoggedIn: state => !!state.user && pb.authStore.isValid,
  },

  actions: {
    setUserFromAuthStore() {
      this.user = (pb.authStore.record as RecordModel | null) ?? null;
    },

    initAuth() {
      if (authChangeUnsubscribe) {
        this.isAuthReady = true;
        return;
      }

      authChangeUnsubscribe = pb.authStore.onChange(() => {
        this.setUserFromAuthStore();
        this.isAuthReady = true;
      }, true);
    },

    async login(email: string, password: string) {
      await pb.collection('users').authWithPassword(email, password);
      this.setUserFromAuthStore();
    },

    logout() {
      pb.authStore.clear();
      this.setUserFromAuthStore();
    },
  },
});
