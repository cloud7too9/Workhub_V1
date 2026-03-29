/** Sägeparameter einer Metallgruppe */
export interface SawParams {
  schnittgeschwindigkeit_ms: string | { durchmesser_gt_10: string; durchmesser_lt_10: string };
  saegedruck_sd: string;
  saegesenkgeschwindigkeit: string;
}

/** Metallgruppe */
export interface MetalGroup {
  id: string;
  name: string;
  color: string;
  saw: SawParams;
  chipsBin: string;
  scrapStorage: string;
}

/** Einzelner Werkstoff */
export interface Material {
  id: string;
  name: string;
  groupId: string;
  notes: string;
}
