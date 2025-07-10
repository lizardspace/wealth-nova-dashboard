// src/components/routes/TrainDeVieRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TrainDeVieListPage from '@/pages/admin/traindevie/TrainDeVieListPage';
import TrainDeVieOverviewPage from '@/pages/admin/traindevie/TrainDeVieOverviewPage';

const TrainDeVieRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TrainDeVieOverviewPage />} />
      <Route path="/liste" element={<TrainDeVieListPage />} />
    </Routes>
  );
};

export default TrainDeVieRoutes;