// ── Bildquellen ──

/** Herkunft eines extrahierten Wertes */
export type SourceImage = 'drawing' | 'jobSheet';

/** Markierungsrechteck auf einem Bild (Prozentwerte 0–100) */
export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Bildquellen eines Auftrags */
export interface OrderImages {
  /** Vorderseite / Technische Zeichnung */
  drawingImage: string | null;
  /** Rückseite / Werkstattauftrag */
  jobSheetImage: string | null;
}

// ── Extrahierte Feldwerte ──

/** Einzelner aus einem Bild extrahierter Feldwert */
export interface ExtractedField {
  /** Direkt erkannter / übernommener Rohtext */
  rawText: string;
  /** Bereinigter oder bestätigter Endwert */
  value: string;
  /** Manuell bestätigt? */
  confirmed: boolean;
  /** Herkunft: drawing oder jobSheet */
  sourceImage: SourceImage | null;
  /** Markierter Bereich auf dem Bild */
  selectionRect: SelectionRect | null;
}

/** Schlüssel aller extrahierbaren Felder */
export type ExtractedFieldKey =
  | 'article'
  | 'material'
  | 'quantity'
  | 'sawMeasure'
  | 'overmeasure'
  | 'sawInstruction'
  | 'diameterOrRawSize';

/** Alle extrahierbaren Felder eines Auftrags */
export type ExtractedFields = Record<ExtractedFieldKey, ExtractedField | null>;

/** Lesbare deutsche Labels für ExtractedFieldKeys */
export const extractedFieldLabels: Record<ExtractedFieldKey, string> = {
  article: 'Artikel',
  material: 'Werkstoff',
  quantity: 'Stückzahl',
  sawMeasure: 'Sägemaß',
  overmeasure: 'Aufmaß',
  sawInstruction: 'Sägeanweisung',
  diameterOrRawSize: 'Rohmaß / Ø',
};

/** Säge-relevante Felder (Phase 7 Priorisierung) */
export const sawRelevantFields: ExtractedFieldKey[] = [
  'sawMeasure',
  'overmeasure',
  'sawInstruction',
  'material',
  'diameterOrRawSize',
  'quantity',
];

/** Allgemeine Felder (nachrangig in Phase 7) */
export const generalFields: ExtractedFieldKey[] = [
  'article',
];

// ── Factory-Funktionen ──

export function emptyExtractedField(): ExtractedField {
  return {
    rawText: '',
    value: '',
    confirmed: false,
    sourceImage: null,
    selectionRect: null,
  };
}

export function emptyExtractedFields(): ExtractedFields {
  return {
    article: null,
    material: null,
    quantity: null,
    sawMeasure: null,
    overmeasure: null,
    sawInstruction: null,
    diameterOrRawSize: null,
  };
}

export function emptyOrderImages(): OrderImages {
  return {
    drawingImage: null,
    jobSheetImage: null,
  };
}

// ── Status & Workflow (Phase 8: vereinfacht) ──

export type OrderStatus = 'open' | 'in_progress' | 'done';

export interface Order {
  id: string;

  // Grunddaten (bestehend, weiterhin nutzbar)
  article: string;
  orderNumber: string;
  customer: string;
  material: string;
  dimensions: string;
  quantity: number;
  deliveryDate: string;
  notes: string;

  // Scan-Erweiterung (Phase 2+)
  images: OrderImages;
  extracted: ExtractedFields;

  // Workflow (Phase 8: vereinfacht)
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// ── History ──

export interface OrderHistoryEntry {
  id: string;
  orderId: string;
  timestamp: string;
  action: string;
  oldValue: string;
  newValue: string;
}

// ── Filter & Sort ──

export type OrderStatusFilter = 'all' | OrderStatus;

export type OrderSortMode =
  | 'deliveryDateAsc'
  | 'deliveryDateDesc'
  | 'updatedAtDesc';
