import React from "react";
import Image from "components/AppImage";
import Icon from "components/AppIcon";
import { format } from "date-fns";

const translations = {
  en: {
    treatment: "Treatment",
    synced: "Synced",
    pending: "Pending Sync",
    confidence: "Confidence",
    viewDetails: "View Details",
    collapse: "Collapse",
    noImage: "No image available",
  },
  sw: {
    treatment: "Matibabu",
    synced: "Imesawazishwa",
    pending: "Inasubiri Kusawazishwa",
    confidence: "Uhakika",
    viewDetails: "Tazama Maelezo",
    collapse: "Funga",
    noImage: "Hakuna picha",
  },
};

const confidenceColor = (score) => {
  if (score >= 85) return "text-[var(--color-success)]";
  if (score >= 65) return "text-[var(--color-warning)]";
  return "text-[var(--color-error)]";
};

const ScanCard = ({ scan, language, isExpanded, onToggle, onSelect, isSelected, selectionMode }) => {
  const t = translations[language] || translations.en;

  const formattedDate = (() => {
    try {
      return format(new Date(scan.timestamp), "dd/MM/yyyy HH:mm");
    } catch {
      return scan.timestamp;
    }
  })();

  return (
    <div
      className={`bg-[var(--color-card)] rounded-xl border transition-all shadow-sm ${
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
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-muted)]">
          <Image
            src={scan.imageUrl}
            alt={scan.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm md:text-base text-[var(--color-foreground)] leading-tight line-clamp-1">
              {scan.disease}
            </h3>
            {/* Sync Badge */}
            <span
              className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                scan.feedbackSynced
                  ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                  : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
              }`}
            >
              <Icon
                name={scan.feedbackSynced ? "CheckCircle" : "Clock"}
                size={11}
                color="currentColor"
              />
              <span className="hidden sm:inline">{scan.feedbackSynced ? t.synced : t.pending}</span>
            </span>
          </div>

          <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{formattedDate}</p>

          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-[var(--color-muted-foreground)]">{t.confidence}:</span>
            <span className={`text-xs font-semibold ${confidenceColor(scan.confidence)}`}>
              {scan.confidence}%
            </span>
          </div>

          <p className="text-xs text-[var(--color-muted-foreground)] mt-1 line-clamp-2">
            {scan.treatment}
          </p>
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
        <div className="border-t border-[var(--color-border)] p-3 md:p-4 space-y-3">
          {/* Full Image */}
          <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden bg-[var(--color-muted)]">
            <Image
              src={scan.imageUrl}
              alt={scan.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Treatment Details */}
          <div className="bg-[var(--color-muted)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Leaf" size={16} color="var(--color-primary)" />
              <span className="text-sm font-semibold text-[var(--color-foreground)]">{t.treatment}</span>
            </div>
            <p className="text-sm text-[var(--color-foreground)] leading-relaxed whitespace-pre-line">
              {scan.treatmentFull}
            </p>
          </div>

          {/* Crop Type Tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs font-medium">
              {scan.cropType}
            </span>
            <span className="px-2.5 py-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-full text-xs font-medium">
              {scan.region}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanCard;