// @vitest-environment jsdom

import { mount, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/*
 * Diese Mock-Funktionen müssen vor den vi.mock()-Blöcken verfügbar sein.
 */
const mocks = vi.hoisted(() => ({
  createCollection: vi.fn(),
  successMessage: vi.fn(),
  errorMessage: vi.fn(),
}));

/*
 * Der echte CollectionStore wird im Komponententest ersetzt.
 */
vi.mock('@/stores/collectionStore', () => ({
  useCollectionStore: () => ({
    createCollection: mocks.createCollection,
  }),
}));

/*
 * Naive UI wird durch einfache Vue-Komponenten ersetzt.
 */
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue');

  return {
    NDrawer: defineComponent({
      name: 'NDrawer',
      props: {
        show: Boolean,
      },
      emits: ['update:show'],
      template: '<div><slot /></div>',
    }),

    NDrawerContent: defineComponent({
      name: 'NDrawerContent',
      template: '<section><slot /></section>',
    }),

    NForm: defineComponent({
      name: 'NForm',
      template: '<form><slot /></form>',
    }),

    NFormItem: defineComponent({
      name: 'NFormItem',
      template: '<div><slot /></div>',
    }),

    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: String,
        placeholder: String,
      },
      emits: ['update:value', 'keyup'],
      template: `
        <input
          :value="value"
          :placeholder="placeholder"
          @input="$emit('update:value', $event.target.value)"
          @keyup="$emit('keyup', $event)"
        />
      `,
    }),

    NButton: defineComponent({
      name: 'NButton',
      props: {
        disabled: Boolean,
        loading: Boolean,
      },
      emits: ['click'],
      template: `
        <button
          type="button"
          :disabled="disabled"
          @click="$emit('click')"
        >
          <slot />
        </button>
      `,
    }),

    useMessage: () => ({
      success: mocks.successMessage,
      error: mocks.errorMessage,
    }),
  };
});

import CollectionCreateDrawer from '../CollectionCreateDrawer.vue';

describe('CollectionCreateDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('erstellt eine Collection und schließt den Drawer', async () => {
    mocks.createCollection.mockResolvedValue({
      id: 'collection-1',
    });

    const wrapper = mount(CollectionCreateDrawer, {
      props: {
        show: true,
      },
    });

    await wrapper.get('input').setValue('  Wanderfreunde  ');
    await wrapper.get('button').trigger('click');

    await flushPromises();

    expect(mocks.createCollection).toHaveBeenCalledWith('Wanderfreunde');

    expect(mocks.successMessage).toHaveBeenCalledWith('Collection erstellt');

    expect(wrapper.emitted('created')).toEqual([['collection-1']]);

    expect(wrapper.emitted('update:show')).toEqual([[false]]);

    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('');

    wrapper.unmount();
  });

  it('speichert keinen leeren Namen', async () => {
    const wrapper = mount(CollectionCreateDrawer, {
      props: {
        show: true,
      },
    });

    await wrapper.get('input').setValue('   ');

    const button = wrapper.get('button');

    expect(button.attributes('disabled')).toBeDefined();

    await button.trigger('click');

    expect(mocks.createCollection).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it('zeigt eine Fehlermeldung, wenn das Erstellen fehlschlägt', async () => {
    mocks.createCollection.mockRejectedValue(new Error('Server nicht erreichbar'));

    const wrapper = mount(CollectionCreateDrawer, {
      props: {
        show: true,
      },
    });

    await wrapper.get('input').setValue('Wanderfreunde');
    await wrapper.get('button').trigger('click');

    await flushPromises();

    expect(mocks.errorMessage).toHaveBeenCalledWith('Server nicht erreichbar');

    expect(wrapper.emitted('created')).toBeUndefined();

    expect(wrapper.emitted('update:show')).toBeUndefined();

    wrapper.unmount();
  });
});
