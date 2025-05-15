// src/components/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import ClientsRoutes from './ClientsRoutes';
import PortfoliosRoutes from './PortfoliosRoutes';
import ToolsRoutes from './ToolsRoutes';
import AIRoutes from './AIRoutes';
import DocumentsRoutes from './DocumentsRoutes';
import AlertesRoutes from './AlertesRoutes';
import SettingsRoutes from './SettingsRoutes';
import BlogRoutes from './BlogRoutes'; // Importez le nouveau composant

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/dashboard/*" element={<DashboardRoutes />} />
      <Route path="/clients/*" element={<ClientsRoutes />} />
      <Route path="/portfolios/*" element={<PortfoliosRoutes />} />
      <Route path="/tools/*" element={<ToolsRoutes />} />
      <Route path="/ia/*" element={<AIRoutes />} />
      <Route path="/documents/*" element={<DocumentsRoutes />} />
      <Route path="/alertes/*" element={<AlertesRoutes />} />
      <Route path="/settings/*" element={<SettingsRoutes />} />
      <Route path="/blog/*" element={<BlogRoutes />} />
      <Route path="/articles/*" element={<BlogRoutes />} /> {/* Modifié de /blog/* à /articles/* */}
    </Routes>
  );
};

export default AdminRoutes;