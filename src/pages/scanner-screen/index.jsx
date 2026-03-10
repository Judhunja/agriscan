import React, { useState, useRef, useCallback } from "react";
import BottomTabNavigation from "components/ui/BottomTabNavigation";
import OfflineStatusBanner from "components/ui/OfflineStatusBanner";
import LanguageToggle from "components/ui/LanguageToggle";
import Icon from "components/AppIcon";
import CameraCapture from "./components/CameraCapture";
import ImagePreview from "./components/ImagePreview";
import AnalysisResults from "./components/AnalysisResults";

/* ─── Mock Disease Database ─── */
const DISEASE_DB = {
  en: [
    {
      disease: "Maize Streak Virus (MSV)",
      confidence: 0.91,
      treatment: [
        "Remove and destroy all infected plants immediately to prevent spread.",
        "Apply systemic insecticide (Imidacloprid 200 SL) to control leafhopper vectors.",
        "Plant resistant maize varieties such as WEMA or H614D in next season.",
        "Maintain field hygiene by removing crop residues after harvest.",
        "Consult your local agricultural extension officer for further guidance.",
      ],
    },
    {
      disease: "Coffee Leaf Rust (Hemileia vastatrix)",
      confidence: 0.87,
      treatment: [
        "Apply copper-based fungicide (Copper Oxychloride 50 WP) every 14 days.",
        "Prune heavily infected branches and dispose of them away from the farm.",
        "Improve air circulation by thinning shade trees around coffee plants.",
        "Avoid overhead irrigation to reduce leaf wetness duration.",
        "Monitor plants weekly and record infection progress for better management.",
      ],
    },
    {
      disease: "Maize Gray Leaf Spot",
      confidence: 0.78,
      treatment: [
        "Apply foliar fungicide (Mancozeb 80 WP) at first sign of infection.",
        "Rotate crops — avoid planting maize in the same field consecutively.",
        "Use certified disease-free seeds from reputable agro-dealers.",
        "Ensure proper plant spacing (75cm x 25cm) for adequate air circulation.",
        "Collect and burn infected crop debris after harvest.",
      ],
    },
    {
      disease: "Healthy Crop — No Disease Detected",
      confidence: 0.95,
      treatment: [
        "Your crop appears healthy. Continue regular monitoring every 7 days.",
        "Maintain balanced fertilization using DAP at planting and CAN top-dressing.",
        "Ensure consistent irrigation especially during dry spells.",
        "Keep field free of weeds that may harbor pests and diseases.",
      ],
    },
  ],
  sw: [
    {
      disease: "Virusi vya Maize Streak (MSV)",
      confidence: 0.91,
      treatment: [
        "Ondoa na uharibu mimea yote iliyoambukizwa mara moja kuzuia kuenea.",
        "Tumia dawa ya kuua wadudu (Imidacloprid 200 SL) kudhibiti wadudu wanaoeneza ugonjwa.",
        "Panda aina za mahindi zinazostahimili kama WEMA au H614D msimu ujao.",
        "Dumisha usafi wa shamba kwa kuondoa mabaki ya mazao baada ya mavuno.",
        "Wasiliana na afisa wa kilimo wa eneo lako kwa mwongozo zaidi.",
      ],
    },
    {
      disease: "Kutu ya Majani ya Kahawa (Hemileia vastatrix)",
      confidence: 0.87,
      treatment: [
        "Tumia dawa ya ukungu yenye shaba (Copper Oxychloride 50 WP) kila siku 14.",
        "Kata matawi yaliyoambukizwa sana na yatupe mbali na shamba.",
        "Boresha mzunguko wa hewa kwa kupunguza miti ya kivuli karibu na kahawa.",
        "Epuka umwagiliaji wa juu ili kupunguza unyevu wa majani.",
        "Angalia mimea kila wiki na rekodi maendeleo ya ugonjwa.",
      ],
    },
    {
      disease: "Madoa ya Kijivu ya Mahindi",
      confidence: 0.78,
      treatment: [
        "Tumia dawa ya ukungu (Mancozeb 80 WP) mara ugonjwa unapoonekana kwanza.",
        "Zungusha mazao — epuka kupanda mahindi shambani moja mfululizo.",
        "Tumia mbegu zilizoidhinishwa bila magonjwa kutoka kwa wafanyabiashara wa kilimo.",
        "Hakikisha nafasi sahihi ya kupanda (75cm x 25cm) kwa mzunguko wa hewa.",
        "Kusanya na kuchoma mabaki ya mazao yaliyoambukizwa baada ya mavuno.",
      ],
    },
    {
      disease: "Zao Zuri — Hakuna Ugonjwa Uliogunduliwa",
      confidence: 0.95,
      treatment: [
        "Zao lako linaonekana kuwa na afya. Endelea kufuatilia kila siku 7.",
        "Dumisha mbolea ya usawa ukitumia DAP wakati wa kupanda na CAN ya juu.",
        "Hakikisha umwagiliaji wa kutosha hasa wakati wa ukame.",
        "Weka shamba bila magugu ambayo yanaweza kuhifadhi wadudu na magonjwa.",
      ],
    },
  ],
};

/* ─── Mock analyzeImage function ─── */
const analyzeImage = (imageElement, lang = "en") => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const db = DISEASE_DB[lang] || DISEASE_DB.en;
      const result = db[Math.floor(Math.random() * db.length)];
      resolve(result);
    }, 2200);
  });
};

/* ─── Mock DB save ─── */
const saveToAgriScanDB = (record) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: Date.now(), ...record }), 800);
  });
};

const ScannerScreen = () => {
  const [language, setLanguage] = useState("en");
  const [imageSrc, setImageSrc] = useState(null);
  const [capturedImageEl, setCapturedImageEl] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef(null);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleImageCapture = useCallback(async (imgEl, file, dataUrl) => {
    setImageSrc(dataUrl);
    setCapturedImageEl(imgEl);
    setCapturedFile(file);
    setResult(null);
    setIsSaved(false);

    // Draw to hidden canvas
    const canvas = canvasRef?.current;
    if (canvas) {
      canvas.width = imgEl?.naturalWidth || imgEl?.width;
      canvas.height = imgEl?.naturalHeight || imgEl?.height;
      const ctx = canvas?.getContext("2d");
      ctx?.drawImage(imgEl, 0, 0);
    }

    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeImage(imgEl, language);
      setResult(analysisResult);
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [language]);

  const handleRetake = () => {
    setImageSrc(null);
    setCapturedImageEl(null);
    setCapturedFile(null);
    setResult(null);
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (!result || isSaved) return;
    setIsSaving(true);
    try {
      await saveToAgriScanDB({
        imageBlob: capturedFile,
        imageSrc,
        disease: result?.disease,
        treatment: result?.treatment,
        confidence: result?.confidence,
        timestamp: new Date()?.toISOString(),
        feedbackSynced: false,
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const headerLabels = {
    en: { appName: "AgriScan" },
    sw: { appName: "AgriScan" },
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Offline Banner */}
      <OfflineStatusBanner language={language} />
      {/* Header */}
      <header className="sticky top-0 z-[var(--z-navigation)] bg-[var(--color-card)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
        <div className="max-w-2xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <Icon name="Leaf" size={18} color="white" strokeWidth={2} />
            </div>
            <span className="text-lg font-bold text-[var(--color-foreground)] font-[var(--font-heading)]">
              {headerLabels?.[language]?.appName}
            </span>
          </div>
          <LanguageToggle currentLanguage={language} onChange={handleLanguageChange} />
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 content-with-bottom-nav">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6 md:gap-8">
          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

          {!imageSrc ? (
            <CameraCapture
              language={language}
              onImageCapture={handleImageCapture}
              isAnalyzing={isAnalyzing}
            />
          ) : (
            <div className="flex flex-col gap-6">
              <ImagePreview
                imageSrc={imageSrc}
                language={language}
                onRetake={handleRetake}
                isAnalyzing={isAnalyzing}
              />
              {result && !isAnalyzing && (
                <AnalysisResults
                  result={result}
                  language={language}
                  onSave={handleSave}
                  isSaved={isSaved}
                  isSaving={isSaving}
                />
              )}
            </div>
          )}
        </div>
      </main>
      {/* Bottom Navigation */}
      <BottomTabNavigation language={language} />
    </div>
  );
};

export default ScannerScreen;