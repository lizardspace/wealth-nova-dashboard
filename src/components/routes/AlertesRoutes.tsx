
import React from 'react';
import { Route } from 'react-router-dom';
import AlertesDashboardPage from '../../pages/admin/alertes/AlertesDashboardPage';
import InactiveClientsPage from '../../pages/admin/alertes/InactiveClientsPage';
import IncompleteProfilesPage from '../../pages/admin/alertes/IncompleteProfilesPage';

// Simple placeholder component for routes not yet implemented
const AdminPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500">Cette page est en cours de développement.</p>
  </div>
);

const AlertesRoutes = () => {
  return (
    <>
      <Route path="/admin/alertes" element={<AlertesDashboardPage />} />
      <Route path="/admin/alertes/inactifs" element={<InactiveClientsPage />} />
      <Route path="/admin/alertes/profils-incomplets" element={<IncompleteProfilesPage />} />
      <Route path="/admin/alertes/projets-en-cours" element={<AdminPlaceholder title="Projets non finalisés" />} />
      <Route path="/admin/alertes/gains-potentiels" element={<AdminPlaceholder title="Optimisations non activées" />} />
    </>
  );
};

export default AlertesRoutes;
