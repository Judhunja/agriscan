import React from "react";
import Icon from "components/AppIcon";

const translations = {
  en: {
    searchPlaceholder: "Search by disease or date...",
    filterAll: "All",
    filterSynced: "Synced",
    filterPending: "Pending",
    sortNewest: "Newest First",
    sortOldest: "Oldest First",
    sortDisease: "By Disease",
    results: (n) => `${n} result${n !== 1 ? "s" : ""}`,
  },
  sw: {
    searchPlaceholder: "Tafuta kwa ugonjwa au tarehe...",
    filterAll: "Zote",
    filterSynced: "Zilizosawazishwa",
    filterPending: "Zinazosubiri",
    sortNewest: "Mpya Kwanza",
    sortOldest: "Kongwe Kwanza",
    sortDisease: "Kwa Ugonjwa",
    results: (n) => `Matokeo ${n}`,
  },
};

const SearchFilterBar = ({ language, searchQuery, setSearchQuery, filterStatus, setFilterStatus, sortOrder, setSortOrder, resultCount }) => {
  const t = translations?.[language] || translations?.en;

  const filterOptions = [
    { value: "all", label: t?.filterAll },
    { value: "synced", label: t?.filterSynced },
    { value: "pending", label: t?.filterPending },
  ];

  const sortOptions = [
    { value: "newest", label: t?.sortNewest },
    { value: "oldest", label: t?.sortOldest },
    { value: "disease", label: t?.sortDisease },
  ];

  return (
    <div className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 py-3 space-y-3">
      {/* Search Input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]">
          <Icon name="Search" size={18} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          placeholder={t?.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] placeholder:text-[var(--color-muted-foreground)]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
      {/* Filter & Sort Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {/* Filter Pills */}
        <div className="flex gap-1.5 flex-shrink-0">
          {filterOptions?.map((opt) => (
            <button
              key={opt?.value}
              onClick={() => setFilterStatus(opt?.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filterStatus === opt?.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)]"
              }`}
            >
              {opt?.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Sort Dropdown */}
        <div className="relative flex-shrink-0">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e?.target?.value)}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] cursor-pointer"
          >
            {sortOptions?.map((opt) => (
              <option key={opt?.value} value={opt?.value}>{opt?.label}</option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted-foreground)]">
            <Icon name="ChevronDown" size={14} />
          </span>
        </div>
      </div>
      {/* Result Count */}
      <p className="text-xs text-[var(--color-muted-foreground)]">{t?.results(resultCount)}</p>
    </div>
  );
};

export default SearchFilterBar;