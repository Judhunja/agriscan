import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const StorageSection = ({ scanCount, t, onClearData }) => {
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const usedMB = (scanCount * 0.42)?.toFixed(2);
  const totalMB = 50;
  const usedPercent = Math.min(Math.round((usedMB / totalMB) * 100), 100);

  const handleClear = async () => {
    setClearing(true);
    await new Promise(r => setTimeout(r, 1200));
    setClearing(false);
    setCleared(true);
    onClearData();
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-md)] p-4 md:p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[rgba(45,125,50,0.1)] flex items-center justify-center flex-shrink-0">
          <Icon name="Database" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="font-semibold text-[var(--color-foreground)] text-base md:text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {t?.storageTitle}
          </h2>
          <p className="text-xs md:text-sm text-[var(--color-muted-foreground)]">{t?.storageSubtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: t?.savedScans, value: scanCount, icon: 'Image' },
          { label: t?.usedSpace, value: `${usedMB} MB`, icon: 'HardDrive' },
          { label: t?.freeSpace, value: `${(totalMB - usedMB)?.toFixed(2)} MB`, icon: 'Layers' },
        ]?.map((stat, i) => (
          <div key={i} className="bg-[var(--color-muted)] rounded-[var(--radius-sm)] p-3 text-center">
            <Icon name={stat?.icon} size={18} color="var(--color-primary)" className="mx-auto mb-1" />
            <p className="text-base md:text-lg font-bold text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-data)' }}>{stat?.value}</p>
            <p className="text-xs text-[var(--color-muted-foreground)] leading-tight mt-0.5">{stat?.label}</p>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-xs text-[var(--color-muted-foreground)] mb-1">
          <span>{t?.storageUsage}</span>
          <span>{usedPercent}%</span>
        </div>
        <div className="w-full h-2 bg-[var(--color-muted)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${usedPercent}%`,
              background: usedPercent > 80 ? 'var(--color-error)' : usedPercent > 60 ? 'var(--color-warning)' : 'var(--color-primary)',
            }}
          />
        </div>
      </div>
      {cleared && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-success)] bg-[rgba(56,142,60,0.08)] rounded-[var(--radius-sm)] px-3 py-2 mb-3">
          <Icon name="CheckCircle" size={15} color="var(--color-success)" />
          {t?.dataCleared}
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        iconName="Trash2"
        iconPosition="left"
        loading={clearing}
        onClick={handleClear}
        disabled={scanCount === 0}
      >
        {t?.clearOldData}
      </Button>
    </div>
  );
};

export default StorageSection;