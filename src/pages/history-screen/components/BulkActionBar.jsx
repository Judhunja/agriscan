import React from "react";
import Icon from "components/AppIcon";

const translations = {
  en: {
    selected: (n) => `${n} selected`,
    export: "Export",
    delete: "Delete",
    cancel: "Cancel",
    selectAll: "Select All",
  },
  sw: {
    selected: (n) => `${n} zimechaguliwa`,
    export: "Hamisha",
    delete: "Futa",
    cancel: "Ghairi",
    selectAll: "Chagua Zote",
  },
};

const BulkActionBar = ({ language, selectedCount, totalCount, onExport, onDelete, onCancel, onSelectAll }) => {
  const t = translations?.[language] || translations?.en;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 px-4 pb-2">
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl p-3 flex items-center gap-2">
        <span className="text-sm font-semibold text-[var(--color-foreground)] flex-1">
          {t?.selected(selectedCount)}
        </span>

        <button
          onClick={onSelectAll}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)] transition-colors"
        >
          {allSelected ? t?.cancel : t?.selectAll}
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors"
        >
          <Icon name="Download" size={14} />
          {t?.export}
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)]/20 transition-colors"
        >
          <Icon name="Trash2" size={14} />
          {t?.delete}
        </button>

        <button
          onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-muted)] transition-colors text-[var(--color-muted-foreground)]"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;