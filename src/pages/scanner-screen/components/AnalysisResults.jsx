import React from "react";
import Icon from "components/AppIcon";
import Button from "components/ui/Button";

const AnalysisResults = ({
  result,
  language,
  onSave,
  isSaved,
  isSaving,
  isEnriching,
  feedback,
  onFeedback,
}) => {
  const labels = {
    en: {
      results: "Analysis Results",
      disease: "Detected Condition",
      confidence: "Confidence",
      treatment: "Recommended Actions",
      enriching: "Generating AI treatment plan…",
      aiPowered: "AI-enhanced",
      save: "Save Scan",
      saved: "Saved!",
      saving: "Saving…",
      high: "High",
      medium: "Medium",
      low: "Low",
      feedbackPrompt: "Was this diagnosis helpful?",
      feedbackYes: "Yes, helpful",
      feedbackNo: "Not helpful",
      feedbackThanks: "Thanks for your feedback!",
    },
    sw: {
      results: "Matokeo ya Uchambuzi",
      disease: "Hali Iliyogunduliwa",
      confidence: "Uhakika",
      treatment: "Hatua Zinazopendekezwa",
      enriching: "Inaunda mpango wa matibabu wa AI…",
      aiPowered: "AI-iliyoimarishwa",
      save: "Hifadhi Uchunguzi",
      saved: "Imehifadhiwa!",
      saving: "Inahifadhi…",
      high: "Juu",
      medium: "Wastani",
      low: "Chini",
      feedbackPrompt: "Je, utambuzi huu ulikuwa wa msaada?",
      feedbackYes: "Ndiyo, ulisaidia",
      feedbackNo: "Haukusaidia",
      feedbackThanks: "Asante kwa maoni yako!",
    },
  };
  const t = labels?.[language] || labels?.en;

  const confidencePct = Math.round((result?.confidence || 0) * 100);
  const confidenceLevel =
    confidencePct >= 75 ? "high" : confidencePct >= 50 ? "medium" : "low";

  const confidenceBarClass =
    confidenceLevel === "high"
      ? "confidence-bar-high"
      : confidenceLevel === "medium"
      ? "confidence-bar-medium"
      : "confidence-bar-low";

  const confidenceTextColor =
    confidenceLevel === "high"
      ? "text-[var(--color-success)]"
      : confidenceLevel === "medium"
      ? "text-[var(--color-warning)]"
      : "text-[var(--color-error)]";

  const confidenceBadgeBg =
    confidenceLevel === "high"
      ? "bg-green-100 border border-green-200"
      : confidenceLevel === "medium"
      ? "bg-orange-100 border border-orange-200"
      : "bg-red-100 border border-red-200";

  return (
    <div className="w-full max-w-sm md:max-w-md mx-auto flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
          <Icon name="CheckCircle" size={18} color="var(--color-success)" />
        </div>
        <h3 className="text-base md:text-lg font-bold text-[var(--color-foreground)]">
          {t?.results}
        </h3>
      </div>

      {/* Disease Card */}
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 md:p-5 shadow-sm">
        <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-1">
          {t?.disease}
        </p>
        <p className="text-lg md:text-xl font-bold text-[var(--color-foreground)] leading-snug">
          {result?.disease}
        </p>

        {/* Confidence Bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[var(--color-muted-foreground)] font-medium">
              {t?.confidence}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${confidenceBadgeBg} ${confidenceTextColor}`}
            >
              {t?.[confidenceLevel]} — {confidencePct}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-[var(--color-muted)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${confidenceBarClass}`}
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Treatment Card */}
      <div className="results-treatment-card rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon name="Leaf" size={18} color="var(--color-primary)" />
            <p className="text-sm font-bold text-[var(--color-primary)]">
              {t?.treatment}
            </p>
          </div>
          {!isEnriching && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-muted-foreground)] bg-white/70 border border-[var(--color-border)] px-2 py-0.5 rounded-full">
              <Icon name="Sparkles" size={11} color="var(--color-primary)" />
              {t?.aiPowered}
            </span>
          )}
        </div>

        {isEnriching ? (
          <div className="flex items-center gap-3 py-3">
            <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <p className="text-sm text-[var(--color-muted-foreground)]">{t?.enriching}</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {result?.treatment?.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="step-badge flex-shrink-0 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm md:text-base text-[var(--color-foreground)] leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Save Button */}
      {!isSaved ? (
        <button
          disabled={isSaving}
          onClick={onSave}
          className="btn-gradient w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-white font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t?.saving}
            </>
          ) : (
            <>
              <Icon name="Save" size={18} color="white" strokeWidth={2} />
              {t?.save}
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 text-[var(--color-success)] font-bold">
          <Icon name="CheckCircle" size={18} color="var(--color-success)" />
          {t?.saved}
        </div>
      )}

      {/* Feedback — shown after save */}
      {isSaved && (
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 md:p-5 shadow-sm animate-slide-up">
          {feedback ? (
            <div className="flex items-center gap-2.5 justify-center py-1">
              <div className="w-8 h-8 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                <Icon
                  name={feedback === "helpful" ? "ThumbsUp" : "ThumbsDown"}
                  size={16}
                  color="var(--color-success)"
                />
              </div>
              <p className="text-sm font-semibold text-[var(--color-foreground)]">
                {t?.feedbackThanks}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3 justify-center">
                <Icon name="MessageCircle" size={16} color="var(--color-muted-foreground)" />
                <p className="text-sm font-semibold text-[var(--color-foreground)]">
                  {t?.feedbackPrompt}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => onFeedback?.("helpful")}
                  className="feedback-btn-yes flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                >
                  <Icon name="ThumbsUp" size={16} color="currentColor" />
                  {t?.feedbackYes}
                </button>
                <button
                  onClick={() => onFeedback?.("not_helpful")}
                  className="feedback-btn-no flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                >
                  <Icon name="ThumbsDown" size={16} color="currentColor" />
                  {t?.feedbackNo}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
