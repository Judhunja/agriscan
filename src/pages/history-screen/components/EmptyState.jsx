import React from "react";
import Icon from "components/AppIcon";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    title: "No Scans Yet",
    subtitle: "Start scanning your crops to track disease history and get treatment recommendations.",
    cta: "Scan a Crop",
    noResults: "No matching scans",
    noResultsSubtitle: "Try adjusting your search or filter criteria.",
    clearSearch: "Clear Search",
  },
  sw: {
    title: "Hakuna Uchunguzi Bado",
    subtitle: "Anza kuchunguza mazao yako ili kufuatilia historia ya magonjwa na kupata mapendekezo ya matibabu.",
    cta: "Chunguza Zao",
    noResults: "Hakuna uchunguzi unaofanana",
    noResultsSubtitle: "Jaribu kubadilisha utafutaji au vigezo vya kuchuja.",
    clearSearch: "Futa Utafutaji",
  },
};

const EmptyState = ({ language, isFiltered, onClearSearch }) => {
  const t = translations?.[language] || translations?.en;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--color-muted)] flex items-center justify-center mb-4">
        <Icon name={isFiltered ? "SearchX" : "Camera"} size={36} color="var(--color-muted-foreground)" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-2">
        {isFiltered ? t?.noResults : t?.title}
      </h3>
      <p className="text-sm text-[var(--color-muted-foreground)] max-w-xs mb-6">
        {isFiltered ? t?.noResultsSubtitle : t?.subtitle}
      </p>
      {isFiltered ? (
        <button
          onClick={onClearSearch}
          className="px-5 py-2.5 rounded-xl bg-[var(--color-muted)] text-[var(--color-foreground)] text-sm font-medium hover:bg-[var(--color-border)] transition-colors"
        >
          {t?.clearSearch}
        </button>
      ) : (
        <button
          onClick={() => navigate("/scanner-screen")}
          className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Icon name="Camera" size={16} color="white" />
          {t?.cta}
        </button>
      )}
    </div>
  );
};

export default EmptyState;