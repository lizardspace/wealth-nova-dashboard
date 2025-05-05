
import React from 'react';
import { Route } from 'react-router-dom';
import VueGeneralePage from '../../pages/admin/dashboard/VueGeneralePage';
import EncoursPage from '../../pages/admin/dashboard/EncoursPage';
import StatsClientsPage from '../../pages/admin/dashboard/StatsClientsPage';
import AlertesPage from '../../pages/admin/dashboard/AlertesPage';
import PerformancePage from '../../pages/admin/dashboard/PerformancePage';

const DashboardRoutes = () => {
  return (
    <>
      <Route path="/admin/dashboard" element={<VueGeneralePage />} />
      <Route path="/admin/dashboard/encours" element={<EncoursPage />} />
      <Route path="/admin/dashboard/stats-clients" element={<StatsClientsPage />} />
      <Route path="/admin/dashboard/alertes" element={<AlertesPage />} />
      <Route path="/admin/dashboard/performance" element={<PerformancePage />} />
    </>
  );
};

export default DashboardRoutes;
