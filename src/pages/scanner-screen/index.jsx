import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BottomTabNavigation from "components/ui/BottomTabNavigation";
import OfflineStatusBanner from "components/ui/OfflineStatusBanner";
import LanguageToggle from "components/ui/LanguageToggle";
import Icon from "components/AppIcon";
import CameraCapture from "./components/CameraCapture";
import ImagePreview from "./components/ImagePreview";
import AnalysisResults from "./components/AnalysisResults";
import { uploadImageToStorage, saveScanHistory, updateScanImageUrl, submitFeedback } from "../../services/firebaseService";
import tfjsService from "../../services/tfjsService";
import { getTreatmentFromGemini } from "../../services/geminiService";

const ScannerScreen = () => {
  const [language, setLanguage] = useState("en");
  const [imageSrc, setImageSrc] = useState(null);
  const [capturedImageEl, setCapturedImageEl] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [savedDocId, setSavedDocId] = useState(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const initModel = async () => {
      try {
        await tfjsService.loadModel();
      } catch (err) {
        console.error("Failed to load model:", err);
      } finally {
        setIsModelLoading(false);
      }
    };
    initModel();
  }, []);

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
      const analysisResult = await tfjsService.predict(imgEl, language);
      setResult(analysisResult);
      setIsAnalyzing(false);

      // Enrich treatment plan via Gemini in the background
      setIsEnriching(true);
      try {
        const enriched = await getTreatmentFromGemini(
          analysisResult._rawClass || analysisResult.disease,
          analysisResult.confidence,
          language
        );
        // enriched is null when API key is not configured — keep local treatment
        if (enriched) {
          setResult((prev) => prev ? { ...prev, treatment: enriched.treatment, disease: enriched.disease } : prev);
        }
      } catch (geminiErr) {
        console.warn("Gemini enrichment failed, keeping model result:", geminiErr);
      } finally {
        setIsEnriching(false);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setIsAnalyzing(false);
    }
  }, [language]);

  const handleRetake = () => {
    setImageSrc(null);
    setCapturedImageEl(null);
    setCapturedFile(null);
    setResult(null);
    setIsSaved(false);
    setFeedback(null);
    setSavedDocId(null);
  };

  const handleSave = async () => {
    if (!result || isSaved) return;
    setIsSaving(true);
    try {
      // 1. Save scan result to Firestore immediately (fast) — no image URL yet
      const docId = await saveScanHistory({
        imageUrl: null,
        disease: result?.disease,
        treatment: result?.treatment,
        confidence: result?.confidence,
      });

      setSavedDocId(docId);
      // Mark as saved right away so the UI stops spinning
      setIsSaved(true);
      setIsSaving(false);

      // 2. Upload image in background (queues to localStorage if offline)
      if (capturedFile && docId) {
        uploadImageToStorage(capturedFile, docId)
          .then((imageUrl) => {
            if (imageUrl) updateScanImageUrl(docId, imageUrl);
          })
          .catch((err) => console.warn("Background image upload failed:", err));
      }
    } catch (err) {
      console.error("Save error:", err);
      setIsSaving(false);
    }
  };

  const handleFeedback = async (feedbackValue) => {
    setFeedback(feedbackValue);
    if (savedDocId) {
      await submitFeedback(savedDocId, feedbackValue);
    }
  };

  const headerLabels = {
    en: { appName: "AgriScan" },
    sw: { appName: "AgriScan" },
  };

  return (
    <div className="min-h-screen scan-hero flex flex-col">
      {/* Offline Banner */}
      <OfflineStatusBanner language={language} />
      {/* Header */}
      <header className="app-header sticky top-0 z-[var(--z-navigation)]">
        <div className="max-w-2xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => imageSrc ? handleRetake() : navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-muted)] transition-colors"
              aria-label="Go back">
              <Icon name="ArrowLeft" size={20} color="var(--color-foreground)" />
            </button>
            <div className="logo-pill w-8 h-8 rounded-lg flex items-center justify-center">
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

          {isModelLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
              <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[var(--color-foreground)] font-medium">
                {language === 'sw' ? 'Inapakia Model ya AI...' : 'Loading AI Model...'}
              </p>
            </div>
          ) : !imageSrc ? (
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
                  isEnriching={isEnriching}
                  feedback={feedback}
                  onFeedback={handleFeedback}
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