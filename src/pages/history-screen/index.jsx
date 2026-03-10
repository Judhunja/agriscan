import React, { useState, useMemo } from "react";
import { format, subDays, subHours, subMinutes } from "date-fns";
import BottomTabNavigation from "components/ui/BottomTabNavigation";
import OfflineStatusBanner from "components/ui/OfflineStatusBanner";
import LanguageToggle from "components/ui/LanguageToggle";
import Icon from "components/AppIcon";
import SearchFilterBar from "./components/SearchFilterBar";
import ScanCard from "./components/ScanCard";
import EmptyState from "./components/EmptyState";
import BulkActionBar from "./components/BulkActionBar";
import StatsBar from "./components/StatsBar";

const now = new Date("2026-03-10T20:28:11");

const MOCK_SCANS = [
{
  id: 1,
  imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1c46652cc-1773174720884.png",
  imageAlt: "Close-up of maize leaves showing yellow streaks and mosaic patterns indicating Maize Streak Virus infection in a Kenyan farm field",
  disease: "Maize Streak Virus",
  treatment: "Remove infected plants immediately. Apply insecticide to control leafhopper vectors.",
  treatmentFull: `1. Remove and destroy all infected plants immediately to prevent spread.\n2. Apply systemic insecticide (e.g., Imidacloprid) to control leafhopper vectors.\n3. Plant resistant maize varieties in the next season.\n4. Maintain field hygiene by removing crop debris after harvest.\n5. Consult your local agricultural extension officer for further guidance.`,
  confidence: 92,
  timestamp: subHours(now, 2),
  feedbackSynced: true,
  cropType: "Maize",
  region: "Rift Valley"
},
{
  id: 2,
  imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1043fae14-1773174723659.png",
  imageAlt: "Coffee plant leaves with orange-brown rust pustules on the underside indicating Coffee Leaf Rust fungal disease in a highland plantation",
  disease: "Coffee Leaf Rust",
  treatment: "Apply copper-based fungicide. Prune affected branches and improve air circulation.",
  treatmentFull: `1. Apply copper-based fungicide (e.g., Copper Oxychloride) every 2–3 weeks.\n2. Prune heavily infected branches and dispose of them away from the farm.\n3. Improve air circulation by spacing plants adequately.\n4. Avoid overhead irrigation to reduce leaf wetness.\n5. Use resistant coffee varieties for replanting.`,
  confidence: 87,
  timestamp: subDays(now, 1),
  feedbackSynced: true,
  cropType: "Coffee",
  region: "Central Kenya"
},
{
  id: 3,
  imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1dfc5a862-1773174722492.png",
  imageAlt: "Maize plant showing gray leaf spot lesions with rectangular brown patches on green leaves in an East African agricultural setting",
  disease: "Gray Leaf Spot",
  treatment: "Apply foliar fungicide. Rotate crops next season to break disease cycle.",
  treatmentFull: `1. Apply foliar fungicide containing Azoxystrobin or Propiconazole.\n2. Practice crop rotation — avoid planting maize in the same field consecutively.\n3. Use certified disease-free seeds for the next planting season.\n4. Ensure proper plant spacing to reduce humidity around leaves.\n5. Monitor fields regularly during wet seasons.`,
  confidence: 78,
  timestamp: subDays(now, 3),
  feedbackSynced: false,
  cropType: "Maize",
  region: "Western Kenya"
},
{
  id: 4,
  imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_11de3f52b-1773174724630.png",
  imageAlt: "Bean plant leaves with angular brown spots and yellow halos showing Bean Common Mosaic Virus symptoms on a smallholder farm in Kenya",
  disease: "Bean Common Mosaic Virus",
  treatment: "Uproot infected plants. Use virus-free certified seeds for replanting.",
  treatmentFull: `1. Uproot and destroy all visibly infected plants.\n2. Source certified virus-free bean seeds from reputable agro-dealers.\n3. Control aphid populations using appropriate insecticides as aphids spread the virus.\n4. Avoid working in wet fields to reduce mechanical transmission.\n5. Implement a 2-season break from bean cultivation in affected plots.`,
  confidence: 71,
  timestamp: subDays(now, 5),
  feedbackSynced: false,
  cropType: "Beans",
  region: "Eastern Kenya"
},
{
  id: 5,
  imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1e7acafe4-1773070030425.png",
  imageAlt: "Healthy green maize cobs growing in a well-maintained Kenyan farm field with clear blue sky in the background",
  disease: "Northern Leaf Blight",
  treatment: "Apply triazole fungicide at early infection stage. Improve field drainage.",
  treatmentFull: `1. Apply triazole-based fungicide (e.g., Tebuconazole) at first sign of infection.\n2. Improve field drainage to reduce moisture that favors disease spread.\n3. Plant tolerant maize hybrids available from KARI or certified seed companies.\n4. Remove and burn infected crop residues after harvest.\n5. Avoid late planting which increases disease pressure.`,
  confidence: 83,
  timestamp: subDays(now, 7),
  feedbackSynced: true,
  cropType: "Maize",
  region: "Nyanza"
},
{
  id: 6,
  imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_13a897f53-1773174725438.png",
  imageAlt: "Coffee berries and leaves on a branch showing signs of Coffee Berry Disease with dark sunken lesions on green berries in a Kenyan highland farm",
  disease: "Coffee Berry Disease",
  treatment: "Apply systemic fungicide. Harvest all ripe and over-ripe berries promptly.",
  treatmentFull: `1. Apply systemic fungicide (e.g., Carbendazim) starting at early berry formation.\n2. Harvest all ripe and over-ripe berries promptly to reduce inoculum.\n3. Strip-pick infected trees and remove mummified berries from branches.\n4. Maintain proper shade management to reduce humidity.\n5. Report severe outbreaks to the Kenya Coffee Research Institute.`,
  confidence: 89,
  timestamp: subDays(now, 9),
  feedbackSynced: true,
  cropType: "Coffee",
  region: "Kirinyaga"
},
{
  id: 7,
  imageUrl: "https://img.rocket.new/generatedImages/rocket_gen_img_1dbe4c79f-1773174722892.png",
  imageAlt: "Tomato plant leaves showing late blight dark water-soaked lesions with white mold on the underside in a greenhouse setting in Kenya",
  disease: "Tomato Late Blight",
  treatment: "Remove infected foliage. Apply mancozeb fungicide every 7 days.",
  treatmentFull: `1. Remove and destroy all infected foliage and fruits immediately.\n2. Apply Mancozeb or Metalaxyl fungicide every 7 days during wet weather.\n3. Avoid overhead irrigation; use drip irrigation instead.\n4. Ensure good air circulation by staking and pruning plants.\n5. Use certified blight-resistant tomato varieties for next season.`,
  confidence: 94,
  timestamp: subMinutes(now, 45),
  feedbackSynced: false,
  cropType: "Tomato",
  region: "Nairobi"
}];


const translations = {
  en: {
    title: "Scan History",
    subtitle: "Your crop disease records",
    selectMode: "Select",
    cancelSelect: "Cancel",
    exportSuccess: "Exported successfully",
    deleteConfirm: "Delete selected scans?"
  },
  sw: {
    title: "Historia ya Uchunguzi",
    subtitle: "Rekodi za magonjwa ya mazao yako",
    selectMode: "Chagua",
    cancelSelect: "Ghairi",
    exportSuccess: "Imehamishwa kwa mafanikio",
    deleteConfirm: "Futa uchunguzi uliochaguliwa?"
  }
};

const HistoryScreen = () => {
  const [language, setLanguage] = useState(() => {
    try {return localStorage.getItem("agriscan_lang") || "en";} catch {return "en";}
  });
  const [scans, setScans] = useState(MOCK_SCANS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [expandedId, setExpandedId] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const t = translations?.[language] || translations?.en;

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
        s?.cropType?.toLowerCase()?.includes(q) ||
        s?.region?.toLowerCase()?.includes(q) ||
        format(new Date(s.timestamp), "dd/MM/yyyy")?.includes(q)
      );
    }

    if (filterStatus === "synced") result = result?.filter((s) => s?.feedbackSynced);
    if (filterStatus === "pending") result = result?.filter((s) => !s?.feedbackSynced);

    result?.sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortOrder === "oldest") return new Date(a.timestamp) - new Date(b.timestamp);
      if (sortOrder === "disease") return a?.disease?.localeCompare(b?.disease);
      return 0;
    });

    return result;
  }, [scans, searchQuery, filterStatus, sortOrder]);

  const stats = useMemo(() => {
    const weekAgo = subDays(now, 7);
    return {
      total: scans?.length,
      synced: scans?.filter((s) => s?.feedbackSynced)?.length,
      pending: scans?.filter((s) => !s?.feedbackSynced)?.length,
      thisWeek: scans?.filter((s) => new Date(s.timestamp) >= weekAgo)?.length
    };
  }, [scans]);

  const handleToggleExpand = (id) => {
    setExpandedId((prev) => prev === id ? null : id);
  };

  const handleSelectToggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next?.has(id)) next?.delete(id);else
      next?.add(id);
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

  const handleDelete = () => {
    if (window.confirm(t?.deleteConfirm)) {
      setScans((prev) => prev?.filter((s) => !selectedIds?.has(s?.id)));
      handleCancelSelection();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilterStatus("all");
  };

  const isFiltered = searchQuery?.trim() !== "" || filterStatus !== "all";

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Offline Banner */}
      <OfflineStatusBanner language={language} />
      {/* Header */}
      <header className="sticky top-0 z-[var(--z-navigation)] bg-[var(--color-card)] border-b border-[var(--color-border)] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
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
          {filteredScans?.length === 0 ?
          <EmptyState
            language={language}
            isFiltered={isFiltered}
            onClearSearch={handleClearSearch} /> :


          filteredScans?.map((scan) =>
          <ScanCard
            key={scan?.id}
            scan={scan}
            language={language}
            isExpanded={expandedId === scan?.id}
            onToggle={handleToggleExpand}
            onSelect={handleSelectToggle}
            isSelected={selectedIds?.has(scan?.id)}
            selectionMode={selectionMode} />

          )
          }
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