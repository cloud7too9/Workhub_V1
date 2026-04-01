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
 * Safe math expression evaluator — no eval() or new Function().
 * Supports: +, -, *, /, parentheses, floor, ceil, round, abs, sqrt, min, max
 */
export function safeEval(expr: string, vars: Record<string, number>): number {
  const mathFns: Record<string, (...args: number[]) => number> = {
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    abs: Math.abs,
    sqrt: Math.sqrt,
    min: Math.min,
    max: Math.max,
  };

  let pos = 0;
  // Substitute variables into tokens
  let input = expr.trim();
  const sortedKeys = Object.keys(vars).sort((a, b) => b.length - a.length);
  for (const k of sortedKeys) {
    input = input.replaceAll(k, `(${vars[k]})`);
  }
  const src = input;

  function peek(): string {
    while (pos < src.length && src[pos] === ' ') pos++;
    return pos < src.length ? src[pos]! : '';
  }

  function consume(ch: string): void {
    if (peek() !== ch) throw new Error(`Expected '${ch}'`);
    pos++;
  }

  function parseNumber(): number {
    while (pos < src.length && src[pos] === ' ') pos++;
    let start = pos;
    if (pos < src.length && (src[pos] === '-' || src[pos] === '+')) pos++;
    while (pos < src.length && (src[pos]! >= '0' && src[pos]! <= '9' || src[pos] === '.')) pos++;
    const num = parseFloat(src.slice(start, pos));
    if (isNaN(num)) throw new Error('Invalid number');
    return num;
  }

  function parseIdent(): string {
    while (pos < src.length && src[pos] === ' ') pos++;
    let start = pos;
    while (pos < src.length && /[a-zA-Z_]/.test(src[pos]!)) pos++;
    return src.slice(start, pos);
  }

  function parsePrimary(): number {
    while (pos < src.length && src[pos] === ' ') pos++;

    // Check for function call
    const saved = pos;
    if (/[a-zA-Z]/.test(src[pos] ?? '')) {
      const name = parseIdent();
      if (peek() === '(' && mathFns[name]) {
        consume('(');
        const args: number[] = [parseExpr()];
        while (peek() === ',') {
          consume(',');
          args.push(parseExpr());
        }
        consume(')');
        return mathFns[name]!(...args);
      }
      // Not a function, backtrack
      pos = saved;
    }

    // Parenthesized expression
    if (peek() === '(') {
      consume('(');
      const val = parseExpr();
      consume(')');
      return val;
    }

    // Unary minus
    if (peek() === '-') {
      pos++;
      return -parsePrimary();
    }

    return parseNumber();
  }

  function parseTerm(): number {
    let left = parsePrimary();
    while (peek() === '*' || peek() === '/') {
      const op = peek();
      pos++;
      const right = parsePrimary();
      left = op === '*' ? left * right : left / right;
    }
    return left;
  }

  function parseExpr(): number {
    let left = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = peek();
      pos++;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  try {
    const result = parseExpr();
    return isFinite(result) ? result : NaN;
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
