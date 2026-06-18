// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useSingleSpotMap } from '../useSpotMap';
import type { Spot } from '@/types/spot';

const createSpot = (overrides: Partial<Spot> = {}): Spot => ({
  id: 'spot-1',
  name: 'Stadtpark',
  collection: 'collection-1',
  user: 'user-1',
  description: 'Großer Park',
  created: '2026-06-01 10:00:00',
  updated: '2026-06-01 10:00:00',
  ...overrides,
});

describe('useSingleSpotMap', () => {
  it('verwendet gültige Spot-Koordinaten als Kartenmittelpunkt', () => {
    const spot = createSpot({
      locationLat: 48.2,
      locationLng: 16.3,
    });

    const { spotLatLng, mapCenter } = useSingleSpotMap(ref(spot));

    expect(spotLatLng.value).toEqual([48.2, 16.3]);
    expect(mapCenter.value).toEqual([48.2, 16.3]);
  });

  it('verwendet bei fehlenden Koordinaten den Standardmittelpunkt', () => {
    const spot = createSpot();

    const { spotLatLng, mapCenter, defaultMapCenter } = useSingleSpotMap(ref(spot));

    expect(spotLatLng.value).toBeNull();
    expect(mapCenter.value).toEqual(defaultMapCenter);
  });

  it('verwirft ungültige Koordinaten', () => {
    const spot = createSpot({
      locationLat: 200,
      locationLng: 16.3,
    });

    const { spotLatLng } = useSingleSpotMap(ref(spot));

    expect(spotLatLng.value).toBeNull();
  });
});
