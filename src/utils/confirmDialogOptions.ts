import type { DialogOptions } from 'naive-ui';

export const confirmDialogOptions: DialogOptions = {
  style: {
    width: 'calc(100vw - 2rem)',
    maxWidth: '24rem',
    borderRadius: '1.5rem',
    padding: '1rem',
  },
  class: 'localspot-dialog',
  positiveButtonProps: {
    type: 'error',
    secondary: true,
    round: true,
  },
  negativeButtonProps: {
    secondary: true,
    round: true,
  },
};
