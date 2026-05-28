<template>
  <main class="grid min-h-[70dvh] place-items-center px-4 pb-8 md:px-8">
    <section
      class="w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8"
    >
      <div
        class="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600"
      >
        Fehler 404
      </div>

      <h1 class="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        Diese Seite existiert nicht
      </h1>

      <p class="mt-3 text-sm leading-6 text-slate-600 md:text-base">
        Der Link ist möglicherweise veraltet oder die Seite wurde verschoben.
      </p>

      <p class="mt-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500 ring-1 ring-slate-100">
        Aufgerufen: <span class="font-mono">{{ route.fullPath }}</span>
      </p>

      <div class="mt-6 grid gap-3 md:grid-cols-2">
        <RouterLink to="/" class="no-underline">
          <n-button type="primary" secondary round block> Zur Startseite </n-button>
        </RouterLink>

        <n-button round block @click="goBack"> Zurück </n-button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

function goBack() {
  router.back();
}
</script>
