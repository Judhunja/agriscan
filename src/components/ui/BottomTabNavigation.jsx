import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NAV_ITEMS = [
  {
    labelEn: 'Scan',
    labelSw: 'Changanua',
    path: '/scanner-screen',
    icon: 'Camera',
    ariaLabel: 'Scan crops for disease detection',
  },
  {
    labelEn: 'History',
    labelSw: 'Historia',
    path: '/history-screen',
    icon: 'Clock',
    ariaLabel: 'View scan history',
  },
  {
    labelEn: 'Settings',
    labelSw: 'Mipangilio',
    path: '/settings-screen',
    icon: 'Settings',
    ariaLabel: 'App settings',
  },
];

const BottomTabNavigation = ({ language = 'en' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location?.pathname);

  useEffect(() => {
    setActiveTab(location?.pathname);
  }, [location?.pathname]);

  const handleTabClick = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  const getLabel = (item) => {
    return language === 'sw' ? item?.labelSw : item?.labelEn;
  };

  const isActive = (path) => {
    return activeTab === path || location?.pathname === path;
  };

  return (
    <nav
      className="bottom-nav"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="bottom-nav-container">
        {NAV_ITEMS?.map((item) => {
          const active = isActive(item?.path);
          return (
            <button
              key={item?.path}
              className={`bottom-nav-item${active ? ' active' : ''}`}
              onClick={() => handleTabClick(item?.path)}
              aria-label={item?.ariaLabel}
              aria-current={active ? 'page' : undefined}
              title={getLabel(item)}
            >
              <span className="bottom-nav-icon-wrap">
                <Icon
                  name={item?.icon}
                  size={22}
                  color={active ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                  strokeWidth={active ? 2.5 : 2}
                />
              </span>
              <span className="bottom-nav-label">
                {getLabel(item)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabNavigation;