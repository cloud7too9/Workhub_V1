/**
 * IndexedDB store for imported file blobs.
 * Files are keyed by order ID — one file per order max.
 * Metadata lives in localStorage (orderStore), blobs live here.
 */

const DB_NAME = 'workhub_files';
const DB_VERSION = 1;
const STORE_NAME = 'imports';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Save a file blob linked to an order */
export async function saveFileForOrder(orderId: string, file: File): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(file, orderId);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('[fileStore] saveFileForOrder failed:', err);
  }
}

/** Retrieve a file blob for an order (returns null if not found) */
export async function getFileForOrder(orderId: string): Promise<File | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(orderId);
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result instanceof File ? req.result : null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('[fileStore] getFileForOrder failed:', err);
    return null;
  }
}

/** Delete the file blob for an order */
export async function deleteFileForOrder(orderId: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(orderId);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('[fileStore] deleteFileForOrder failed:', err);
  }
}
