import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'components/AppIcon';
import { getPendingCount } from '../../utils/offlineQueue';
import { syncPendingImages } from '../../services/firebaseService';

const OfflineStatusBanner = ({ language = 'en' }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);
  const [pendingCount, setPendingCount] = useState(() => getPendingCount());

  const MESSAGES = {
    en: {
      offline: 'No internet — working offline. Scans are saved locally.',
      online: 'Back online',
      syncing: 'Syncing scan data…',
      pending: (n) => `${n} image${n > 1 ? 's' : ''} will sync when online`,
      synced: (n) => `Synced ${n} pending image${n > 1 ? 's' : ''}`,
    },
    sw: {
      offline: 'Hakuna mtandao — inafanya kazi nje ya mtandao. Uchunguzi umehifadhiwa.',
      online: 'Mtandao umepatikana',
      syncing: 'Inasawazisha data ya uchunguzi…',
      pending: (n) => `Picha ${n} zitasawazishwa ukiwa mtandaoni`,
      synced: (n) => `Picha ${n} zimesawazishwa`,
    },
  };

  const msg = MESSAGES?.[language] || MESSAGES?.en;

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setShowOnlineBanner(true);
    setIsSyncing(true);

    // Sync any queued images in the background
    syncPendingImages()
      .then((synced) => {
        setPendingCount(getPendingCount());
        setIsSyncing(false);
        // Hide banner after a short delay
        setTimeout(() => setShowOnlineBanner(false), 4000);
      })
      .catch(() => {
        setIsSyncing(false);
        setTimeout(() => setShowOnlineBanner(false), 4000);
      });
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setShowOnlineBanner(false);
    setIsSyncing(false);
    setPendingCount(getPendingCount());
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Refresh pending count periodically when offline
  useEffect(() => {
    if (!isOnline) {
      const interval = setInterval(() => setPendingCount(getPendingCount()), 5000);
      return () => clearInterval(interval);
    }
  }, [isOnline]);

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
