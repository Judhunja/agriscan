import React from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'sw', label: 'Kiswahili', shortLabel: 'SW' },
];

const LanguageToggle = ({ currentLanguage = 'en', onChange, showFullLabel = false }) => {
  const handleSelect = (code) => {
    if (code === currentLanguage) return;
    if (typeof onChange === 'function') {
      onChange(code);
    }
  };

  return (
    <div
      className="language-toggle"
      role="group"
      aria-label="Select language"
    >
      {LANGUAGES?.map((lang) => {
        const isActive = currentLanguage === lang?.code;
        return (
          <button
            key={lang?.code}
            className={`language-toggle-btn${isActive ? ' active' : ''}`}
            onClick={() => handleSelect(lang?.code)}
            aria-pressed={isActive}
            aria-label={`Switch to ${lang?.label}`}
            title={lang?.label}
          >
            {showFullLabel ? lang?.label : lang?.shortLabel}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageToggle;