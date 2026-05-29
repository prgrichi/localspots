<template>
  <main
    class="relative mx-auto flex min-h-dvh w-full max-w-3xl items-center overflow-x-hidden overflow-y-auto px-4 py-4 md:px-8 md:py-6"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -right-20 -top-24 z-0 h-[19rem] w-[22.5rem] rotate-[-18deg] rounded-[3rem] bg-accent-600/8"
    ></div>

    <div
      aria-hidden="true"
      class="pointer-events-none absolute -right-32 top-32 z-0 h-28 w-64 rotate-[-18deg] rounded-[2.5rem] bg-accent-700/12"
    ></div>

    <div
      aria-hidden="true"
      class="pointer-events-none absolute right-8 top-8 z-0 text-accent-600/18"
    >
      <LocationOutline class="size-6" />
    </div>

    <div
      aria-hidden="true"
      class="pointer-events-none absolute right-20 top-18 z-0 rotate-[-12deg] text-accent-600/14"
    >
      <LocationOutline class="size-5" />
    </div>

    <section class="relative z-10 mx-auto flex w-full max-w-sm flex-col py-1">
      <div class="text-center">
        <div class="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-50">
          <span class="block size-5 rounded-full bg-accent-600"></span>
        </div>

        <p class="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">LocalSpots</p>

        <h1 class="mt-1 text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
          Orte sammeln und teilen.
        </h1>

        <p class="mx-auto mt-1.5 max-w-xs text-sm leading-5 text-slate-500">
          Speichere Spots, sortiere sie in Collections und teile sie mit Freunden.
        </p>
      </div>

      <div class="mt-6 sm:mt-8">
        <div class="mb-3">
          <h2 class="text-base font-semibold text-slate-950">Einloggen</h2>
          <p class="mt-1 text-sm text-slate-500">Melde dich mit deinem Account an.</p>
        </div>

        <div class="mb-4 rounded-2xl bg-primary-50/70 p-3 ring-1 ring-primary-700/15">
          <div class="text-xs font-semibold uppercase tracking-wide text-primary-800">
            Demo-Login
          </div>
          <div class="mt-1.5 space-y-0.5 text-sm text-slate-700">
            <p><span class="font-medium text-slate-900">E-Mail:</span> clara.berger@example.com</p>
            <p><span class="font-medium text-slate-900">Passwort:</span> 12345678</p>
          </div>
          <button
            type="button"
            class="mt-2 inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-primary-700 transition hover:bg-primary-50"
            @click="useDemoLogin"
          >
            Login-Daten einfügen
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <form @submit.prevent="submit">
          <n-space vertical size="small">
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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NFormItem, NInput, NButton, NSpace, NIcon, useMessage } from 'naive-ui';
import { LockClosedOutline, MailOutline, LocationOutline } from '@vicons/ionicons5';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const message = useMessage();

const isSubmitting = ref(false);

const form = reactive({
  email: '',
  password: '',
});

function useDemoLogin() {
  form.email = 'clara.berger@example.com';
  form.password = '12345678';
}

async function submit() {
  if (isSubmitting.value) return;

  const email = form.email.trim();
  const password = form.password;

  if (!email && !password) {
    message.warning('Bitte gib deine E-Mail und dein Passwort ein.');
    return;
  }

  if (!email) {
    message.warning('Bitte gib deine E-Mail Adresse ein.');
    return;
  }

  if (!password) {
    message.warning('Bitte gib dein Passwort ein.');
    return;
  }

  isSubmitting.value = true;

  try {
    await authStore.login(email, password);

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
