// src/composables/useCurrentGeoLocation.ts
import { computed, ref } from 'vue';

export const useCurrentGeoLocation = () => {
  const isLocating = ref(false);

  const isSupported = computed(() => {
    return typeof navigator !== 'undefined' && !!navigator.geolocation;
  });

  const getCurrentLocation = () => {
    if (!isSupported.value) {
      return Promise.reject(new Error('Dein Browser unterstützt die Standortermittlung nicht.'));
    }

    isLocating.value = true;

    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          isLocating.value = false;

          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => {
          isLocating.value = false;

          if (error.code === error.PERMISSION_DENIED) {
            reject(new Error('Standortzugriff wurde abgelehnt.'));
            return;
          }

          reject(new Error('Standort konnte nicht ermittelt werden.'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  return {
    isSupported,
    isLocating,
    getCurrentLocation,
  };
};
