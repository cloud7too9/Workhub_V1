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

// ── Tokenizer-based safe math evaluator ──
// Variables are resolved during parsing (NOT via string replacement),
// so variable names like "a" or "b" can never clobber function names
// like "abs" or "max".

const MATH_FNS: Record<string, (...args: number[]) => number> = {
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  abs: Math.abs,
  sqrt: Math.sqrt,
  min: Math.min,
  max: Math.max,
};

type Token =
  | { t: 'num'; v: number }
  | { t: 'id'; v: string }
  | { t: 'op'; v: string }
  | { t: '(' }
  | { t: ')' }
  | { t: ',' };

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < src.length) {
    if (src[i] === ' ') { i++; continue; }

    // Number literal
    if (/\d/.test(src[i]!)) {
      let n = '';
      while (i < src.length && /\d/.test(src[i]!)) { n += src[i]; i++; }
      if (i < src.length && (src[i] === '.' || src[i] === ',')) {
        n += '.';
        i++;
        while (i < src.length && /\d/.test(src[i]!)) { n += src[i]; i++; }
      }
      tokens.push({ t: 'num', v: parseFloat(n) });
      continue;
    }

    // Identifier (function name or variable)
    if (/[a-zA-Z_]/.test(src[i]!)) {
      let id = '';
      while (i < src.length && /[a-zA-Z0-9_]/.test(src[i]!)) { id += src[i]; i++; }
      tokens.push({ t: 'id', v: id });
      continue;
    }

    if ('+-*/'.includes(src[i]!)) { tokens.push({ t: 'op', v: src[i]! }); i++; continue; }
    if (src[i] === '(') { tokens.push({ t: '(' }); i++; continue; }
    if (src[i] === ')') { tokens.push({ t: ')' }); i++; continue; }
    if (src[i] === ',') { tokens.push({ t: ',' }); i++; continue; }

    throw new Error(`Unexpected: ${src[i]}`);
  }
  return tokens;
}

/**
 * Recursive descent parser over tokens.
 * Grammar:
 *   expr   = term (('+' | '-') term)*
 *   term   = unary (('*' | '/') unary)*
 *   unary  = '-' unary | primary
 *   primary = NUMBER | IDENT '(' args ')' | IDENT | '(' expr ')'
 *   args   = expr (',' expr)*
 */
export function safeEval(expr: string, vars: Record<string, number>): number {
  const toks = tokenize(expr.trim());
  let pos = 0;

  function peek(): Token | undefined { return toks[pos]; }
  function advance(): Token { return toks[pos++]!; }

  function expect(type: string): Token {
    const t = advance();
    if (t.t !== type) throw new Error(`Expected ${type}, got ${t.t}`);
    return t;
  }

  function parseExpr(): number {
    let left = parseTerm();
    while (peek()?.t === 'op' && (peek()! as { t: 'op'; v: string }).v === '+' || peek()?.t === 'op' && (peek()! as { t: 'op'; v: string }).v === '-') {
      const op = (advance() as { t: 'op'; v: string }).v;
      const right = parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseTerm(): number {
    let left = parseUnary();
    while (peek()?.t === 'op' && ((peek()! as { t: 'op'; v: string }).v === '*' || (peek()! as { t: 'op'; v: string }).v === '/')) {
      const op = (advance() as { t: 'op'; v: string }).v;
      const right = parseUnary();
      left = op === '*' ? left * right : left / right;
    }
    return left;
  }

  function parseUnary(): number {
    if (peek()?.t === 'op' && (peek()! as { t: 'op'; v: string }).v === '-') {
      advance();
      return -parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    const tok = peek();
    if (!tok) throw new Error('Unexpected end');

    // Number
    if (tok.t === 'num') { advance(); return tok.v; }

    // Identifier: function call or variable
    if (tok.t === 'id') {
      advance();
      const name = tok.v;

      // Function call: name(args)
      if (peek()?.t === '(') {
        const fn = MATH_FNS[name];
        if (!fn) throw new Error(`Unknown function: ${name}`);
        expect('(');
        const args: number[] = [parseExpr()];
        while (peek()?.t === ',') { advance(); args.push(parseExpr()); }
        expect(')');
        return fn(...args);
      }

      // Variable
      if (name in vars) return vars[name]!;
      throw new Error(`Unknown variable: ${name}`);
    }

    // Parenthesized expression
    if (tok.t === '(') {
      advance();
      const val = parseExpr();
      expect(')');
      return val;
    }

    throw new Error(`Unexpected token: ${tok.t}`);
  }

  try {
    const result = parseExpr();
    // Verify entire expression was consumed
    if (pos < toks.length) throw new Error('Unexpected trailing tokens');
    return isFinite(result) ? result : NaN;
  } catch {
    return NaN;
  }
}

// ── German decimal normalization ──

/** Parse a user-entered number, accepting both "1.7" and "1,7" */
function parseLocalNumber(input: string): number {
  const normalized = input.trim().replace(',', '.');
  return parseFloat(normalized);
}

/** Execute a full operation with user inputs, returns null on invalid input */
export function executeOperation(
  op: Operation,
  inputs: Record<string, string>,
): ComputedResult | null {
  const vars: Record<string, number> = {};

  for (const f of op.fields) {
    const raw = f.type === 'fixed' ? f.fixedValue : (inputs[f.key] ?? '');
    const val = parseLocalNumber(raw);
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
