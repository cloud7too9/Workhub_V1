import type {
  Werkstueck,
  WerkstueckArbeitsgang,
  RohmaterialTyp,
  ArbeitsgangPhase,
} from '../types/workpieces';

const STOR_WORKPIECES = 'workhub_workpieces';

let _id = Date.now();
function uid(prefix: string) {
  return `${prefix}_${_id++}`;
}

function now() {
  return new Date().toISOString();
}

export function loadWorkpieces(): Werkstueck[] {
  try {
    return JSON.parse(localStorage.getItem(STOR_WORKPIECES) ?? '[]') as Werkstueck[];
  } catch {
    return [];
  }
}

export function saveWorkpieces(workpieces: Werkstueck[]): void {
  localStorage.setItem(STOR_WORKPIECES, JSON.stringify(workpieces));
}

export interface CreateWorkpieceInput {
  bezeichnung: string;
  materialId: string;
  rohmaterialTyp: RohmaterialTyp;
  fertigmass: string;
  saegemass: string;
  arbeitsgaenge: CreateArbeitsgangInput[];
}

export interface CreateArbeitsgangInput {
  name: string;
  phase: ArbeitsgangPhase;
  sequence: number;
  description?: string;
}

export function createWorkpiece(
  workpieces: Werkstueck[],
  input: CreateWorkpieceInput,
): { workpieces: Werkstueck[]; workpiece: Werkstueck } {
  const ts = now();
  const workpiece: Werkstueck = {
    id: uid('wst'),
    bezeichnung: input.bezeichnung.trim(),
    materialId: input.materialId,
    rohmaterialTyp: input.rohmaterialTyp,
    fertigmass: input.fertigmass.trim(),
    saegemass: input.saegemass.trim(),
    arbeitsgaenge: input.arbeitsgaenge.map((a) => buildArbeitsgang(a)),
    createdAt: ts,
    updatedAt: ts,
  };
  return { workpieces: [...workpieces, workpiece], workpiece };
}

export function updateWorkpiece(
  workpieces: Werkstueck[],
  id: string,
  input: Partial<CreateWorkpieceInput>,
): { workpieces: Werkstueck[]; workpiece: Werkstueck } | null {
  const existing = workpieces.find((w) => w.id === id);
  if (!existing) return null;

  const updated: Werkstueck = {
    ...existing,
    bezeichnung: input.bezeichnung?.trim() ?? existing.bezeichnung,
    materialId: input.materialId ?? existing.materialId,
    rohmaterialTyp: input.rohmaterialTyp ?? existing.rohmaterialTyp,
    fertigmass: input.fertigmass?.trim() ?? existing.fertigmass,
    saegemass: input.saegemass?.trim() ?? existing.saegemass,
    arbeitsgaenge: input.arbeitsgaenge
      ? input.arbeitsgaenge.map((a) => buildArbeitsgang(a))
      : existing.arbeitsgaenge,
    updatedAt: now(),
  };

  return {
    workpieces: workpieces.map((w) => (w.id === id ? updated : w)),
    workpiece: updated,
  };
}

export function deleteWorkpiece(
  workpieces: Werkstueck[],
  id: string,
): Werkstueck[] {
  return workpieces.filter((w) => w.id !== id);
}

export function findWorkpiece(workpieces: Werkstueck[], id: string): Werkstueck | undefined {
  return workpieces.find((w) => w.id === id);
}

function buildArbeitsgang(input: CreateArbeitsgangInput): WerkstueckArbeitsgang {
  return {
    id: uid('wag'),
    name: input.name.trim(),
    phase: input.phase,
    sequence: input.sequence,
    description: input.description?.trim() || undefined,
  };
}
