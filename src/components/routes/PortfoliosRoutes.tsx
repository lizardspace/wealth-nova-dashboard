
import React from 'react';
import { Route } from 'react-router-dom';
import VueGlobalePage from '../../pages/admin/portfolios/VueGlobalePage';
import EncoursReelsPage from '../../pages/admin/portfolios/EncoursReelsPage';
import EncoursTheoriquesPage from '../../pages/admin/portfolios/EncoursTheoriquesPage';
import AnalysePage from '../../pages/admin/portfolios/AnalysePage';

// Simple placeholder component for routes not yet implemented
const AdminPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500">Cette page est en cours de développement.</p>
  </div>
);

const PortfoliosRoutes = () => {
  return (
    <>
      <Route path="/admin/portfolios" element={<VueGlobalePage />} />
      <Route path="/admin/portfolios/reels" element={<EncoursReelsPage />} />
      <Route path="/admin/portfolios/theoriques" element={<EncoursTheoriquesPage />} />
      <Route path="/admin/portfolios/analyse" element={<AnalysePage />} />
      <Route path="/admin/portfolios/classe-actif" element={<AdminPlaceholder title="Classes d'actifs" />} />
      <Route path="/admin/portfolios/evolution" element={<AdminPlaceholder title="Évolution portefeuilles" />} />
    </>
  );
};

export default PortfoliosRoutes;
