<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <AppLayout />
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { NConfigProvider, NMessageProvider, type GlobalThemeOverrides } from 'naive-ui';

import { NDialogProvider, NNotificationProvider } from 'naive-ui';

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#00462B',
    primaryColorHover: '#005C39',
    primaryColorPressed: '#003A24',
    primaryColorSuppl: '#00462B',

    infoColor: '#00462B',
    infoColorHover: '#005C39',
    infoColorPressed: '#003A24',
    infoColorSuppl: '#00462B',
  },
  Message: {
    borderRadius: '16px',
    padding: '12px 16px',
  },
};
</script>

<style scoped>
:global(.n-message-wrapper) {
  max-width: 80vw;
}

:global(.n-message__content) {
  white-space: normal;
  overflow-wrap: anywhere;
}
</style>
