import type { Spot } from '@/types/spot';

export type SpotFavorite = {
  id: string;
  user: string;
  spot: string;
  created: string;
  updated: string;

  expand?: {
    spot?: Spot;
  };
};

export type CreateSpotFavoriteData = {
  user: string;
  spot: string;
};
