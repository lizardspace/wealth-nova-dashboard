
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DocumentsToSignPage from '../../pages/admin/documents/DocumentsToSignPage';
import DocumentsSignedPage from '../../pages/admin/documents/DocumentsSignedPage';
import DocumentsArchivePage from '../../pages/admin/documents/DocumentsArchivePage';
import HistoryPage from '../../pages/admin/documents/HistoryPage';
import { AdminPlaceholder } from './RouteGroups';

const DocumentsRoutes = () => {
  return (
    <Routes>
      <Route path="/en-attente" element={<DocumentsToSignPage />} />
      <Route path="/signes" element={<DocumentsSignedPage />} />
      <Route path="/historique" element={<DocumentsArchivePage />} />
      <Route path="/history/:tableName" element={<HistoryPage />} />
      <Route path="/detail/:id" element={<AdminPlaceholder title="Détail document" />} />
      <Route path="/modele" element={<AdminPlaceholder title="Modèles de documents" />} />
    </Routes>
  );
};

export default DocumentsRoutes;
