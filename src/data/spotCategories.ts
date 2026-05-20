export const spotCategories = [
  'Restaurant',
  'Café',
  'Aussichtspunkt',
  'Natur',
  'Badestelle',
  'Angelstelle',
  'Wandern',
  'Bar',
  'Kultur',
  'Shop',
  'Sport',
  'Picknickplatz',
  'Sonnenuntergangsspot',
  'Fotospot',
  'Sonstiges',
] as const;

export type SpotCategory = (typeof spotCategories)[number];

export const spotCategoryOptions = spotCategories.map(category => ({
  label: category,
  value: category,
}));
