import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";
import BottomTabNavigation from "components/ui/BottomTabNavigation";
import OfflineStatusBanner from "components/ui/OfflineStatusBanner";
import LanguageToggle from "components/ui/LanguageToggle";
import Icon from "components/AppIcon";
import SearchFilterBar from "./components/SearchFilterBar";
import ScanCard from "./components/ScanCard";
import EmptyState from "./components/EmptyState";
import BulkActionBar from "./components/BulkActionBar";
import StatsBar from "./components/StatsBar";
import { getScans, deleteScan, submitFeedback } from "../../services/firebaseService";

const now = new Date();

const translations = {
  en: {
    title: "Scan History",
    subtitle: "Your crop disease records",
    selectMode: "Select",
    cancelSelect: "Cancel",
    exportSuccess: "Exported successfully",
    deleteConfirm: "Delete selected scans?",
    loading: "Loading history…",
    loadError: "Failed to load scan history.",
  },
  sw: {
    title: "Historia ya Uchunguzi",
    subtitle: "Rekodi za magonjwa ya mazao yako",
    selectMode: "Chagua",
    cancelSelect: "Ghairi",
    exportSuccess: "Imehamishwa kwa mafanikio",
    deleteConfirm: "Futa uchunguzi uliochaguliwa?",
    loading: "Inapakia historia…",
    loadError: "Imeshindwa kupakia historia ya uchunguzi.",
  }
};

const HistoryScreen = () => {
  const [language, setLanguage] = useState(() => {
    try {return localStorage.getItem("agriscan_lang") || "en";} catch {return "en";}
  });
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [expandedId, setExpandedId] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const t = translations?.[language] || translations?.en;

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await getScans();
      setScans(data);
    } catch (err) {
      console.error("Failed to load scans:", err);
      setLoadError(t?.loadError);
    } finally {
      setIsLoading(false);
    }
  }, [t?.loadError]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    try {localStorage.setItem("agriscan_lang", lang);} catch {}
  };

  const filteredScans = useMemo(() => {
    let result = [...scans];

    if (searchQuery?.trim()) {
      const q = searchQuery?.toLowerCase();
      result = result?.filter(
        (s) =>
        s?.disease?.toLowerCase()?.includes(q) ||
        (s?.cropType || "")?.toLowerCase()?.includes(q) ||
        (s?.region || "")?.toLowerCase()?.includes(q) ||
        (s?.timestamp ? format(new Date(s.timestamp), "dd/MM/yyyy") : "")?.includes(q)
      );
    }

    if (filterStatus === "synced") result = result?.filter((s) => s?.syncedWithServer);
    if (filterStatus === "pending") result = result?.filter((s) => !s?.syncedWithServer);

    result?.sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortOrder === "oldest") return new Date(a.timestamp) - new Date(b.timestamp);
      if (sortOrder === "disease") return (a?.disease || "")?.localeCompare(b?.disease || "");
      return 0;
    });

    return result;
  }, [scans, searchQuery, filterStatus, sortOrder]);

  const stats = useMemo(() => {
    const weekAgo = subDays(now, 7);
    return {
      total: scans?.length,
      synced: scans?.filter((s) => s?.syncedWithServer)?.length,
      pending: scans?.filter((s) => !s?.syncedWithServer)?.length,
      thisWeek: scans?.filter((s) => new Date(s.timestamp) >= weekAgo)?.length
    };
  }, [scans]);

  const handleToggleExpand = (id) => {
    setExpandedId((prev) => prev === id ? null : id);
  };

  const handleSelectToggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next?.has(id)) next?.delete(id); else next?.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds?.size === filteredScans?.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredScans.map((s) => s.id)));
    }
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleExport = () => {
    alert(t?.exportSuccess);
    handleCancelSelection();
  };

  const handleDelete = async () => {
    if (window.confirm(t?.deleteConfirm)) {
      const ids = [...selectedIds];
      // Delete from Firestore
      await Promise.allSettled(ids.map((id) => deleteScan(id)));
      // Remove from local state
      setScans((prev) => prev?.filter((s) => !selectedIds?.has(s?.id)));
      handleCancelSelection();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilterStatus("all");
  };

  const handleFeedback = async (scanId, feedbackValue) => {
    // Optimistically update local state
    setScans((prev) =>
      prev.map((s) => (s.id === scanId ? { ...s, feedback: feedbackValue } : s))
    );
    await submitFeedback(scanId, feedbackValue);
  };

  const isFiltered = searchQuery?.trim() !== "" || filterStatus !== "all";

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Offline Banner */}
      <OfflineStatusBanner language={language} />
      {/* Header */}
      <header className="app-header sticky top-0 z-[var(--z-navigation)]">
        <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <div className="logo-pill w-8 h-8 rounded-lg flex items-center justify-center">
              <Icon name="Leaf" size={18} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold text-[var(--color-foreground)] font-[var(--font-heading)] leading-tight">
                {t?.title}
              </h1>
              <p className="text-xs text-[var(--color-muted-foreground)] hidden sm:block">{t?.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle currentLanguage={language} onChange={handleLanguageChange} />
            <button
              onClick={() => {
                if (selectionMode) {
                  handleCancelSelection();
                } else {
                  setSelectionMode(true);
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              selectionMode ?
              "bg-[var(--color-error)]/10 text-[var(--color-error)]" :
              "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"}`
              }>
              
              {selectionMode ? t?.cancelSelect : t?.selectMode}
            </button>
          </div>
        </div>
      </header>
      {/* Stats Bar */}
      <StatsBar language={language} stats={stats} />
      {/* Search & Filter */}
      <SearchFilterBar
        language={language}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        resultCount={filteredScans?.length} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto content-with-bottom-nav">
        <div className="max-w-3xl mx-auto w-full px-4 py-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
              <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[var(--color-muted-foreground)]">{t?.loading}</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center h-[40vh] gap-3 text-center">
              <Icon name="AlertCircle" size={36} color="var(--color-error)" />
              <p className="text-sm text-[var(--color-error)]">{loadError}</p>
              <button
                onClick={loadHistory}
                className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-medium">
                {language === "sw" ? "Jaribu tena" : "Retry"}
              </button>
            </div>
          ) : filteredScans?.length === 0 ? (
            <EmptyState
              language={language}
              isFiltered={isFiltered}
              onClearSearch={handleClearSearch} />
          ) : (
            filteredScans?.map((scan) =>
              <ScanCard
                key={scan?.id}
                scan={scan}
                language={language}
                isExpanded={expandedId === scan?.id}
                onToggle={handleToggleExpand}
                onSelect={handleSelectToggle}
                isSelected={selectedIds?.has(scan?.id)}
                selectionMode={selectionMode}
                onFeedback={handleFeedback} />
            )
          )}
        </div>
      </main>
      {/* Bulk Action Bar */}
      {selectionMode && selectedIds?.size > 0 &&
      <BulkActionBar
        language={language}
        selectedCount={selectedIds?.size}
        totalCount={filteredScans?.length}
        onExport={handleExport}
        onDelete={handleDelete}
        onCancel={handleCancelSelection}
        onSelectAll={handleSelectAll} />

      }
      {/* Bottom Navigation */}
      <BottomTabNavigation language={language} />
    </div>);

};

export default HistoryScreen;