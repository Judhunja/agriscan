import React from 'react';
import Icon from 'components/AppIcon';

const OfflineStatusSection = ({ isOnline, t }) => {
  const statusItems = [
    {
      label: t?.connectionStatus,
      value: isOnline ? t?.connected : t?.offline,
      icon: isOnline ? 'Wifi' : 'WifiOff',
      color: isOnline ? 'var(--color-success)' : 'var(--color-error)',
      bg: isOnline ? 'rgba(56,142,60,0.1)' : 'rgba(211,47,47,0.1)',
    },
    {
      label: t?.modelCache,
      value: t?.modelCached,
      icon: 'HardDrive',
      color: 'var(--color-primary)',
      bg: 'rgba(45,125,50,0.1)',
    },
    {
      label: t?.syncStatus,
      value: isOnline ? t?.syncReady : t?.syncPending,
      icon: isOnline ? 'CheckCircle' : 'Clock',
      color: isOnline ? 'var(--color-success)' : 'var(--color-warning)',
      bg: isOnline ? 'rgba(56,142,60,0.1)' : 'rgba(245,124,0,0.1)',
    },
  ];

  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-md)] p-4 md:p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[rgba(45,125,50,0.1)] flex items-center justify-center flex-shrink-0">
          <Icon name="Signal" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="font-semibold text-[var(--color-foreground)] text-base md:text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {t?.offlineTitle}
          </h2>
          <p className="text-xs md:text-sm text-[var(--color-muted-foreground)]">{t?.offlineSubtitle}</p>
        </div>
      </div>
      <div className="space-y-3">
        {statusItems?.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
            <span className="text-sm text-[var(--color-muted-foreground)]">{item?.label}</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: item?.bg }}>
                <Icon name={item?.icon} size={14} color={item?.color} />
              </div>
              <span className="text-sm font-medium" style={{ color: item?.color, fontFamily: 'var(--font-caption)' }}>
                {item?.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfflineStatusSection;