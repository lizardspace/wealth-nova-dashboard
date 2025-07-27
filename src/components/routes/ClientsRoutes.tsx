
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ListeClientsPage from '../../pages/admin/clients/ListeClientsPage';
import ExportPage from '../../pages/admin/clients/export/ExportPage';
import NouveauClientPage from '../../pages/admin/clients/NouveauClientPage';
import ClientDetailPage from '../../pages/admin/clients/ClientDetailPage';
import DatabaseExplorerPage from '../../pages/admin/clients/DatabaseExplorerPage';
import { AdminPlaceholder } from './RouteGroups';

const ClientsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ListeClientsPage />} />
      <Route path="/export" element={<ExportPage />} />
      <Route path="/new" element={<NouveauClientPage />} />
      <Route path="/:clientId" element={<ClientDetailPage />} />
      <Route path="/:clientId/edit" element={<AdminPlaceholder title="Édition client" />} />
      <Route path="/:clientId/simulations" element={<AdminPlaceholder title="Simulations client" />} />
      <Route path="/:clientId/documents" element={<AdminPlaceholder title="Documents client" />} />
      <Route path="/:clientId/rendez-vous" element={<AdminPlaceholder title="Rendez-vous client" />} />
      <Route path="/:clientId/chat-history" element={<AdminPlaceholder title="Historique chat" />} />
      <Route path="/database" element={<DatabaseExplorerPage />} />
    </Routes>
  );
};

export default ClientsRoutes;
