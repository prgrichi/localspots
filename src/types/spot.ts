// src/types/spot.ts
import type { Collection } from '@/types/collection';

export type Spot = {
  id: string;
  name: string;
  category: string;
  collection: string;
  description: string;

  locationLat?: number | null;
  locationLng?: number | null;
  locationUpdatedAt?: string | null;

  created: string;
  updated: string;

  expand?: {
    collection?: Collection;
  };
};

export type AddSpotPayload = {
  name: string;
  category: string;
  description: string;
};

export type UpdateSpotPayload = {
  name: string;
  category: string;
  collection: string;
  description: string;
};

export type UpdateSpotLocationPayload = {
  locationLat: number | null;
  locationLng: number | null;
};
