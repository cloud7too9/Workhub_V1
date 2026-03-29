import type { Operation, ComputedResult, OpField } from '../types/rechner';

/** Default operations shipped with the app */
export const DEFAULT_OPERATIONS: Operation[] = [
  {
    id: 'stueckzahl_restlaenge',
    name: 'Stückzahl + Restlänge',
    description: 'Berechnet Teile pro Stange und Restlänge',
    fields: [
      { key: 'a', label: 'Stangenlänge', unit: 'mm', type: 'input', fixedValue: '' },
      { key: 'b', label: 'Stücklänge', unit: 'mm', type: 'input', fixedValue: '' },
      { key: 'c', label: 'Sägeschnitt', unit: 'mm', type: 'fixed', fixedValue: '1.7' },
    ],
    results: [
      { key: 'r1', label: 'Stückzahl', formula: 'floor(a / (b + c))', highlight: true },
      { key: 'r2', label: 'Restlänge', formula: 'a - floor(a / (b + c)) * (b + c)', unit: 'mm', highlight: false },
      { key: 'r3', label: 'Verbrauch/Teil', formula: 'b + c', unit: 'mm', highlight: false },
    ],
    summaryTemplate: '{r1} Stück, {r2} mm Rest',
  },
];

/**
 * Safely evaluate a math expression with variable substitution.
 * Supports: floor, ceil, round, abs, sqrt, min, max
 */
export function safeEval(expr: string, vars: Record<string, number>): number {
  try {
    let e = expr.trim();
    // Replace variable names (longest first to avoid partial replace)
    const sorted = Object.keys(vars).sort((a, b) => b.length - a.length);
    for (const k of sorted) {
      e = e.replaceAll(k, `(${vars[k]})`);
    }
    // Replace math functions
    e = e.replace(/floor\(/g, 'Math.floor(');
    e = e.replace(/ceil\(/g, 'Math.ceil(');
    e = e.replace(/round\(/g, 'Math.round(');
    e = e.replace(/abs\(/g, 'Math.abs(');
    e = e.replace(/sqrt\(/g, 'Math.sqrt(');
    e = e.replace(/min\(/g, 'Math.min(');
    e = e.replace(/max\(/g, 'Math.max(');
    // Safety check — only allow safe characters
    if (/[^0-9+\-*/().,%\s Math.floorceiundsqtabmxp]/.test(e)) return NaN;
    // eslint-disable-next-line no-new-func
    return new Function(`"use strict"; return (${e})`)() as number;
  } catch {
    return NaN;
  }
}

/** Execute a full operation with user inputs, returns null on invalid input */
export function executeOperation(
  op: Operation,
  inputs: Record<string, string>,
): ComputedResult | null {
  const vars: Record<string, number> = {};

  for (const f of op.fields) {
    const val =
      f.type === 'fixed' ? parseFloat(f.fixedValue) : parseFloat(inputs[f.key] ?? '');
    if (isNaN(val)) return null;
    vars[f.key] = val;
  }

  const resultValues: Record<string, number> = {};
  const lines: ComputedResult['lines'] = [];

  for (const r of op.results) {
    const val = safeEval(r.formula, vars);
    if (isNaN(val)) return null;
    const rounded = Math.round(val * 100) / 100;
    resultValues[r.key] = rounded;
    lines.push({
      label: r.label,
      value: r.unit ? `${rounded} ${r.unit}` : `${rounded}`,
      highlight: r.highlight,
    });
  }

  let summary = op.summaryTemplate || '';
  for (const [k, v] of Object.entries(resultValues)) {
    summary = summary.replaceAll(`{${k}}`, String(v));
  }

  return { lines, summary };
}

/** Build input summary string for history */
export function buildInputSummary(op: Operation, inputs: Record<string, string>): string {
  return op.fields
    .filter((f: OpField) => f.type === 'input')
    .map((f: OpField) => `${f.label || f.key}: ${inputs[f.key] || '—'}`)
    .join(' · ');
}
