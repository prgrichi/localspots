<!-- src/components/activity/ActivityLoadingState.vue -->
<template>
  <section
    class="flex min-h-[calc(100vh-240px)] flex-col items-center justify-center px-4 py-12 text-center"
  >
    <div class="flex size-16 items-center justify-center rounded-full bg-primary-50">
      <span class="loading-dot block size-6 rounded-full bg-accent-600"></span>
    </div>

    <p class="mt-5 text-sm font-medium text-slate-500">Aktivitäten werden geladen</p>
  </section>
</template>

<style scoped>
.loading-dot {
  animation: loading-bounce 850ms ease-in-out infinite;
}

@keyframes loading-bounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-8px) scale(0.92);
  }
}
</style>
