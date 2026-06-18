import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCurrentGeoLocation } from '../useCurrentGeoLocation';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useCurrentGeoLocation', () => {
  it('liefert die aktuellen Koordinaten zurück', async () => {
    const getCurrentPosition = vi.fn(success => {
      success({
        coords: {
          latitude: 48.2,
          longitude: 16.3,
        },
      });
    });

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition,
      },
      configurable: true,
    });

    const { getCurrentLocation } = useCurrentGeoLocation();

    const result = await getCurrentLocation();

    expect(result).toEqual({
      lat: 48.2,
      lng: 16.3,
    });
  });

  it('gibt eine passende Fehlermeldung zurück, wenn der Standortzugriff abgelehnt wird', async () => {
    const getCurrentPosition = vi.fn((_success, error) => {
      error({
        code: 1,
        PERMISSION_DENIED: 1,
      });
    });

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition,
      },
      configurable: true,
    });

    const { getCurrentLocation } = useCurrentGeoLocation();

    await expect(getCurrentLocation()).rejects.toThrow('Standortzugriff wurde abgelehnt.');
  });

  it('gibt eine Fehlermeldung zurück, wenn Geolocation nicht unterstützt wird', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    });

    const { getCurrentLocation } = useCurrentGeoLocation();

    await expect(getCurrentLocation()).rejects.toThrow(
      'Dein Browser unterstützt die Standortermittlung nicht.'
    );
  });
});
