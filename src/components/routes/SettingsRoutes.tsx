
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RolesPage from '../../pages/admin/settings/RolesPage';
import PlatformPage from '../../pages/admin/settings/PlatformPage';
import SecurityPage from '../../pages/admin/settings/SecurityPage';
import { AdminPlaceholder } from './RouteGroups';

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="/roles" element={<RolesPage />} />
      <Route path="/roles/:id" element={<AdminPlaceholder title="Détail utilisateur" />} />
      <Route path="/roles/new" element={<AdminPlaceholder title="Nouvel utilisateur" />} />
      <Route path="/plateforme" element={<PlatformPage />} />
      <Route path="/securite" element={<SecurityPage />} />
      <Route path="/historique-acces" element={<AdminPlaceholder title="Journal connexions" />} />
    </Routes>
  );
};

export default SettingsRoutes;
