import type { Werkstueck } from '@/types/workpieces';
import type { Material } from '@/types/materials';
import { rohmaterialTypLabels } from '@/types/workpieces';
import type { WerkstueckCardData, WerkstueckFormInitial } from '../types/ui.types';

export function mapWorkpieceToCard(
  workpiece: Werkstueck,
  materials: Material[],
): WerkstueckCardData {
  const materialName =
    materials.find((m) => m.id === workpiece.materialId)?.name ?? '—';

  const subtitle = [
    materialName,
    rohmaterialTypLabels[workpiece.rohmaterialTyp],
    workpiece.fertigmass,
  ]
    .filter(Boolean)
    .join(' · ');

  const details: { label: string; value: string }[] = [
    { label: 'Werkstoff', value: materialName },
    { label: 'Rohmaterial', value: rohmaterialTypLabels[workpiece.rohmaterialTyp] },
    { label: 'Fertigmaß', value: workpiece.fertigmass || '—' },
    { label: 'Sägemaß', value: workpiece.saegemass || '—' },
  ];

  return {
    id: workpiece.id,
    title: workpiece.bezeichnung,
    subtitle,
    details,
    arbeitsgangCount: workpiece.arbeitsgaenge.length,
  };
}

export function mapWorkpieceToFormInitial(workpiece: Werkstueck): WerkstueckFormInitial {
  return {
    bezeichnung: workpiece.bezeichnung,
    materialId: workpiece.materialId,
    rohmaterialTyp: workpiece.rohmaterialTyp,
    fertigmass: workpiece.fertigmass,
    saegemass: workpiece.saegemass,
    arbeitsgaenge: workpiece.arbeitsgaenge.map((a) => ({
      name: a.name,
      phase: a.phase,
      sequence: a.sequence,
      description: a.description ?? '',
    })),
  };
}
