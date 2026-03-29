/** A single field in a calculator operation */
export interface OpField {
  key: string;
  label: string;
  unit: string;
  type: 'input' | 'fixed';
  fixedValue: string;
}

/** A result definition with formula */
export interface OpResult {
  key: string;
  label: string;
  formula: string;
  unit?: string;
  highlight: boolean;
}

/** A complete calculator operation definition */
export interface Operation {
  id: string;
  name: string;
  description: string;
  fields: OpField[];
  results: OpResult[];
  summaryTemplate: string;
}

/** A single history entry */
export interface HistoryEntry {
  id: string;
  timestamp: number;
  summary: string;
  inputSummary: string;
}

/** A calculator card instance */
export interface RechnerCard {
  id: string;
  operationId: string;
  inputs: Record<string, string>;
  history: HistoryEntry[];
}

/** Computed result line for display */
export interface ResultLine {
  label: string;
  value: string;
  highlight: boolean;
}

/** Full computed result */
export interface ComputedResult {
  lines: ResultLine[];
  summary: string;
}
