import type { MetalGroup } from '../types/materials';

export const metalGroups: MetalGroup[] = [
  {
    id: 'alu',
    name: 'Aluminium',
    color: '#B0C4CE',
    saw: {
      schnittgeschwindigkeit_ms: '60',
      saegedruck_sd: '1–1,5',
      saegesenkgeschwindigkeit: '3–3,5',
    },
    chipsBin: 'Alu-Späne',
    scrapStorage: '',
  },
  {
    id: 'alusi1',
    name: 'Aluminium Si1',
    color: '#8FA8B7',
    saw: {
      schnittgeschwindigkeit_ms: '45–50',
      saegedruck_sd: '3',
      saegesenkgeschwindigkeit: '3',
    },
    chipsBin: 'Alu-Späne',
    scrapStorage: '',
  },
  {
    id: 'messing',
    name: 'Messing',
    color: '#C8A84E',
    saw: {
      schnittgeschwindigkeit_ms: '60',
      saegedruck_sd: '3',
      saegesenkgeschwindigkeit: '3',
    },
    chipsBin: 'Messing-Späne',
    scrapStorage: '',
  },
  {
    id: 'stahl',
    name: 'Stahl',
    color: '#7A8A94',
    saw: {
      schnittgeschwindigkeit_ms: '50',
      saegedruck_sd: '3–4',
      saegesenkgeschwindigkeit: '3',
    },
    chipsBin: 'Stahl-Späne',
    scrapStorage: '',
  },
  {
    id: 'legierter_stahl',
    name: 'Legierter Stahl',
    color: '#5C6B73',
    saw: {
      schnittgeschwindigkeit_ms: '30',
      saegedruck_sd: '5–6',
      saegesenkgeschwindigkeit: '2,5',
    },
    chipsBin: 'Stahl-Späne',
    scrapStorage: '',
  },
  {
    id: 'va',
    name: 'Edelstahl VA',
    color: '#D4D8DC',
    saw: {
      schnittgeschwindigkeit_ms: {
        durchmesser_gt_10: '30',
        durchmesser_lt_10: '20',
      },
      saegedruck_sd: '5–6',
      saegesenkgeschwindigkeit: '2,5',
    },
    chipsBin: 'VA-Späne',
    scrapStorage: '',
  },
];
