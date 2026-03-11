const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const isApiKeyConfigured = () =>
  GEMINI_API_KEY &&
  GEMINI_API_KEY !== "your-gemini-api-key-here" &&
  GEMINI_API_KEY.length > 10;

/**
 * Asks Gemini to generate a tailored, actionable treatment plan for a detected plant disease.
 * Returns null if the API key is not configured or the call fails,
 * so the caller can keep the local database treatment.
 * @param {string} diseaseName - e.g. "Tomato___Late_blight"
 * @param {number} confidence  - 0–1 confidence score from the model
 * @param {string} lang        - "en" or "sw"
 * @returns {Promise<{ disease: string, treatment: string[] } | null>}
 */
export const getTreatmentFromGemini = async (diseaseName, confidence, lang = "en") => {
  if (!isApiKeyConfigured()) return null;

  const isSw = lang === "sw";

  const formattedName = diseaseName.replace(/___/g, " - ").replace(/_/g, " ");
  const isHealthy = diseaseName.toLowerCase().includes("healthy");

  const prompt = isSw
    ? `Mmea umegunduliwa na ${isHealthy ? `hali ya afya: "${formattedName}"` : `ugonjwa: "${formattedName}"`} kwa uhakika wa ${Math.round(confidence * 100)}%.
Toa ${isHealthy ? "vidokezo 4 vya kuhifadhi afya ya mmea na kuzuia magonjwa" : "hatua 5 za matibabu zinazoweza kutekelezwa mara moja"} ambazo ni maalum kwa hali hii.
Jibu kwa Kiswahili tu. Rudisha orodha ya JSON ya vitu vya maandishi tu (array ya strings), hakuna maelezo mengine. Mfano: ["Hatua 1...", "Hatua 2..."]`
    : `A plant has been detected with ${isHealthy ? `healthy condition: "${formattedName}"` : `disease: "${formattedName}"`} at ${Math.round(confidence * 100)}% confidence.
Provide ${isHealthy ? "4 practical tips to maintain plant health and prevent disease" : "5 specific, immediately actionable treatment steps"} tailored precisely to this condition.
Reply in English only. Return a JSON array of strings only, no other text. Example: ["Step 1...", "Step 2..."]`;

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json|```/g, "").trim();

  let steps;
  try {
    steps = JSON.parse(cleaned);
    if (!Array.isArray(steps)) throw new Error("Not an array");
  } catch {
    // Fallback: split by newlines if JSON parse fails
    steps = cleaned
      .split("\n")
      .map((l) => l.replace(/^[\d\-\*\.\s]+/, "").trim())
      .filter(Boolean);
  }

  return {
    disease: formattedName,
    treatment: steps,
  };
};
