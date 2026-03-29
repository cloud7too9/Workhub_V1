import type { RechnerCard, Operation } from '../types/rechner';
import { DEFAULT_OPERATIONS } from '../data/operations';

const STOR_CARDS = 'workhub_rechner_cards';
const STOR_OPS = 'workhub_rechner_ops';

export function loadCards(): RechnerCard[] {
  try {
    return JSON.parse(localStorage.getItem(STOR_CARDS) ?? '[]') as RechnerCard[];
  } catch {
    return [];
  }
}

export function saveCards(cards: RechnerCard[]): void {
  localStorage.setItem(STOR_CARDS, JSON.stringify(cards));
}

export function loadOperations(): Operation[] {
  try {
    const raw = localStorage.getItem(STOR_OPS);
    if (raw) {
      const parsed = JSON.parse(raw) as Operation[];
      if (parsed.length > 0) return parsed;
    }
  } catch {
    // fall through
  }
  return DEFAULT_OPERATIONS;
}

export function saveOperations(ops: Operation[]): void {
  localStorage.setItem(STOR_OPS, JSON.stringify(ops));
}
