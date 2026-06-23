// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';

const mocks = vi.hoisted(() => ({
  addSpot: vi.fn(),
  routerPush: vi.fn(),
  messageSuccess: vi.fn(),
  messageError: vi.fn(),
  setActiveCollection: vi.fn(),
}));

vi.mock('@/stores/spotStore', () => ({
  useSpotStore: () => ({
    addSpot: mocks.addSpot,
  }),
}));

vi.mock('@/stores/collectionStore', () => ({
  useCollectionStore: () => ({
    hasCollections: true,
    activeCollectionId: 'collection-1',
    collectionOptions: [
      {
        label: 'Meine Collection',
        value: 'collection-1',
      },
    ],
    setActiveCollection: mocks.setActiveCollection,
  }),
}));

vi.mock('@/composables/useEnsureCollections', () => ({
  useEnsureCollections: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mocks.routerPush,
  }),
}));

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue');

  return {
    useMessage: () => ({
      success: mocks.messageSuccess,
      error: mocks.messageError,
    }),

    NForm: defineComponent({
      setup(_, { slots }) {
        return () => h('div', slots.default?.());
      },
    }),

    NFormItem: defineComponent({
      props: ['label'],
      setup(props, { slots }) {
        return () => [h('label', props.label), slots.default?.()];
      },
    }),

    NInput: defineComponent({
      props: ['value', 'placeholder', 'type'],
      emits: ['update:value', 'keyup'],
      setup(props, { emit }) {
        return () =>
          props.type === 'textarea'
            ? h('textarea', {
                placeholder: props.placeholder,
                value: props.value,
                onInput: (event: Event) => {
                  emit('update:value', (event.target as HTMLTextAreaElement).value);
                },
              })
            : h('input', {
                placeholder: props.placeholder,
                value: props.value,
                onInput: (event: Event) => {
                  emit('update:value', (event.target as HTMLInputElement).value);
                },
              });
      },
    }),

    NSelect: defineComponent({
      props: ['value', 'placeholder'],
      emits: ['update:value'],
      setup(props, { emit }) {
        return () =>
          h(
            'select',
            {
              value: props.value,
              'data-placeholder': props.placeholder,
              onChange: (event: Event) => {
                emit('update:value', (event.target as HTMLSelectElement).value);
              },
            },
            [
              h('option', { value: '' }, 'Bitte wählen'),
              h('option', { value: 'restaurant' }, 'Restaurant'),
              h('option', { value: 'collection-1' }, 'Meine Collection'),
            ]
          );
      },
    }),

    NButton: defineComponent({
      props: ['loading', 'disabled'],
      emits: ['click'],
      setup(props, { slots, emit }) {
        return () =>
          h(
            'button',
            {
              disabled: props.disabled,
              onClick: () => emit('click'),
            },
            slots.default?.()
          );
      },
    }),
  };
});

import EntryPage from '../EntryPage.vue';

const mountPage = () =>
  mount(EntryPage, {
    global: {
      stubs: {
        CollectionCreateDrawer: true,
        NoCollectionsState: true,
      },
    },
  });

describe('EntryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('erstellt einen Spot und navigiert zur Spot-Liste', async () => {
    mocks.addSpot.mockResolvedValue({
      id: 'spot-1',
    });

    const wrapper = mountPage();

    await wrapper.get('input[placeholder="Name"]').setValue('Mein Spot');

    await wrapper.get('select[data-placeholder="Kategorie wählen"]').setValue('restaurant');

    await wrapper.get('textarea[placeholder="Beschreibung"]').setValue('Sehr schöner Ort');

    await wrapper.get('button').trigger('click');

    expect(mocks.addSpot).toHaveBeenCalledWith('collection-1', {
      name: 'Mein Spot',
      category: 'restaurant',
      description: 'Sehr schöner Ort',
    });

    expect(mocks.messageSuccess).toHaveBeenCalledWith('Spot gespeichert');

    expect(mocks.routerPush).toHaveBeenCalledWith({
      path: '/spots',
      query: {
        highlight: 'spot-1',
      },
    });
  });

  it('speichert nicht, wenn kein Name eingegeben wurde', async () => {
    const wrapper = mountPage();

    await wrapper.get('button').trigger('click');

    expect(mocks.addSpot).not.toHaveBeenCalled();

    expect(mocks.messageError).toHaveBeenCalledWith('Bitte gib einen Namen ein');

    expect(mocks.routerPush).not.toHaveBeenCalled();
  });

  it('zeigt einen Fehler und navigiert nicht, wenn das Speichern fehlschlägt', async () => {
    mocks.addSpot.mockRejectedValue(new Error('Speichern fehlgeschlagen'));

    const wrapper = mountPage();

    await wrapper.get('input[placeholder="Name"]').setValue('Mein Spot');

    await wrapper.get('button').trigger('click');

    expect(mocks.addSpot).toHaveBeenCalled();

    expect(mocks.messageError).toHaveBeenCalledWith('Speichern fehlgeschlagen');

    expect(mocks.routerPush).not.toHaveBeenCalled();
  });
});
