import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addPendingImage, getPendingImages, removePendingImage } from "../utils/offlineQueue";

// Your web app's Firebase configuration using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and enable offline persistence
const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a a time.
    console.warn("Firebase persistence: Multiple tabs open, offline mode disabled.");
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the features required to enable persistence
    console.warn("Firebase persistence: Browser doesn't support offline caching.");
  }
});

// Initialize Cloud Storage
const storage = getStorage(app);

/**
 * Compresses an image File/Blob by resizing it to a max dimension and reducing JPEG quality.
 * Reduces a typical 5–10 MB camera photo to ~100–300 KB.
 * @param {File|Blob} imageFile
 * @param {number} maxDimension - Max width or height in pixels (default 1024)
 * @param {number} quality - JPEG quality 0–1 (default 0.75)
 * @returns {Promise<Blob>}
 */
const compressImage = (imageFile, maxDimension = 1024, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(imageFile);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width >= height) {
          height = Math.round((height / width) * maxDimension);
          width = maxDimension;
        } else {
          width = Math.round((width / height) * maxDimension);
          height = maxDimension;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      }, "image/jpeg", quality);
    };
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Internal helper: upload a Blob directly to Firebase Storage and return the download URL.
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
const uploadBlobToStorage = async (blob) => {
  const uniqueId = uuidv4();
  const filename = `scans/${Date.now()}-${uniqueId}.jpg`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
  return await getDownloadURL(storageRef);
};

/**
 * Uploads an image File/Blob to Firebase Storage and returns the public download URL.
 * If the device is offline and a docId is provided, the compressed image is queued
 * in localStorage for automatic upload when connectivity is restored.
 * @param {File|Blob} imageFile - The captured image from the camera
 * @param {string|null} docId  - Optional Firestore doc ID to update once the image syncs
 * @returns {Promise<string|null>} Download URL, or null if queued for later
 */
export const uploadImageToStorage = async (imageFile, docId = null) => {
  if (!imageFile) throw new Error("No image file provided for upload.");

  // Always compress first (5 MB → ~150 KB)
  const compressed = await compressImage(imageFile);

  // If offline and we have a doc to update, queue the image for later
  if (!navigator.onLine && docId) {
    await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        addPendingImage(docId, e.target.result);
        resolve();
      };
      reader.onerror = reject;
      reader.readAsDataURL(compressed);
    });
    return null; // URL will be set when synced
  }

  return await uploadBlobToStorage(compressed);
};

/**
 * Uploads all images that were queued while offline.
 * Call this when the device comes back online.
 * @returns {Promise<number>} Number of images successfully synced
 */
export const syncPendingImages = async () => {
  if (!navigator.onLine) return 0;
  const pending = getPendingImages();
  if (!pending.length) return 0;

  let synced = 0;
  for (const item of pending) {
    try {
      // Convert base64 data URL back to a Blob and upload
      const response = await fetch(item.dataUrl);
      const blob = await response.blob();
      const imageUrl = await uploadBlobToStorage(blob);
      await updateScanImageUrl(item.docId, imageUrl);
      removePendingImage(item.docId);
      synced++;
    } catch (err) {
      console.warn(`AgriScan: failed to sync queued image for doc ${item.docId}:`, err);
    }
  }
  return synced;
};

/**
 * Saves farmer feedback for a diagnosis.
 * @param {string} docId
 * @param {'helpful'|'not_helpful'} feedback
 */
export const submitFeedback = async (docId, feedback) => {
  try {
    await updateDoc(doc(db, "scans", docId), {
      feedback,
      feedbackAt: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("AgriScan: could not save feedback:", e);
  }
};

/**
 * Saves the crop scan analysis data to Firestore.
 * @param {Object} data - The scan data (imageUrl, disease, confidence, treatment, etc.)
 * @returns {Promise<string>} The created document ID
 */
export const saveScanHistory = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "scans"), {
      ...data,
      timestamp: new Date().toISOString(),
      syncedWithServer: true // If offline, Firestore handles it under the hood but we'll store this flag
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

/**
 * Updates an existing scan document with an image URL once the upload completes.
 * @param {string} docId - The Firestore document ID
 * @param {string} imageUrl - The Firebase Storage download URL
 */
export const updateScanImageUrl = async (docId, imageUrl) => {
  try {
    await updateDoc(doc(db, "scans", docId), { imageUrl });
  } catch (e) {
    console.warn("Could not update scan with image URL:", e);
  }
};

/**
 * Fetches all scan history documents from Firestore, newest first.
 * @returns {Promise<Array>} Array of scan objects
 */
export const getScans = async () => {
  const q = query(collection(db, "scans"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Deletes a scan document from Firestore.
 * @param {string} docId
 */
export const deleteScan = async (docId) => {
  await deleteDoc(doc(db, "scans", docId));
};

export { app, db, storage };
