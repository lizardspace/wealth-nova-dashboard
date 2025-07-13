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
import BlogRoutes from './BlogRoutes';
import ArticleView from '@/pages/admin/articles/ArticleView';
import PatrimoineRoutes from './PatrimoineRoutes'; // Nouveau
import FiscaliteRoutes from './FiscaliteRoutes'; // Nouveau
import BudgetRoutes from './BudgetRoutes'; // Nouveau
import RetraiteRoutes from './RetraiteRoutes'; // Nouveau
import TrainDeVieRoutes from './TrainDeVieRoutes'; // Nouveau
import AnalyseClientsRoutes from './AnalyseClientsRoutes'; // Ajout de la nouvelle route

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
      <Route path="/articles/*" element={<BlogRoutes />} />
      <Route path="/article/:id" element={<ArticleView />} />
      
      {/* Nouvelles routes */}
      <Route path="/patrimoine/*" element={<PatrimoineRoutes />} />
      <Route path="/fiscalite/*" element={<FiscaliteRoutes />} />
      <Route path="/budgets/*" element={<BudgetRoutes />} />
      <Route path="/retraite/*" element={<RetraiteRoutes />} />
      <Route path="/train-de-vie/*" element={<TrainDeVieRoutes />} />
      <Route path="/analyse-clients/*" element={<AnalyseClientsRoutes />} />
    </Routes>
  );
};

export default AdminRoutes;