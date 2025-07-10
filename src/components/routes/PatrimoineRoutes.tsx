// src/components/routes/PatrimoineRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AssuranceVieListPage from '@/pages/admin/patrimoine/AssuranceVieListPage';
import BienImmobilierListPage from '@/pages/admin/patrimoine/BienImmobilierListPage';
import CompteBancaireListPage from '@/pages/admin/patrimoine/CompteBancaireListPage';
import EntrepriseListPage from '@/pages/admin/patrimoine/EntrepriseListPage';
import CreditListPage from '@/pages/admin/patrimoine/CreditListPage';
import AutrePatrimoineListPage from '@/pages/admin/patrimoine/AutrePatrimoineListPage';
import PatrimoineOverviewPage from '@/pages/admin/patrimoine/PatrimoineOverviewPage';

const PatrimoineRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PatrimoineOverviewPage />} />
      <Route path="/assurance-vie" element={<AssuranceVieListPage />} />
      <Route path="/biens-immobiliers" element={<BienImmobilierListPage />} />
      <Route path="/comptes-bancaires" element={<CompteBancaireListPage />} />
      <Route path="/entreprises" element={<EntrepriseListPage />} />
      <Route path="/credits" element={<CreditListPage />} />
      <Route path="/autres-patrimoines" element={<AutrePatrimoineListPage />} />
    </Routes>
  );
};

export default PatrimoineRoutes;