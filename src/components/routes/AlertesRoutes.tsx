import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AlertesDashboardPage from '../../pages/admin/alertes/AlertesDashboardPage';
import InactiveClientsPage from '../../pages/admin/alertes/InactiveClientsPage';
import IncompleteProfilesPage from '../../pages/admin/alertes/IncompleteProfilesPage';
import { AdminPlaceholder } from './RouteGroups';
import AlertesPage from '../../pages/admin/alertes/index';

const AlertesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AlertesDashboardPage />} />
      <Route path="/inactifs" element={<InactiveClientsPage />} />
      <Route path="/profils-incomplets" element={<IncompleteProfilesPage />} />
      <Route path="/nouveaux-contacts" element={<AlertesPage />} /> {/* Nouvelle route */}
      <Route path="/projets-en-cours" element={<AdminPlaceholder title="Projets non finalisés" />} />
      <Route path="/gains-potentiels" element={<AdminPlaceholder title="Optimisations non activées" />} />
    </Routes>
  );
};

export default AlertesRoutes;