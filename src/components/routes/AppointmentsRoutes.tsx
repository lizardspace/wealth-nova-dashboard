
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PlanningPage from '../../pages/admin/appointments/PlanningPage';
import CalendarPage from '../../pages/admin/appointments/CalendarPage';
import HistoriquePage from '../../pages/admin/appointments/HistoriquePage';
import AgendaPage from '../../pages/admin/appointments/AgendaPage';
import { AdminPlaceholder } from './RouteGroups';

const AppointmentsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PlanningPage />} />
      <Route path="/calendrier" element={<CalendarPage />} />
      <Route path="/agenda" element={<AgendaPage />} />
      <Route path="/creneau/new" element={<AdminPlaceholder title="Nouveau créneau" />} />
      <Route path="/creneau/:id/edit" element={<AdminPlaceholder title="Modifier créneau" />} />
      <Route path="/historique" element={<HistoriquePage />} />
    </Routes>
  );
};

export default AppointmentsRoutes;
