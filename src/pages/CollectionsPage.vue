<template>
  <main class="mx-auto max-w-3xl px-4 pb-4 md:px-8">
    <CollectionCreateDrawer v-model:show="showCollectionDrawer" @created="onCollectionCreated" />

    <section class="space-y-6">
      <div>
        <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">Collections</div>

        <h1 class="mt-1 truncate text-2xl font-semibold tracking-tight text-slate-950">
          Collections verwalten
        </h1>

        <p class="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Erstelle eigene Collections, verwalte deine bestehenden oder entdecke neue.
        </p>
      </div>

      <div class="space-y-3">
        <RouterLink
          :to="{ name: 'my-collections' }"
          class="group flex items-center gap-4 rounded-2xl bg-white p-4 no-underline ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.99]"
        >
          <div class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50">
            <n-icon size="22" class="text-primary-700">
              <AlbumsOutline />
            </n-icon>
          </div>

          <div class="min-w-0 flex-1">
            <p class="font-semibold text-slate-950">Meine Collections</p>
            <p class="mt-1 text-sm leading-6 text-slate-500">
              Verwalte Collections, in denen du Mitglied bist.
            </p>
          </div>

          <span
            class="shrink-0 text-lg text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
            aria-hidden="true"
          >
            →
          </span>
        </RouterLink>

        <RouterLink
          :to="{ name: 'all-collections' }"
          class="group flex items-center gap-4 rounded-2xl bg-white p-4 no-underline ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.99]"
        >
          <div class="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-50">
            <n-icon size="22" class="text-primary-700">
              <CompassOutline />
            </n-icon>
          </div>

          <div class="min-w-0 flex-1">
            <p class="font-semibold text-slate-950">Collections entdecken</p>
            <p class="mt-1 text-sm leading-6 text-slate-500">
              Finde öffentliche Collections und tritt ihnen bei.
            </p>
          </div>

          <span
            class="shrink-0 text-lg text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
            aria-hidden="true"
          >
            →
          </span>
        </RouterLink>

        <button
          type="button"
          class="group flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.99]"
          @click="showCollectionDrawer = true"
        >
          <div class="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-100">
            <n-icon size="22" class="text-accent-700">
              <AddOutline />
            </n-icon>
          </div>

          <div class="min-w-0 flex-1">
            <p class="font-semibold text-slate-950">Collection erstellen</p>
            <p class="mt-1 text-sm leading-6 text-slate-500">
              Starte eine eigene Collection und sammle dort deine Spots.
            </p>
          </div>

          <span
            class="shrink-0 text-lg text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
            aria-hidden="true"
          >
            →
          </span>
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NIcon } from 'naive-ui';
import { RouterLink, useRouter } from 'vue-router';
import { AddOutline, AlbumsOutline, CompassOutline } from '@vicons/ionicons5';
import CollectionCreateDrawer from '@/components/collection/CollectionCreateDrawer.vue';

const router = useRouter();

const showCollectionDrawer = ref(false);

const onCollectionCreated = async () => {
  showCollectionDrawer.value = false;
  await router.push({ name: 'my-collections' });
};
</script>
