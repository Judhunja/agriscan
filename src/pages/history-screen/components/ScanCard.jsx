import React from "react";
import Image from "components/AppImage";
import Icon from "components/AppIcon";
import { format } from "date-fns";

const translations = {
  en: {
    treatment: "Recommended Actions",
    synced: "Synced",
    pending: "Pending Sync",
    confidence: "Confidence",
    viewDetails: "View Details",
    collapse: "Collapse",
    noImage: "No image yet",
    feedbackPrompt: "Was this diagnosis helpful?",
    feedbackYes: "Helpful",
    feedbackNo: "Not helpful",
    feedbackThanks: "Thanks!",
  },
  sw: {
    treatment: "Hatua Zinazopendekezwa",
    synced: "Imesawazishwa",
    pending: "Inasubiri",
    confidence: "Uhakika",
    viewDetails: "Tazama Maelezo",
    collapse: "Funga",
    noImage: "Bado hakuna picha",
    feedbackPrompt: "Je, utambuzi huu ulikuwa wa msaada?",
    feedbackYes: "Ulisaidia",
    feedbackNo: "Haukusaidia",
    feedbackThanks: "Asante!",
  },
};

const ScanCard = ({
  scan,
  language,
  isExpanded,
  onToggle,
  onSelect,
  isSelected,
  selectionMode,
  onFeedback,
}) => {
  const t = translations[language] || translations.en;

  // confidence is stored as decimal 0-1; convert to pct for display
  const confidencePct = Math.round((scan.confidence || 0) * 100);
  const confidenceLevel =
    confidencePct >= 75 ? "high" : confidencePct >= 50 ? "medium" : "low";
  const confidenceTextClass =
    confidenceLevel === "high"
      ? "text-[var(--color-success)]"
      : confidenceLevel === "medium"
      ? "text-[var(--color-warning)]"
      : "text-[var(--color-error)]";
  const cardBorderClass =
    confidenceLevel === "high"
      ? "scan-card-high"
      : confidenceLevel === "medium"
      ? "scan-card-medium"
      : "scan-card-low";

  // treatment can be an array or legacy string
  const treatmentPreview = Array.isArray(scan.treatment)
    ? scan.treatment[0]
    : scan.treatment;
  const treatmentFull = Array.isArray(scan.treatment)
    ? scan.treatment
    : scan.treatment
    ? [scan.treatment]
    : [];

  const formattedDate = (() => {
    try {
      return format(new Date(scan.timestamp), "dd/MM/yyyy HH:mm");
    } catch {
      return scan.timestamp;
    }
  })();

  return (
    <div
      className={`scan-card bg-white rounded-xl border overflow-hidden ${cardBorderClass} ${
        isSelected
          ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
          : "border-[var(--color-border)]"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start gap-3 p-3 md:p-4">
        {/* Selection Checkbox */}
        {selectionMode && (
          <button
            onClick={() => onSelect(scan.id)}
            className={`mt-1 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
              isSelected
                ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                : "border-[var(--color-muted-foreground)] bg-transparent"
            }`}
          >
            {isSelected && <Icon name="Check" size={12} color="white" strokeWidth={3} />}
          </button>
        )}

        {/* Thumbnail */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color-muted)]">
          {scan.imageUrl ? (
            <Image
              src={scan.imageUrl}
              alt={`Scan of ${scan.disease}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
              <Icon name="ImageOff" size={20} color="var(--color-muted-foreground)" />
              <span className="text-[9px] text-[var(--color-muted-foreground)] text-center leading-tight px-1">
                {t.noImage}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm md:text-base text-[var(--color-foreground)] leading-tight line-clamp-2">
              {scan.disease}
            </h3>
            {/* Sync Badge */}
            <span
              className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                scan.syncedWithServer
                  ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                  : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
              }`}
            >
              <Icon
                name={scan.syncedWithServer ? "CheckCircle" : "Clock"}
                size={11}
                color="currentColor"
              />
              <span className="hidden sm:inline">
                {scan.syncedWithServer ? t.synced : t.pending}
              </span>
            </span>
          </div>

          <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{formattedDate}</p>

          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-[var(--color-muted-foreground)]">{t.confidence}:</span>
            <span className={`text-xs font-bold ${confidenceTextClass}`}>
              {confidencePct}%
            </span>
          </div>

          {treatmentPreview && (
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1 line-clamp-2 leading-relaxed">
              {treatmentPreview}
            </p>
          )}
        </div>

        {/* Expand Toggle */}
        <button
          onClick={() => onToggle(scan.id)}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-muted)] transition-colors text-[var(--color-muted-foreground)]"
          aria-label={isExpanded ? t.collapse : t.viewDetails}
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={18} />
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] p-3 md:p-4 space-y-3">
          {/* Full Image */}
          {scan.imageUrl && (
            <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden bg-[var(--color-muted)]">
              <Image
                src={scan.imageUrl}
                alt={`Scan of ${scan.disease}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Treatment Steps */}
          {treatmentFull.length > 0 && (
            <div className="results-treatment-card rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2.5">
                <Icon name="Leaf" size={16} color="var(--color-primary)" />
                <span className="text-sm font-bold text-[var(--color-primary)]">{t.treatment}</span>
              </div>
              <ul className="flex flex-col gap-2">
                {treatmentFull.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="step-badge flex-shrink-0 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-[var(--color-foreground)] leading-relaxed">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback Section */}
          <div className="bg-white border border-[var(--color-border)] rounded-xl p-3">
            {scan.feedback ? (
              <div className="flex items-center gap-2">
                <Icon
                  name={scan.feedback === "helpful" ? "ThumbsUp" : "ThumbsDown"}
                  size={14}
                  color={scan.feedback === "helpful" ? "var(--color-success)" : "var(--color-error)"}
                />
                <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">
                  {t.feedbackThanks}
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="MessageCircle" size={13} color="var(--color-muted-foreground)" />
                  <p className="text-xs font-semibold text-[var(--color-foreground)]">
                    {t.feedbackPrompt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onFeedback?.(scan.id, "helpful")}
                    className="feedback-btn-yes flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    <Icon name="ThumbsUp" size={13} color="currentColor" />
                    {t.feedbackYes}
                  </button>
                  <button
                    onClick={() => onFeedback?.(scan.id, "not_helpful")}
                    className="feedback-btn-no flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  >
                    <Icon name="ThumbsDown" size={13} color="currentColor" />
                    {t.feedbackNo}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanCard;
