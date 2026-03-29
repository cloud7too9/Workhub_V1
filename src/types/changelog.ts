import type { Material } from './materials';

export type ChangeAction = 'added' | 'edited' | 'deleted';

export interface ChangelogEntry {
  id: string;
  action: ChangeAction;
  materialName: string;
  groupId: string;
  timestamp: number;
  /** Previous state for undo — null if action was 'added' */
  previousState: Material | null;
  /** Current state for reference — null if action was 'deleted' */
  currentState: Material | null;
}
