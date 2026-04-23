import type { Bearbeiter } from '../types/bearbeiter';

const STOR_BEARBEITER = 'workhub_bearbeiter';

let _id = Date.now();
function uid() {
  return `brb_${_id++}`;
}

export function loadBearbeiter(): Bearbeiter[] {
  try {
    return JSON.parse(localStorage.getItem(STOR_BEARBEITER) ?? '[]') as Bearbeiter[];
  } catch {
    return [];
  }
}

export function saveBearbeiter(bearbeiter: Bearbeiter[]): void {
  localStorage.setItem(STOR_BEARBEITER, JSON.stringify(bearbeiter));
}

export function createBearbeiter(
  bearbeiter: Bearbeiter[],
  name: string,
): { bearbeiter: Bearbeiter[]; created: Bearbeiter } {
  const created: Bearbeiter = {
    id: uid(),
    name: name.trim(),
    active: true,
  };
  return { bearbeiter: [...bearbeiter, created], created };
}

export function updateBearbeiter(
  bearbeiter: Bearbeiter[],
  id: string,
  input: { name?: string; active?: boolean },
): Bearbeiter[] {
  return bearbeiter.map((b) =>
    b.id === id
      ? {
          ...b,
          name: input.name?.trim() ?? b.name,
          active: input.active ?? b.active,
        }
      : b,
  );
}

export function deleteBearbeiter(bearbeiter: Bearbeiter[], id: string): Bearbeiter[] {
  return bearbeiter.filter((b) => b.id !== id);
}

export function findBearbeiter(bearbeiter: Bearbeiter[], id: string): Bearbeiter | undefined {
  return bearbeiter.find((b) => b.id === id);
}
