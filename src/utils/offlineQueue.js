/**
 * Offline image upload queue backed by localStorage.
 *
 * When the device is offline, compressed scan images (as base64 data URLs)
 * are stored here keyed by their Firestore doc ID.
 * When the device comes back online, syncPendingImages() in firebaseService
 * processes this queue and uploads each image to Firebase Storage.
 *
 * Each queue entry: { docId: string, dataUrl: string, queuedAt: number }
 */

const QUEUE_KEY = 'agriscan_pending_images';

/** Read the full pending queue from localStorage. */
export const getPendingImages = () => {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
};

/**
 * Add (or replace) a pending image for a given Firestore doc ID.
 * @param {string} docId  - Firestore document ID of the scan
 * @param {string} dataUrl - Compressed image as a base64 data URL
 * @returns {boolean} true if queued successfully
 */
export const addPendingImage = (docId, dataUrl) => {
  try {
    // Replace any existing entry for this docId
    const queue = getPendingImages().filter((item) => item.docId !== docId);
    queue.push({ docId, dataUrl, queuedAt: Date.now() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return true;
  } catch (err) {
    // localStorage may be full on very low-end devices
    console.warn('AgriScan: could not queue offline image:', err);
    return false;
  }
};

/** Remove a single entry by docId (call after a successful upload). */
export const removePendingImage = (docId) => {
  try {
    const queue = getPendingImages().filter((item) => item.docId !== docId);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {}
};

/** How many images are pending upload. */
export const getPendingCount = () => getPendingImages().length;
