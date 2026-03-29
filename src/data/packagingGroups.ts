export interface PackagingArticle {
  name: string;
  height: number;
  diameter: number;
  karton: string;
  beutel: string;
}

export interface PackagingGroup {
  id: string;
  name: string;
  articles: PackagingArticle[];
}

export const packagingGroups: PackagingGroup[] = [
  {
    id: 'ds',
    name: 'DS',
    articles: [
      { name: 'DS 15', height: 4, diameter: 25, karton: '', beutel: '70x70' },
      { name: 'DS 20', height: 5, diameter: 32, karton: '', beutel: '70x70' },
      { name: 'DS 30', height: 6, diameter: 45, karton: '', beutel: '70x70' },
      { name: 'DS 40', height: 8, diameter: 58, karton: '', beutel: '70x70' },
      { name: 'DS 50', height: 10, diameter: 70, karton: '', beutel: '150x150' },
      { name: 'DS 60', height: 12, diameter: 80, karton: '', beutel: '150x150' },
      { name: 'DS 80', height: 16, diameter: 105, karton: '', beutel: '150x150' },
    ],
  },
  {
    id: 'hvs',
    name: 'HVS',
    articles: [
      { name: 'HVS 15', height: 28, diameter: 25, karton: '', beutel: '70x70' },
      { name: 'HVS 20', height: 35, diameter: 32, karton: '', beutel: '70x70' },
      { name: 'HVS 30', height: 42, diameter: 45, karton: '60x60x50', beutel: '' },
      { name: 'HVS 40', height: 54, diameter: 58, karton: '60x60x80', beutel: '' },
      { name: 'HVS 50', height: 66, diameter: 70, karton: '80x80x90', beutel: '' },
      { name: 'HVS 60', height: 76, diameter: 80, karton: '80x80x90', beutel: '' },
      { name: 'HVS 80', height: 95, diameter: 105, karton: '110x110x140', beutel: '' },
    ],
  },
  {
    id: 'hvsk',
    name: 'HVSK',
    articles: [
      { name: 'HVSK 15', height: 33, diameter: 25, karton: '', beutel: '70x70' },
      { name: 'HVSK 20', height: 41, diameter: 32, karton: '', beutel: '70x70' },
      { name: 'HVSK 30', height: 49, diameter: 45, karton: '60x60x50', beutel: '' },
      { name: 'HVSK 40', height: 63, diameter: 58, karton: '60x60x80', beutel: '' },
      { name: 'HVSK 50', height: 77, diameter: 70, karton: '80x80x90', beutel: '' },
      { name: 'HVSK 60', height: 87, diameter: 80, karton: '80x80x90', beutel: '' },
      { name: 'HVSK 80', height: 110, diameter: 105, karton: '110x110x140', beutel: '' },
    ],
  },
  {
    id: 'kae',
    name: 'KAE',
    articles: [
      { name: 'KAE 15', height: 22, diameter: 25, karton: '', beutel: '70x70' },
    ],
  },
  {
    id: 'km',
    name: 'KM',
    articles: [
      { name: 'KM 40', height: 9, diameter: 58, karton: '', beutel: '70x70' },
      { name: 'KM 50', height: 11, diameter: 70, karton: '', beutel: '150x150' },
      { name: 'KM 60', height: 11, diameter: 80, karton: '', beutel: '150x150' },
      { name: 'KM 80', height: 15, diameter: 105, karton: '', beutel: '150x150' },
    ],
  },
  {
    id: 'kvs',
    name: 'KVS',
    articles: [
      { name: 'KVS 15', height: 35, diameter: 25, karton: '', beutel: '70x70' },
      { name: 'KVS 20', height: 43, diameter: 32, karton: '', beutel: '70x70' },
      { name: 'KVS 30', height: 54, diameter: 45, karton: '60x60x80', beutel: '' },
      { name: 'KVS 40', height: 70, diameter: 58, karton: '60x60x80', beutel: '' },
      { name: 'KVS 50', height: 83, diameter: 70, karton: '80x80x90', beutel: '' },
      { name: 'KVS 60', height: 94, diameter: 80, karton: '110x110x140', beutel: '' },
      { name: 'KVS 80', height: 119, diameter: 105, karton: '110x110x140', beutel: '' },
    ],
  },
  {
    id: 'kvsk',
    name: 'KVSK',
    articles: [
      { name: 'KVSK 15', height: 40, diameter: 25, karton: '', beutel: '70x70' },
      { name: 'KVSK 20', height: 49, diameter: 32, karton: '', beutel: '70x70' },
      { name: 'KVSK 30', height: 61, diameter: 45, karton: '60x60x80', beutel: '' },
      { name: 'KVSK 40', height: 79, diameter: 58, karton: '60x60x80', beutel: '' },
      { name: 'KVSK 50', height: 94, diameter: 70, karton: '110x110x140', beutel: '' },
      { name: 'KVSK 60', height: 105, diameter: 80, karton: '110x110x140', beutel: '' },
      { name: 'KVSK 80', height: 135, diameter: 105, karton: '110x110x140', beutel: '' },
    ],
  },
  {
    id: 'nae',
    name: 'NAE',
    articles: [
      { name: 'NAE 15', height: 15, diameter: 25, karton: '', beutel: '70x70' },
      { name: 'NAE 20', height: 18, diameter: 32, karton: '', beutel: '70x70' },
      { name: 'NAE 30', height: 22, diameter: 45, karton: '60x60x40', beutel: '' },
      { name: 'NAE 40', height: 28, diameter: 58, karton: '60x60x40', beutel: '' },
      { name: 'NAE 50', height: 33, diameter: 70, karton: '80x80x50', beutel: '' },
      { name: 'NAE 60', height: 38, diameter: 80, karton: '80x80x50', beutel: '' },
      { name: 'NAE 80', height: 48, diameter: 105, karton: '110x110x90', beutel: '' },
    ],
  },
  {
    id: 'naek',
    name: 'NAEK',
    articles: [
      { name: 'NAEK 15', height: 20, diameter: 25, karton: '', beutel: '70x70' },
      { name: 'NAEK 20', height: 24, diameter: 32, karton: '', beutel: '70x70' },
      { name: 'NAEK 30', height: 29, diameter: 45, karton: '60x60x40', beutel: '' },
      { name: 'NAEK 40', height: 37, diameter: 58, karton: '60x60x40', beutel: '' },
      { name: 'NAEK 50', height: 44, diameter: 70, karton: '80x80x50', beutel: '' },
      { name: 'NAEK 60', height: 49, diameter: 80, karton: '80x80x50', beutel: '' },
      { name: 'NAEK 80', height: 63, diameter: 105, karton: '110x110x90', beutel: '' },
    ],
  },
];
