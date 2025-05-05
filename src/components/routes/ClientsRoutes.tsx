
import React from 'react';
import { Route } from 'react-router-dom';
import ListeClientsPage from '../../pages/admin/clients/ListeClientsPage';
import ExportDonneesPage from '../../pages/admin/clients/ExportDonneesPage';
import NouveauClientPage from '../../pages/admin/clients/NouveauClientPage';
import ClientDetailPage from '../../pages/admin/clients/ClientDetailPage';

// Simple placeholder component for routes not yet implemented
const AdminPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500">Cette page est en cours de développement.</p>
  </div>
);

const ClientsRoutes = () => {
  return (
    <>
      <Route path="/admin/clients" element={<ListeClientsPage />} />
      <Route path="/admin/clients/export" element={<ExportDonneesPage />} />
      <Route path="/admin/clients/new" element={<NouveauClientPage />} />
      <Route path="/admin/clients/:clientId" element={<ClientDetailPage />} />
      <Route path="/admin/clients/:clientId/edit" element={<AdminPlaceholder title="Édition client" />} />
      <Route path="/admin/clients/:clientId/simulations" element={<AdminPlaceholder title="Simulations client" />} />
      <Route path="/admin/clients/:clientId/documents" element={<AdminPlaceholder title="Documents client" />} />
      <Route path="/admin/clients/:clientId/rendez-vous" element={<AdminPlaceholder title="Rendez-vous client" />} />
      <Route path="/admin/clients/:clientId/chat-history" element={<AdminPlaceholder title="Historique chat" />} />
    </>
  );
};

export default ClientsRoutes;
