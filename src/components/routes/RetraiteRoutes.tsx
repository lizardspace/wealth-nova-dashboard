// src/components/routes/RetraiteRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RetraiteListPage from '@/pages/admin/retraite/RetraiteListPage';
import RetraiteOverviewPage from '@/pages/admin/retraite/RetraiteOverviewPage';

const RetraiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RetraiteOverviewPage />} />
      <Route path="/liste" element={<RetraiteListPage />} />
    </Routes>
  );
};

export default RetraiteRoutes;