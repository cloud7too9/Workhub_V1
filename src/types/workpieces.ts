export type RohmaterialTyp =
  | 'rundstange'
  | 'flachstange'
  | 'sechskant'
  | 'vierkant'
  | 'rohr'
  | 'blech';

export const rohmaterialTypLabels: Record<RohmaterialTyp, string> = {
  rundstange: 'Rundstange',
  flachstange: 'Flachstange',
  sechskant: 'Sechskant',
  vierkant: 'Vierkant',
  rohr: 'Rohr',
  blech: 'Blech',
};

export type ArbeitsgangPhase = 'sawing' | 'machining' | 'packing';

export const arbeitsgangPhaseLabels: Record<ArbeitsgangPhase, string> = {
  sawing: 'Sägen',
  machining: 'Bearbeitung',
  packing: 'Verpackung',
};

export interface WerkstueckArbeitsgang {
  id: string;
  name: string;
  phase: ArbeitsgangPhase;
  sequence: number;
  description?: string;
}

export interface Werkstueck {
  id: string;
  bezeichnung: string;
  materialId: string;
  rohmaterialTyp: RohmaterialTyp;
  fertigmass: string;
  saegemass: string;
  arbeitsgaenge: WerkstueckArbeitsgang[];
  createdAt: string;
  updatedAt: string;
}
