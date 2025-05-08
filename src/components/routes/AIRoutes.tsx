import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ScoresPage from '../../pages/admin/ai/ScoresPage';
import ClientScorePage from '../../pages/admin/ai/ClientScorePage';
import RecommendationsPage from '../../pages/admin/ai/RecommendationsPage';
import InteractionTrackingPage from '../../pages/admin/ai/InteractionTrackingPage';
import { AdminPlaceholder } from './RouteGroups';

const AIRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="scores" replace />} />
      <Route path="/scores" element={<ScoresPage />} />
      <Route path="/scores/:clientId" element={<ClientScorePage />} />
      <Route path="/recommandations" element={<RecommendationsPage />} />
      <Route
        path="/recommandations/:id"
        element={<AdminPlaceholder title="Détail recommandation" />}
      />
      <Route path="/suivi-interactions" element={<InteractionTrackingPage />} />
      <Route
        path="/suivi-interactions/:id"
        element={<AdminPlaceholder title="Détail interaction" />}
      />
    </Routes>
  );
};

export default AIRoutes;
