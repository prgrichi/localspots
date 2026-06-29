import { icon } from 'leaflet';

export function createSpotIcon() {
  return icon({
    iconUrl: '/icons/spot-marker.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
}
