import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VueGlobalePage from '../../pages/admin/portfolios/VueGlobalePage';
import EncoursReelsPage from '../../pages/admin/portfolios/EncoursReelsPage';
import EncoursTheoriquesPage from '../../pages/admin/portfolios/EncoursTheoriquesPage';
import AnalysePage from '../../pages/admin/portfolios/AnalysePage';
import { AdminPlaceholder } from './RouteGroups';

const PortfoliosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<VueGlobalePage />} />
      <Route path="/reels" element={<EncoursReelsPage />} />
      <Route path="/theoriques" element={<EncoursTheoriquesPage />} />
      <Route path="/analyse" element={<AnalysePage />} />
      <Route path="/classe-actif" element={<AdminPlaceholder title="Classes d'actifs" />} />
      <Route path="/evolution" element={<AdminPlaceholder title="Évolution portefeuilles" />} />
    </Routes>
  );
};

export default PortfoliosRoutes;
