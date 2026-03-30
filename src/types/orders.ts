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

/** Alle extrahierbaren Felder eines Auftrags */
export interface ExtractedFields {
  material: ExtractedField | null;
  dimensions: ExtractedField | null;
  sawMeasure: ExtractedField | null;
  overmeasure: ExtractedField | null;
  sawInstruction: ExtractedField | null;
  diameterOrRawSize: ExtractedField | null;
}

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
    material: null,
    dimensions: null,
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

// ── Status & Workflow ──

export type OrderStatus =
  | 'open'
  | 'sawn'
  | 'machining_done'
  | 'ready_for_shipping';

export type OrderStep =
  | 'sawing'
  | 'machining'
  | 'packing'
  | null;

// ── Auftrag ──

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

  // Scan-Erweiterung (Phase 2)
  images: OrderImages;
  extracted: ExtractedFields;

  // Workflow
  status: OrderStatus;
  currentStep: OrderStep;
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