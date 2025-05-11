import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AlertesDashboardPage from '../../pages/admin/alertes/AlertesDashboardPage';
import InactiveClientsPage from '../../pages/admin/alertes/InactiveClientsPage';
import IncompleteProfilesPage from '../../pages/admin/alertes/IncompleteProfilesPage';
import SupportRequestsAdmin from '../../pages/admin/alertes/SupportRequestsAdmin'; // Importez votre component
import { AdminPlaceholder } from './RouteGroups';

const AlertesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AlertesDashboardPage />} />
      <Route path="/inactifs" element={<InactiveClientsPage />} />
      <Route path="/profils-incomplets" element={<IncompleteProfilesPage />} />
      <Route path="/nouveaux-contacts" element={<SupportRequestsAdmin />} /> {/* Nouvelle route */}
      <Route path="/projets-en-cours" element={<AdminPlaceholder title="Projets non finalisés" />} />
      <Route path="/gains-potentiels" element={<AdminPlaceholder title="Optimisations non activées" />} />
    </Routes>
  );
};

export default AlertesRoutes;