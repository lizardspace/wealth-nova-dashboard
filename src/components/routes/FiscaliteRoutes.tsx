// src/components/routes/FiscaliteRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ImpotRevenuListPage from '@/pages/admin/fiscalite/ImpotRevenuListPage';
import IfiListPage from '@/pages/admin/fiscalite/IfiListPage';
import FiscaliteOverviewPage from '@/pages/admin/fiscalite/FiscaliteOverviewPage';

const FiscaliteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FiscaliteOverviewPage />} />
      <Route path="/impot-revenu" element={<ImpotRevenuListPage />} />
      <Route path="/ifi" element={<IfiListPage />} />
    </Routes>
  );
};

export default FiscaliteRoutes;