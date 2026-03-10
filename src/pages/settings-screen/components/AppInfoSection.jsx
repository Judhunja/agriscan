import React from 'react';
import Icon from 'components/AppIcon';

const AppInfoSection = ({ t }) => {
  const infoItems = [
    { label: t?.appVersion, value: 'v1.2.0', icon: 'Tag' },
    { label: t?.buildDate, value: '10/03/2026', icon: 'Calendar' },
    { label: t?.pwaStatus, value: t?.installed, icon: 'Smartphone' },
    { label: t?.swCache, value: t?.active, icon: 'Shield' },
    { label: t?.modelVersion, value: 'TFLite 2.4.1', icon: 'Cpu' },
    { label: t?.supportedCrops, value: t?.cropsValue, icon: 'Leaf' },
  ];

  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-md)] p-4 md:p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[rgba(45,125,50,0.1)] flex items-center justify-center flex-shrink-0">
          <Icon name="Info" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="font-semibold text-[var(--color-foreground)] text-base md:text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {t?.appInfoTitle}
          </h2>
          <p className="text-xs md:text-sm text-[var(--color-muted-foreground)]">{t?.appInfoSubtitle}</p>
        </div>
      </div>
      <div className="space-y-0 divide-y divide-[var(--color-border)]">
        {infoItems?.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2">
              <Icon name={item?.icon} size={15} color="var(--color-muted-foreground)" />
              <span className="text-sm text-[var(--color-muted-foreground)]">{item?.label}</span>
            </div>
            <span className="text-sm font-medium text-[var(--color-foreground)]" style={{ fontFamily: 'var(--font-caption)' }}>
              {item?.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppInfoSection;