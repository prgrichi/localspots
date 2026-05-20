<template>
  <main class="mx-auto max-w-3xl px-4 md:px-8">
    <form @submit.prevent="submit">
      <n-space vertical>
        <n-form-item label="E-Mail">
          <n-input class="text-base" v-model:value="form.email" placeholder="E-Mail" />
        </n-form-item>

        <n-form-item label="Passwort">
          <n-input
            class="text-base"
            v-model:value="form.password"
            type="password"
            placeholder="Passwort"
          />
        </n-form-item>

        <n-button attr-type="submit" type="primary" secondary round block> Einloggen </n-button>
      </n-space>
    </form>
  </main>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { NFormItem, NInput, NButton, NSpace, useMessage } from 'naive-ui';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const message = useMessage();

const form = reactive({
  email: '',
  password: '',
});

async function submit() {
  try {
    await authStore.login(form.email, form.password);

    message.success('Eingeloggt');
    router.push('/');
  } catch {
    form.password = '';
    message.error('Login fehlgeschlagen');
  }
}
</script>
