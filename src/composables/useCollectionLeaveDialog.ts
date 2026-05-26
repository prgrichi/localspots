import type { Ref } from 'vue';
import { useDialog, useMessage, type DialogOptions } from 'naive-ui';

type UseCollectionLeaveDialogOptions = {
  pendingCollectionId: Ref<string | null>;
  onLeave: (id: string) => Promise<unknown>;
  dialogOptions?: DialogOptions;
};

export function useCollectionLeaveDialog(options: UseCollectionLeaveDialogOptions) {
  const dialog = useDialog();
  const message = useMessage();

  function confirmLeaveCollection(id: string) {
    dialog.warning({
      title: 'Collection verlassen?',
      content: 'Du siehst die Spots dieser Collection danach nicht mehr in deiner App.',
      positiveText: 'Verlassen',
      negativeText: 'Abbrechen',
      ...options.dialogOptions,
      onPositiveClick: () => leaveCollection(id),
    });
  }

  async function leaveCollection(id: string) {
    options.pendingCollectionId.value = id;

    try {
      await options.onLeave(id);
      message.success('Collection verlassen');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Verlassen fehlgeschlagen';
      message.error(msg);
    } finally {
      options.pendingCollectionId.value = null;
    }
  }

  return {
    confirmLeaveCollection,
  };
}
