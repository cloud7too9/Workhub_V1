import type { OrderStatus } from '../types/orders';

export const hallGrid = { columns: 20, rows: 36 };

export interface HallZoneConfig {
  id: string;
  label: string;
  column: [number, number];
  row: [number, number];
  color: string;
}

export const hallZones: HallZoneConfig[] = [
  { id: 'hof', label: 'Hof', column: [1, 6], row: [1, 22], color: 'rgba(255,255,255,0.03)' },
  { id: 'halle1', label: 'Halle 1', column: [7, 20], row: [1, 22], color: 'rgba(0,229,255,0.06)' },
  { id: 'lager', label: 'Lager', column: [1, 6], row: [23, 36], color: 'rgba(255,255,255,0.03)' },
  { id: 'halle2', label: 'Halle 2', column: [7, 20], row: [23, 36], color: 'rgba(0,229,255,0.04)' },
];

export interface HallStationConfig {
  status: OrderStatus;
  zoneId: string;
}

export const hallStations: HallStationConfig[] = [
  { status: 'open', zoneId: 'halle1' },
  { status: 'sawn', zoneId: 'halle1' },
  { status: 'machining_done', zoneId: 'halle2' },
  { status: 'ready_for_shipping', zoneId: 'lager' },
];
