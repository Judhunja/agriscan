import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] ${
      checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted-foreground)]'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const NotificationsSection = ({ t }) => {
  const [syncReminder, setSyncReminder] = useState(true);
  const [exportReady, setExportReady] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const items = [
    { label: t?.syncReminder, desc: t?.syncReminderDesc, value: syncReminder, onChange: setSyncReminder },
    { label: t?.exportReady, desc: t?.exportReadyDesc, value: exportReady, onChange: setExportReady },
    { label: t?.weeklyReport, desc: t?.weeklyReportDesc, value: weeklyReport, onChange: setWeeklyReport },
  ];

  return (
    <div className="bg-[var(--color-card)] rounded-[var(--radius-md)] p-4 md:p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[rgba(45,125,50,0.1)] flex items-center justify-center flex-shrink-0">
          <Icon name="Bell" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="font-semibold text-[var(--color-foreground)] text-base md:text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {t?.notifTitle}
          </h2>
          <p className="text-xs md:text-sm text-[var(--color-muted-foreground)]">{t?.notifSubtitle}</p>
        </div>
      </div>
      <div className="space-y-0 divide-y divide-[var(--color-border)]">
        {items?.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-3">
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-sm font-medium text-[var(--color-foreground)]">{item?.label}</p>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{item?.desc}</p>
            </div>
            <Toggle checked={item?.value} onChange={item?.onChange} disabled={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsSection;