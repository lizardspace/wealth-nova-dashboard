
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ScoresPage from '../../pages/admin/ai/ScoresPage';
import ClientScorePage from '../../pages/admin/ai/ClientScorePage';
import RecommendationsPage from '../../pages/admin/ai/RecommendationsPage';
import InteractionTrackingPage from '../../pages/admin/ai/InteractionTrackingPage';

// Simple placeholder component for routes not yet implemented
const AdminPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500">Cette page est en cours de développement.</p>
  </div>
);

const AIRoutes = () => {
  return (
    <>
      <Route path="/admin/ia" element={<Navigate to="/admin/ia/scores" replace />} />
      <Route path="/admin/ia/scores" element={<ScoresPage />} />
      <Route path="/admin/ia/scores/:clientId" element={<ClientScorePage />} />
      <Route path="/admin/ia/recommandations" element={<RecommendationsPage />} />
      <Route path="/admin/ia/recommandations/:id" element={<AdminPlaceholder title="Détail recommandation" />} />
      <Route path="/admin/ia/suivi-interactions" element={<InteractionTrackingPage />} />
      <Route path="/admin/ia/suivi-interactions/:id" element={<AdminPlaceholder title="Détail interaction" />} />
    </>
  );
};

export default AIRoutes;
