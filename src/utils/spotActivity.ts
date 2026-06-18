import type { Spot } from '@/types/spot';
import type { SpotActivity } from '@/types/activity';

export function mapSpotToActivity(spot: Spot): SpotActivity {
  return {
    id: spot.id,
    name: spot.name,
    userLabel: spot.expand?.user?.name || spot.expand?.user?.email || 'Unbekannter User',
    collectionLabel: spot.expand?.collection?.name || 'Unbekannte Collection',
    createdLabel: formatDateTime(spot.created),
  };
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
