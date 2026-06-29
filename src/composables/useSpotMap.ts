import { computed, type Ref } from 'vue';
import type { Spot } from '@/types/spot';

type LatLng = [number, number];
type MapBounds = [LatLng, LatLng];
type SpotMarker = {
  spot: Spot;
  latLng: LatLng;
};

export const DEFAULT_MAP_CENTER: LatLng = [48.2683485, 12.4185968];
export const DEFAULT_MAP_ZOOM = 13;
export const FOCUSED_MAP_ZOOM = 16;

function isValidCoordinate(lat: unknown, lng: unknown): lat is number {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return false;
  }

  if (lat === 0 && lng === 0) {
    return false;
  }

  if (lat < -90 || lat > 90) {
    return false;
  }

  if (lng < -180 || lng > 180) {
    return false;
  }

  return true;
}

function toCoordinate(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function getNormalizedCoordinates(spot: Spot | null | undefined): LatLng | null {
  const lat = toCoordinate(spot?.locationLat);
  const lng = toCoordinate(spot?.locationLng);

  if (lat === null || lng === null) {
    return null;
  }

  if (!isValidCoordinate(lat, lng)) {
    return null;
  }

  return [lat, lng];
}

function getSpotLatLng(spot: Spot | null | undefined): LatLng | null {
  return getNormalizedCoordinates(spot);
}

function getBoundsFromCoordinates(coordinates: LatLng[]): MapBounds | null {
  if (coordinates.length < 2) {
    return null;
  }

  const lats = coordinates.map(([lat]) => lat);
  const lngs = coordinates.map(([, lng]) => lng);

  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
}

export function useSpotMap(spots: Ref<Spot[]>) {
  const mapCenter: LatLng = DEFAULT_MAP_CENTER;

  const spotsWithLocation = computed<Spot[]>(() => {
    return spotMarkers.value.map(marker => marker.spot);
  });

  const spotLatLngs = computed<LatLng[]>(() => {
    return spotMarkers.value.map(marker => marker.latLng);
  });

  const mapBounds = computed<MapBounds | null>(() => {
    return getBoundsFromCoordinates(spotLatLngs.value);
  });

  const spotMarkers = computed<SpotMarker[]>(() => {
    return spots.value
      .map(spot => {
        const latLng = getSpotLatLng(spot);

        if (!latLng) {
          return null;
        }

        return {
          spot,
          latLng,
        };
      })
      .filter((marker): marker is SpotMarker => marker !== null);
  });

  return {
    defaultMapCenter: DEFAULT_MAP_CENTER,
    defaultMapZoom: DEFAULT_MAP_ZOOM,
    focusedMapZoom: FOCUSED_MAP_ZOOM,
    spotMarkers,
    spotsWithLocation,
    spotLatLngs,
    mapCenter,
    mapBounds,
  };
}

export function useSingleSpotMap(spot: Ref<Spot | null>) {
  const spotLatLng = computed<LatLng | null>(() => {
    return getSpotLatLng(spot.value);
  });

  const mapCenter = computed<LatLng>(() => {
    return spotLatLng.value ?? DEFAULT_MAP_CENTER;
  });

  return {
    defaultMapCenter: DEFAULT_MAP_CENTER,
    defaultMapZoom: DEFAULT_MAP_ZOOM,
    focusedMapZoom: FOCUSED_MAP_ZOOM,
    spotLatLng,
    mapCenter,
  };
}
