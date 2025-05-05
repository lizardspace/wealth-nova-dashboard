
import React from 'react';
import { Route } from 'react-router-dom';
import PlanningPage from '../../pages/admin/appointments/PlanningPage';
import CalendarPage from '../../pages/admin/appointments/CalendarPage';
import HistoriquePage from '../../pages/admin/appointments/HistoriquePage';

// Simple placeholder component for routes not yet implemented
const AdminPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500">Cette page est en cours de développement.</p>
  </div>
);

const AppointmentsRoutes = () => {
  return (
    <>
      <Route path="/admin/rendez-vous" element={<PlanningPage />} />
      <Route path="/admin/rendez-vous/calendrier" element={<CalendarPage />} />
      <Route path="/admin/rendez-vous/creneau/new" element={<AdminPlaceholder title="Nouveau créneau" />} />
      <Route path="/admin/rendez-vous/creneau/:id/edit" element={<AdminPlaceholder title="Modifier créneau" />} />
      <Route path="/admin/rendez-vous/historique" element={<HistoriquePage />} />
    </>
  );
};

export default AppointmentsRoutes;
