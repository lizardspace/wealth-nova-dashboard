
import React from 'react';
import { Route } from 'react-router-dom';
import DocumentsToSignPage from '../../pages/admin/documents/DocumentsToSignPage';
import DocumentsSignedPage from '../../pages/admin/documents/DocumentsSignedPage';
import DocumentsArchivePage from '../../pages/admin/documents/DocumentsArchivePage';

// Simple placeholder component for routes not yet implemented
const AdminPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500">Cette page est en cours de développement.</p>
  </div>
);

const DocumentsRoutes = () => {
  return (
    <>
      <Route path="/admin/documents/en-attente" element={<DocumentsToSignPage />} />
      <Route path="/admin/documents/signes" element={<DocumentsSignedPage />} />
      <Route path="/admin/documents/historique" element={<DocumentsArchivePage />} />
      <Route path="/admin/documents/detail/:id" element={<AdminPlaceholder title="Détail document" />} />
      <Route path="/admin/documents/modele" element={<AdminPlaceholder title="Modèles de documents" />} />
    </>
  );
};

export default DocumentsRoutes;
