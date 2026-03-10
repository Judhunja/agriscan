import React, { useState, useEffect } from 'react';
import BottomTabNavigation from 'components/ui/BottomTabNavigation';
import OfflineStatusBanner from 'components/ui/OfflineStatusBanner';
import Icon from 'components/AppIcon';
import LanguageSection from './components/LanguageSection';
import OfflineStatusSection from './components/OfflineStatusSection';
import StorageSection from './components/StorageSection';
import AppInfoSection from './components/AppInfoSection';
import NotificationsSection from './components/NotificationsSection';
import DataExportSection from './components/DataExportSection';

const TRANSLATIONS = {
  en: {
    pageTitle: 'Settings',
    pageSubtitle: 'Configure your AgriScan app',
    languageTitle: 'Language',
    languageSubtitle: 'Choose your preferred language',
    selectLanguage: 'App Language',
    languageNote: 'Language changes apply immediately across all screens.',
    offlineTitle: 'Offline Status',
    offlineSubtitle: 'Connectivity and cache readiness',
    connectionStatus: 'Connection',
    connected: 'Connected',
    offline: 'Offline',
    modelCache: 'Disease Model',
    modelCached: 'Cached & Ready',
    syncStatus: 'Data Sync',
    syncReady: 'Up to date',
    syncPending: 'Pending sync',
    storageTitle: 'Storage',
    storageSubtitle: 'AgriScanDB usage statistics',
    savedScans: 'Saved Scans',
    usedSpace: 'Used Space',
    freeSpace: 'Free Space',
    storageUsage: 'Storage used',
    clearOldData: 'Clear Old Data',
    dataCleared: 'Old scan data cleared successfully.',
    appInfoTitle: 'App Information',
    appInfoSubtitle: 'Version and system details',
    appVersion: 'App Version',
    buildDate: 'Build Date',
    pwaStatus: 'PWA Status',
    installed: 'Installed',
    swCache: 'Service Worker',
    active: 'Active',
    modelVersion: 'Model Version',
    supportedCrops: 'Supported Crops',
    cropsValue: 'Maize, Coffee',
    notifTitle: 'Notifications',
    notifSubtitle: 'Sync and report reminders',
    syncReminder: 'Sync Reminder',
    syncReminderDesc: 'Remind when unsynced scans exist',
    exportReady: 'Export Ready',
    exportReadyDesc: 'Notify when export is complete',
    weeklyReport: 'Weekly Report',
    weeklyReportDesc: 'Summary of weekly scan activity',
    exportTitle: 'Data Export',
    exportSubtitle: 'Share data with extension services',
    exportDesc: 'Export your scan history as a CSV file for agricultural extension officers.',
    exportFile: 'agriscan_history.csv',
    records: 'records',
    exportSuccess: 'Export file ready for download.',
    exportBtn: 'Export Data',
  },
  sw: {
    pageTitle: 'Mipangilio',
    pageSubtitle: 'Sanidi programu yako ya AgriScan',
    languageTitle: 'Lugha',
    languageSubtitle: 'Chagua lugha unayopendelea',
    selectLanguage: 'Lugha ya Programu',
    languageNote: 'Mabadiliko ya lugha yanaonekana mara moja kwenye skrini zote.',
    offlineTitle: 'Hali ya Nje ya Mtandao',
    offlineSubtitle: 'Muunganiko na utayari wa akiba',
    connectionStatus: 'Muunganiko',
    connected: 'Imeunganishwa',
    offline: 'Nje ya Mtandao',
    modelCache: 'Mfano wa Ugonjwa',
    modelCached: 'Imehifadhiwa',
    syncStatus: 'Usawazishaji',
    syncReady: 'Imesasishwa',
    syncPending: 'Inasubiri',
    storageTitle: 'Hifadhi',
    storageSubtitle: 'Takwimu za matumizi ya AgriScanDB',
    savedScans: 'Uchunguzi Uliohifadhiwa',
    usedSpace: 'Nafasi Iliyotumika',
    freeSpace: 'Nafasi Iliyobaki',
    storageUsage: 'Hifadhi iliyotumika',
    clearOldData: 'Futa Data ya Zamani',
    dataCleared: 'Data ya zamani imefutwa.',
    appInfoTitle: 'Maelezo ya Programu',
    appInfoSubtitle: 'Toleo na maelezo ya mfumo',
    appVersion: 'Toleo la Programu',
    buildDate: 'Tarehe ya Ujenzi',
    pwaStatus: 'Hali ya PWA',
    installed: 'Imewekwa',
    swCache: 'Mfanyakazi wa Huduma',
    active: 'Inafanya Kazi',
    modelVersion: 'Toleo la Mfano',
    supportedCrops: 'Mazao Yanayoungwa Mkono',
    cropsValue: 'Mahindi, Kahawa',
    notifTitle: 'Arifa',
    notifSubtitle: 'Vikumbusho vya usawazishaji',
    syncReminder: 'Kikumbusho cha Usawazishaji',
    syncReminderDesc: 'Kumbuka wakati uchunguzi haujasawazishwa',
    exportReady: 'Usafirishaji Tayari',
    exportReadyDesc: 'Arifu usafirishaji ukikamilika',
    weeklyReport: 'Ripoti ya Kila Wiki',
    weeklyReportDesc: 'Muhtasari wa shughuli za wiki',
    exportTitle: 'Usafirishaji wa Data',
    exportSubtitle: 'Shiriki data na huduma za ugani',
    exportDesc: 'Safirisha historia ya uchunguzi wako kama faili la CSV kwa maafisa wa ugani.',
    exportFile: 'agriscan_historia.csv',
    records: 'rekodi',
    exportSuccess: 'Faili la usafirishaji liko tayari.',
    exportBtn: 'Safirisha Data',
  },
};

const SettingsScreen = () => {
  const [language, setLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [scanCount, setScanCount] = useState(14);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const t = TRANSLATIONS?.[language] || TRANSLATIONS?.en;

  const handleClearData = () => {
    setScanCount(0);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <OfflineStatusBanner language={language} />
      {/* Header */}
      <header className="sticky top-0 z-[var(--z-navigation)] bg-[var(--color-card)] border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 h-14 md:h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
            <Icon name="Leaf" size={18} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base md:text-lg font-bold text-[var(--color-foreground)] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              {t?.pageTitle}
            </h1>
            <p className="text-xs text-[var(--color-muted-foreground)] hidden md:block">{t?.pageSubtitle}</p>
          </div>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              isOnline
                ? 'bg-[rgba(56,142,60,0.1)] text-[var(--color-success)]'
                : 'bg-[rgba(211,47,47,0.1)] text-[var(--color-error)]'
            }`}
          >
            <Icon name={isOnline ? 'Wifi' : 'WifiOff'} size={12} color="currentColor" />
            <span className="hidden sm:inline">{isOnline ? t?.connected : t?.offline}</span>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 content-with-bottom-nav">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-5">

          {/* Desktop: 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            <LanguageSection
              language={language}
              onLanguageChange={setLanguage}
              t={t}
            />
            <OfflineStatusSection isOnline={isOnline} t={t} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            <StorageSection
              scanCount={scanCount}
              t={t}
              onClearData={handleClearData}
            />
            <NotificationsSection t={t} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            <AppInfoSection t={t} />
            <DataExportSection scanCount={scanCount} t={t} />
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-[var(--color-muted-foreground)]">
            <Icon name="Leaf" size={13} color="var(--color-primary)" />
            <span>AgriScan &copy; {new Date()?.getFullYear()} &mdash; Empowering Kenyan Farmers</span>
          </div>
        </div>
      </main>
      <BottomTabNavigation language={language} />
    </div>
  );
};

export default SettingsScreen;