// src/components/routes/BudgetRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BudgetListPage from '@/pages/admin/budget/BudgetListPage';
import BudgetOverviewPage from '@/pages/admin/budget/BudgetOverviewPage';

const BudgetRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BudgetOverviewPage />} />
      <Route path="/liste" element={<BudgetListPage />} />
    </Routes>
  );
};

export default BudgetRoutes;