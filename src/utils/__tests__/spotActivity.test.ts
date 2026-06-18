import { describe, expect, it } from 'vitest';
import { mapSpotToActivity } from '../spotActivity';
import type { Spot } from '@/types/spot';

const spot: Spot = {
  id: 'spot-1',
  name: 'Stadtpark',
  collection: 'collection-1',
  user: 'user-1',
  description: 'Großer Park',
  created: '2026-06-01 10:00:00',
  updated: '2026-06-01 10:00:00',
  expand: {
    user: {
      id: 'user-1',
      name: 'Richard',
      email: 'richard@example.com',
    },
    collection: {
      id: 'collection-1',
      collectionId: 'collections',
      collectionName: 'collections',
      name: 'Lieblingsorte',
      owner: 'user-1',
      members: ['user-1'],
    },
  },
};

describe('mapSpotToActivity', () => {
  it('wandelt einen Spot in eine Activity um', () => {
    const result = mapSpotToActivity(spot);

    expect(result).toEqual({
      id: 'spot-1',
      name: 'Stadtpark',
      userLabel: 'Richard',
      collectionLabel: 'Lieblingsorte',
      createdLabel: '01.06.26, 10:00',
    });
  });

  it('verwendet Fallbacks bei fehlenden Expand-Daten', () => {
    const result = mapSpotToActivity({
      ...spot,
      expand: undefined,
    });

    expect(result.userLabel).toBe('Unbekannter User');
    expect(result.collectionLabel).toBe('Unbekannte Collection');
  });
});
