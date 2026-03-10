import React from 'react';
import Icon from 'components/AppIcon';
import LanguageToggle from 'components/ui/LanguageToggle';

const LanguageSection = ({ language, onLanguageChange, t }) => {
  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-md)] p-4 md:p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[rgba(45,125,50,0.1)] flex items-center justify-center flex-shrink-0">
          <Icon name="Globe" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="font-semibold text-[var(--color-foreground)] text-base md:text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {t?.languageTitle}
          </h2>
          <p className="text-xs md:text-sm text-[var(--color-muted-foreground)]">{t?.languageSubtitle}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--color-foreground)]">{t?.selectLanguage}</span>
        <LanguageToggle currentLanguage={language} onChange={onLanguageChange} showFullLabel />
      </div>
      <p className="mt-3 text-xs text-[var(--color-muted-foreground)] bg-[var(--color-muted)] rounded-[var(--radius-sm)] px-3 py-2">
        {t?.languageNote}
      </p>
    </div>
  );
};

export default LanguageSection;