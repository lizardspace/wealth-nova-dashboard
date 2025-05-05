
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import ClientsRoutes from './ClientsRoutes';
import PortfoliosRoutes from './PortfoliosRoutes';
import ToolsRoutes from './ToolsRoutes';
import AIRoutes from './AIRoutes';
import DocumentsRoutes from './DocumentsRoutes';
import AlertesRoutes from './AlertesRoutes';
import SettingsRoutes from './SettingsRoutes';
import AppointmentsRoutes from './AppointmentsRoutes';

const AdminRoutes = () => {
  return (
    <>
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <DashboardRoutes />
      <ClientsRoutes />
      <PortfoliosRoutes />
      <ToolsRoutes />
      <AIRoutes />
      <DocumentsRoutes />
      <AlertesRoutes />
      <SettingsRoutes />
      <AppointmentsRoutes />
    </>
  );
};

export default AdminRoutes;
