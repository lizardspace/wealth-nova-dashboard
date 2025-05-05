
import React from 'react';
import { Route } from 'react-router-dom';
import RolesPage from '../../pages/admin/settings/RolesPage';
import PlatformPage from '../../pages/admin/settings/PlatformPage';
import SecurityPage from '../../pages/admin/settings/SecurityPage';

// Simple placeholder component for routes not yet implemented
const AdminPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500">Cette page est en cours de développement.</p>
  </div>
);

const SettingsRoutes = () => {
  return (
    <>
      <Route path="/admin/parametres/roles" element={<RolesPage />} />
      <Route path="/admin/parametres/roles/:id" element={<AdminPlaceholder title="Détail utilisateur" />} />
      <Route path="/admin/parametres/roles/new" element={<AdminPlaceholder title="Nouvel utilisateur" />} />
      <Route path="/admin/parametres/plateforme" element={<PlatformPage />} />
      <Route path="/admin/parametres/securite" element={<SecurityPage />} />
      <Route path="/admin/parametres/historique-acces" element={<AdminPlaceholder title="Journal connexions" />} />
    </>
  );
};

export default SettingsRoutes;
