import React from "react";
import Icon from "components/AppIcon";

const translations = {
  en: {
    totalScans: "Total Scans",
    synced: "Synced",
    pending: "Pending",
    thisWeek: "This Week",
  },
  sw: {
    totalScans: "Jumla ya Uchunguzi",
    synced: "Zilizosawazishwa",
    pending: "Zinazosubiri",
    thisWeek: "Wiki Hii",
  },
};

const StatsBar = ({ language, stats }) => {
  const t = translations?.[language] || translations?.en;

  const items = [
    { label: t?.totalScans, value: stats?.total, icon: "BarChart2", color: "var(--color-primary)" },
    { label: t?.synced, value: stats?.synced, icon: "CheckCircle", color: "var(--color-success)" },
    { label: t?.pending, value: stats?.pending, icon: "Clock", color: "var(--color-warning)" },
    { label: t?.thisWeek, value: stats?.thisWeek, icon: "Calendar", color: "var(--color-accent)" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-[var(--color-card)] border-b border-[var(--color-border)]">
      {items?.map((item) => (
        <div key={item?.label} className="flex flex-col items-center gap-0.5">
          <Icon name={item?.icon} size={16} color={item?.color} />
          <span className="text-base md:text-lg font-bold text-[var(--color-foreground)] font-[var(--font-data)]">
            {item?.value}
          </span>
          <span className="text-[10px] md:text-xs text-[var(--color-muted-foreground)] text-center leading-tight">
            {item?.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;