
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VueGeneralePage from '../../pages/admin/dashboard/VueGeneralePage';
import EncoursPage from '../../pages/admin/dashboard/EncoursPage';
import StatsClientsPage from '../../pages/admin/dashboard/StatsClientsPage';
import AlertesPage from '../../pages/admin/dashboard/AlertesPage';
import PerformancePage from '../../pages/admin/dashboard/PerformancePage';
import AppointmentsPage from '../../pages/admin/dashboard/AppointmentsPage';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<VueGeneralePage />} />
      <Route path="/encours" element={<EncoursPage />} />
      <Route path="/stats-clients" element={<StatsClientsPage />} />
      <Route path="/alertes" element={<AlertesPage />} />
      <Route path="/performance" element={<PerformancePage />} />
      <Route path="/rendez-vous" element={<AppointmentsPage />} />
    </Routes>
  );
};

export default DashboardRoutes;
