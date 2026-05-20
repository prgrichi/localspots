// src/utils/plate.ts

export function normalizePlate(value: string) {
  return value.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
}

export function splitPlate(plate: string) {
  const [prefix, ...rest] = plate.split('-');

  return {
    prefix: prefix?.trim() ?? '',
    rest: rest.join('-').trim(),
  };
}

export function buildPlate(prefix: string, rest: string) {
  return `${prefix.trim()}-${rest.trim()}`;
}

export function getPlatePrefix(plate: string) {
  return plate.split('-')[0]?.trim() ?? '';
}
