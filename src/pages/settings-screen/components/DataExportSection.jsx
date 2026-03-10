import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const DataExportSection = ({ scanCount, t }) => {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 1500));
    setExporting(false);
    setExported(true);
    setTimeout(() => setExported(false), 4000);
  };

  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-md)] p-4 md:p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[rgba(45,125,50,0.1)] flex items-center justify-center flex-shrink-0">
          <Icon name="Download" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="font-semibold text-[var(--color-foreground)] text-base md:text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {t?.exportTitle}
          </h2>
          <p className="text-xs md:text-sm text-[var(--color-muted-foreground)]">{t?.exportSubtitle}</p>
        </div>
      </div>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-4">{t?.exportDesc}</p>
      <div className="bg-[var(--color-muted)] rounded-[var(--radius-sm)] p-3 mb-4 flex items-center gap-3">
        <Icon name="FileText" size={18} color="var(--color-primary)" />
        <div>
          <p className="text-sm font-medium text-[var(--color-foreground)]">{t?.exportFile}</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            {scanCount} {t?.records} &bull; CSV
          </p>
        </div>
      </div>
      {exported && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-success)] bg-[rgba(56,142,60,0.08)] rounded-[var(--radius-sm)] px-3 py-2 mb-3">
          <Icon name="CheckCircle" size={15} color="var(--color-success)" />
          {t?.exportSuccess}
        </div>
      )}
      <Button
        variant="default"
        size="sm"
        iconName="Download"
        iconPosition="left"
        loading={exporting}
        onClick={handleExport}
        disabled={scanCount === 0}
      >
        {t?.exportBtn}
      </Button>
    </div>
  );
};

export default DataExportSection;