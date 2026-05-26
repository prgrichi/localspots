<template>
  <main class="mx-auto flex h-full w-full max-w-3xl items-center px-4 py-6 md:px-8">
    <section class="mx-auto flex h-full w-full max-w-sm flex-col py-2">
      <div class="text-center">
        <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-primary-50">
          <span class="block size-6 rounded-full bg-accent-600"></span>
        </div>

        <p class="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-400">LocalSpots</p>

        <h1 class="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Orte sammeln und teilen.
        </h1>

        <p class="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
          Speichere Spots, sortiere sie in Collections und teile sie mit Freunden.
        </p>
      </div>

      <div class="mt-[clamp(3rem,14vh,8rem)]">
        <div class="mb-4">
          <h2 class="text-base font-semibold text-slate-950">Einloggen</h2>
          <p class="mt-1 text-sm text-slate-500">Melde dich mit deinem Account an.</p>
        </div>

        <form @submit.prevent="submit">
          <n-space vertical size="medium">
            <n-form-item label="E-Mail">
              <n-input
                v-model:value="form.email"
                class="text-base"
                placeholder="dein@email.de"
                :input-props="{ autocomplete: 'email' }"
              >
                <template #prefix>
                  <n-icon size="18" class="text-slate-400">
                    <MailOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>

            <n-form-item label="Passwort">
              <n-input
                v-model:value="form.password"
                class="text-base"
                type="password"
                placeholder="Passwort"
                :input-props="{ autocomplete: 'current-password' }"
                show-password-on="click"
              >
                <template #prefix>
                  <n-icon size="18" class="text-slate-400">
                    <LockClosedOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>

            <n-button
              attr-type="submit"
              type="primary"
              secondary
              round
              block
              size="large"
              :loading="isSubmitting"
              :disabled="!canSubmit"
            >
              Einloggen
            </n-button>
          </n-space>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NFormItem, NInput, NButton, NSpace, NIcon, useMessage } from 'naive-ui';
import { LockClosedOutline, MailOutline } from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const message = useMessage();

const isSubmitting = ref(false);

const form = reactive({
  email: '',
  password: '',
});

const canSubmit = computed(() => {
  return form.email.trim().length > 0 && form.password.length > 0 && !isSubmitting.value;
});

async function submit() {
  if (!canSubmit.value) return;

  isSubmitting.value = true;

  try {
    await authStore.login(form.email.trim(), form.password);

    message.success('Eingeloggt');
    router.push('/');
  } catch {
    form.password = '';
    message.error('Login fehlgeschlagen');
  } finally {
    isSubmitting.value = false;
  }
}
</script>
