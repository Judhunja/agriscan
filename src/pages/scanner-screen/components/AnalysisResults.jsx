import React from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const AnalysisResults = ({ result, language, onSave, isSaved, isSaving }) => {
  const labels = {
    en: {
      results: "Analysis Results",
      disease: "Identified Disease",
      confidence: "Confidence",
      treatment: "Treatment Recommendations",
      save: "Save Scan",
      saved: "Saved!",
      saving: "Saving…",
      high: "High",
      medium: "Medium",
      low: "Low",
    },
    sw: {
      results: "Matokeo ya Uchambuzi",
      disease: "Ugonjwa Uliotambuliwa",
      confidence: "Uhakika",
      treatment: "Mapendekezo ya Matibabu",
      save: "Hifadhi Uchunguzi",
      saved: "Imehifadhiwa!",
      saving: "Inahifadhi…",
      high: "Juu",
      medium: "Wastani",
      low: "Chini",
    },
  };
  const t = labels?.[language] || labels?.en;

  const confidencePct = Math.round((result?.confidence || 0) * 100);
  const confidenceLevel =
    confidencePct >= 75 ? "high" : confidencePct >= 50 ? "medium" : "low";
  const confidenceColor =
    confidenceLevel === "high" ?"var(--color-success)"
      : confidenceLevel === "medium" ?"var(--color-warning)" :"var(--color-error)";
  const confidenceBg =
    confidenceLevel === "high" ?"bg-green-100 dark:bg-green-900/30"
      : confidenceLevel === "medium" ?"bg-orange-100 dark:bg-orange-900/30" :"bg-red-100 dark:bg-red-900/30";

  return (
    <div className="w-full max-w-sm md:max-w-md mx-auto flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Icon name="CheckCircle" size={22} color="var(--color-success)" />
        <h3 className="text-base md:text-lg font-bold text-[var(--color-foreground)]">{t?.results}</h3>
      </div>
      {/* Disease Card */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 md:p-5 shadow-[var(--shadow-sm)]">
        <p className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wide mb-1">{t?.disease}</p>
        <p className="text-lg md:text-xl font-bold text-[var(--color-foreground)]">{result?.disease}</p>

        {/* Confidence Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--color-muted-foreground)]">{t?.confidence}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${confidenceBg}`} style={{ color: confidenceColor }}>
              {t?.[confidenceLevel]} — {confidencePct}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-[var(--color-muted)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${confidencePct}%`, backgroundColor: confidenceColor }}
            />
          </div>
        </div>
      </div>
      {/* Treatment Card */}
      <div className="bg-[rgba(45,125,50,0.06)] border border-[rgba(45,125,50,0.2)] rounded-2xl p-4 md:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Leaf" size={18} color="var(--color-primary)" />
          <p className="text-sm font-semibold text-[var(--color-primary)]">{t?.treatment}</p>
        </div>
        <ul className="flex flex-col gap-2">
          {result?.treatment?.map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-bold mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm md:text-base text-[var(--color-foreground)]">{step}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* Save Button */}
      <Button
        variant={isSaved ? "success" : "default"}
        size="lg"
        fullWidth
        iconName={isSaved ? "CheckCircle" : "Save"}
        iconPosition="left"
        disabled={isSaved || isSaving}
        loading={isSaving}
        onClick={onSave}
      >
        {isSaving ? t?.saving : isSaved ? t?.saved : t?.save}
      </Button>
    </div>
  );
};

export default AnalysisResults;