import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import SettingsScreen from './pages/settings-screen';
import HistoryScreen from './pages/history-screen';
import ScannerScreen from './pages/scanner-screen';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<HistoryScreen />} />
        <Route path="/settings-screen" element={<SettingsScreen />} />
        <Route path="/history-screen" element={<HistoryScreen />} />
        <Route path="/scanner-screen" element={<ScannerScreen />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
