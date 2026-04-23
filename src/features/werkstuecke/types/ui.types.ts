import type { RohmaterialTyp, ArbeitsgangPhase } from '@/types/workpieces';

export interface WerkstueckArbeitsgangFormData {
  name: string;
  phase: ArbeitsgangPhase;
  sequence: number;
  description: string;
}

export interface WerkstueckFormData {
  bezeichnung: string;
  materialId: string;
  rohmaterialTyp: RohmaterialTyp;
  fertigmass: string;
  saegemass: string;
  arbeitsgaenge: WerkstueckArbeitsgangFormData[];
}

export interface WerkstueckFormInitial {
  bezeichnung?: string;
  materialId?: string;
  rohmaterialTyp?: RohmaterialTyp;
  fertigmass?: string;
  saegemass?: string;
  arbeitsgaenge?: WerkstueckArbeitsgangFormData[];
}

export interface WerkstueckCardData {
  id: string;
  title: string;
  subtitle: string;
  details: { label: string; value: string }[];
  arbeitsgangCount: number;
}

export interface WerkstueckCardProps extends WerkstueckCardData {
  onEdit: () => void;
  onDelete: () => void;
}
