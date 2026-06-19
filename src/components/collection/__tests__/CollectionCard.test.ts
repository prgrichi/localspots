// @vitest-environment jsdom

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CollectionCard from '../CollectionCard.vue';
import type { Collection } from '@/types/collection';

const collection: Collection = {
  id: 'collection-1',
  collectionId: 'collections',
  collectionName: 'collections',
  name: 'Wandern',
  owner: 'user-1',
  members: ['user-1', 'user-2'],
};

describe('CollectionCard', () => {
  it('zeigt Name und Mitgliederzahl an', () => {
    const wrapper = mount(CollectionCard, {
      props: {
        collection,
        primaryText: 'Mitglieder',
        isOwner: false,
        isSubscribed: false,
        isPending: false,
        isDisabled: false,
      },
    });

    expect(wrapper.text()).toContain('Wandern');
    expect(wrapper.text()).toContain('2 Mitglieder');
  });

  it('zeigt bei einem Mitglied den Singular an', () => {
    const wrapper = mount(CollectionCard, {
      props: {
        collection: {
          ...collection,
          members: ['user-1'],
        },
        primaryText: 'Mitglieder',
        isOwner: false,
        isSubscribed: false,
        isPending: false,
        isDisabled: false,
      },
    });

    expect(wrapper.text()).toContain('1 Mitglied');
  });

  it('zeigt den Owner-Hinweis an', () => {
    const wrapper = mount(CollectionCard, {
      props: {
        collection,
        primaryText: 'Mitglieder',
        isOwner: true,
        isSubscribed: false,
        isPending: false,
        isDisabled: false,
      },
    });

    expect(wrapper.text()).toContain('Von dir erstellt');
  });

  it('zeigt den Beitreten-Button an', () => {
    const wrapper = mount(CollectionCard, {
      props: {
        collection,
        primaryText: 'Mitglieder',
        isOwner: false,
        isSubscribed: false,
        isPending: false,
        isDisabled: false,
        showJoin: true,
      },
    });

    expect(wrapper.text()).toContain('Beitreten');
  });

  it('emittiert beim Klick das primary-Event mit der Collection-ID', async () => {
    const wrapper = mount(CollectionCard, {
      props: {
        collection,
        primaryText: 'Mitglieder',
        isOwner: false,
        isSubscribed: false,
        isPending: false,
        isDisabled: false,
      },
    });

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('primary')).toEqual([['collection-1']]);
  });

  it('emittiert beim Klick auf Beitreten das join-Event', async () => {
    const wrapper = mount(CollectionCard, {
      props: {
        collection,
        primaryText: 'Mitglieder',
        isOwner: false,
        isSubscribed: false,
        isPending: false,
        isDisabled: false,
        showJoin: true,
      },
    });

    const joinButton = wrapper.findAll('button').find(button => button.text() === 'Beitreten');

    expect(joinButton).toBeDefined();

    await joinButton!.trigger('click');

    expect(wrapper.emitted('join')).toEqual([['collection-1']]);
  });

  it('emittiert beim Klick auf Verlassen das leave-Event', async () => {
    const wrapper = mount(CollectionCard, {
      props: {
        collection,
        primaryText: 'Mitglieder',
        isOwner: false,
        isSubscribed: true,
        isPending: false,
        isDisabled: false,
      },
    });

    const leaveButton = wrapper.findAll('button').find(button => button.text() === 'Verlassen');

    expect(leaveButton).toBeDefined();

    await leaveButton!.trigger('click');

    expect(wrapper.emitted('leave')).toEqual([['collection-1']]);
  });
});
