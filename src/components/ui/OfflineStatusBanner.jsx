import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'components/AppIcon';

const OfflineStatusBanner = ({ language = 'en' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const MESSAGES = {
    en: {
      offline: 'No internet connection — working offline',
      online: 'Back online — syncing data',
      syncing: 'Syncing scan results…',
      pending: (n) => `${n} scan${n > 1 ? 's' : ''} pending sync`,
    },
    sw: {
      offline: 'Hakuna mtandao — inafanya kazi nje ya mtandao',
      online: 'Mtandao umepatikana — inasawazisha data',
      syncing: 'Inasawazisha matokeo ya uchunguzi…',
      pending: (n) => `Uchunguzi ${n} unasubiri kusawazishwa`,
    },
  };

  const msg = MESSAGES?.[language] || MESSAGES?.en;

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setShowOnlineBanner(true);
    setIsSyncing(true);
    // Simulate sync completion
    const syncTimer = setTimeout(() => {
      setIsSyncing(false);
      setPendingCount(0);
    }, 3000);
    // Hide online banner after sync
    const hideTimer = setTimeout(() => {
      setShowOnlineBanner(false);
    }, 5000);
    return () => {
      clearTimeout(syncTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setShowOnlineBanner(false);
    setIsSyncing(false);
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Don't render when online and banner dismissed
  if (isOnline && !showOnlineBanner) return null;

  const getBannerState = () => {
    if (!isOnline) return 'offline';
    if (isSyncing) return 'syncing';
    return 'online';
  };

  const bannerState = getBannerState();

  const getIcon = () => {
    if (bannerState === 'offline') return 'WifiOff';
    if (bannerState === 'syncing') return 'RefreshCw';
    return 'Wifi';
  };

  const getMessage = () => {
    if (bannerState === 'offline') {
      return pendingCount > 0 ? msg?.pending(pendingCount) : msg?.offline;
    }
    if (bannerState === 'syncing') return msg?.syncing;
    return msg?.online;
  };

  return (
    <div
      className={`offline-banner ${bannerState}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="offline-banner-content">
        <Icon
          name={getIcon()}
          size={16}
          color="currentColor"
          strokeWidth={2}
          className={bannerState === 'syncing' ? 'sync-spinning' : ''}
        />
        <span>{getMessage()}</span>
      </div>
    </div>
  );
};

export default OfflineStatusBanner;