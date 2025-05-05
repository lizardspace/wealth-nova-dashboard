
import React from 'react';
import { Route } from 'react-router-dom';
import PlanningPage from '../../pages/admin/appointments/PlanningPage';
import CalendarPage from '../../pages/admin/appointments/CalendarPage';
import HistoriquePage from '../../pages/admin/appointments/HistoriquePage';
import AgendaPage from '../../pages/admin/appointments/AgendaPage';
import { AdminPlaceholder } from './RouteGroups';

const AppointmentsRoutes = () => {
  return (
    <>
      <Route path="/admin/rendez-vous" element={<PlanningPage />} />
      <Route path="/admin/rendez-vous/calendrier" element={<CalendarPage />} />
      <Route path="/admin/rendez-vous/agenda" element={<AgendaPage />} />
      <Route path="/admin/rendez-vous/creneau/new" element={<AdminPlaceholder title="Nouveau créneau" />} />
      <Route path="/admin/rendez-vous/creneau/:id/edit" element={<AdminPlaceholder title="Modifier créneau" />} />
      <Route path="/admin/rendez-vous/historique" element={<HistoriquePage />} />
    </>
  );
};

export default AppointmentsRoutes;
