// @vitest-environment jsdom

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SpotCard from '../SpotCard.vue';
import type { Spot } from '@/types/spot';

const spot: Spot = {
  id: 'spot-1',
  name: 'Stadtpark',
  category: 'Natur',
  collection: 'collection-1',
  user: 'user-1',
  description: 'Großer Park',
  locationLat: 48.2,
  locationLng: 16.3,
  created: '2026-06-01 10:00:00',
  updated: '2026-06-01 10:00:00',
};

describe('SpotCard', () => {
  it('zeigt die Spot-Daten und den Standortstatus an', () => {
    const wrapper = mount(SpotCard, {
      props: {
        spot,
        isFavorite: false,
        highlighted: false,
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    });

    expect(wrapper.text()).toContain('Stadtpark');
    expect(wrapper.text()).toContain('Natur');
    expect(wrapper.text()).toContain('Großer Park');
    expect(wrapper.text()).toContain('Mit Standort');
  });

  it('zeigt bei fehlendem Namen einen Fallback an', () => {
    const wrapper = mount(SpotCard, {
      props: {
        spot: {
          ...spot,
          name: '',
        },
        isFavorite: false,
        highlighted: false,
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    });

    expect(wrapper.text()).toContain('Unbenannter Spot');
  });

  it('emittiert beim Klick das toggle-favorite-Event mit der Spot-ID', async () => {
    const wrapper = mount(SpotCard, {
      props: {
        spot,
        isFavorite: false,
        highlighted: false,
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    });

    const button = wrapper.get('button');

    await button.trigger('click');

    expect(wrapper.emitted('toggle-favorite')).toEqual([['spot-1']]);
  });

  it('zeigt Ohne Standort bei fehlenden Koordinaten an', () => {
    const wrapper = mount(SpotCard, {
      props: {
        spot: {
          ...spot,
          locationLat: null,
          locationLng: null,
        },
        isFavorite: false,
        highlighted: false,
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    });

    expect(wrapper.text()).toContain('Ohne Standort');
  });
});
