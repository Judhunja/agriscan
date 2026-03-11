/**
 * Applies the CORS configuration in cors.json to the Firebase Storage bucket
 * using the Firebase CLI's cached auth token (no gcloud/gsutil required).
 *
 * Usage:  node scripts/set_cors.mjs
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUCKET = "agriscan-8be1e.firebasestorage.app";
const corsPath = resolve(__dirname, "../cors.json");

// 1. Read tokens from Firebase CLI cache and refresh if needed
let token;
try {
  const home = process.env.HOME || process.env.USERPROFILE;
  const configPath = `${home}/.config/configstore/firebase-tools.json`;
  const config = JSON.parse(readFileSync(configPath, "utf-8"));
  const refreshToken = config?.tokens?.refresh_token;

  if (!refreshToken) throw new Error("No refresh_token found in Firebase CLI config.");

  // Exchange the refresh token for a new access token
  const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
      client_secret: "j9iVZfS8kkCEFUPaAeJV0sAi",
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  const refreshData = await refreshRes.json();
  if (!refreshRes.ok) throw new Error(JSON.stringify(refreshData));
  token = refreshData.access_token;
  console.log("✅  Access token refreshed.");
} catch (e) {
  console.error("Could not get access token:", e.message);
  process.exit(1);
}

if (!token) {
  console.error(
    "❌  No access token found. Make sure you are logged in: npx firebase-tools login"
  );
  process.exit(1);
}

// 2. Read the cors.json
const corsConfig = JSON.parse(readFileSync(corsPath, "utf-8"));

// 3. PATCH the bucket metadata via the Cloud Storage JSON API
const url = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(BUCKET)}?fields=cors`;

const body = JSON.stringify({ cors: corsConfig });

console.log(`Applying CORS rules to gs://${BUCKET} ...`);

const res = await fetch(url, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body,
});

const text = await res.text();

if (res.ok) {
  console.log("✅  CORS rules applied successfully!");
  console.log(text);
} else {
  console.error(`❌  Failed (HTTP ${res.status}):`, text);
  process.exit(1);
}
