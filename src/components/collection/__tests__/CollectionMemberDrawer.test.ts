// @vitest-environment jsdom

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { Collection } from '@/types/collection';

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
  };
});

import CollectionMemberDrawer from '../CollectionMemberDrawer.vue';

const collection: Collection = {
  id: 'collection-1',
  collectionId: 'collections',
  collectionName: 'collections',
  name: 'Wanderfreunde',
  owner: 'user-1',
  members: ['user-1', 'user-2'],
  expand: {
    members: [
      {
        id: 'user-1',
        collectionId: 'users',
        collectionName: 'users',
        name: 'Richard',
        email: 'richard@example.com',
      },
      {
        id: 'user-2',
        collectionId: 'users',
        collectionName: 'users',
        email: 'anna@example.com',
      },
    ],
  },
};

describe('CollectionMemberDrawer', () => {
  it('zeigt Mitgliederzahl und Mitglieder an', () => {
    const wrapper = mount(CollectionMemberDrawer, {
      props: {
        show: true,
        collection,
      },
    });

    expect(wrapper.text()).toContain('2 Mitglieder');
    expect(wrapper.text()).toContain('Richard');
    expect(wrapper.text()).toContain('anna@example.com');
  });

  it('zeigt einen Empty State, wenn keine Mitglieder vorhanden sind', () => {
    const wrapper = mount(CollectionMemberDrawer, {
      props: {
        show: true,
        collection: {
          ...collection,
          members: [],
          expand: {
            members: [],
          },
        },
      },
    });

    expect(wrapper.text()).toContain('0 Mitglieder');
    expect(wrapper.text()).toContain('Keine Mitglieder gefunden.');
  });

  it('reicht update:show weiter', () => {
    const wrapper = mount(CollectionMemberDrawer, {
      props: {
        show: true,
        collection,
      },
    });

    const drawer = wrapper.getComponent({ name: 'NDrawer' });

    drawer.vm.$emit('update:show', false);

    expect(wrapper.emitted('update:show')).toEqual([[false]]);
  });
});
