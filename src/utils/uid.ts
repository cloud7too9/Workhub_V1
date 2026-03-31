let _counter = Date.now();

/**
 * Generate a unique string ID with an optional prefix.
 * Collision-safe within a single session.
 */
export function uid(prefix = 'id'): string {
  return `${prefix}_${_counter++}`;
}
