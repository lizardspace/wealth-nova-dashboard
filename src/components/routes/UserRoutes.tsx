import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '../../pages/Index';
import PortfolioPage from '../../pages/portfolio/PortfolioPage';
import AddAssetPage from '../../pages/portfolio/AddAssetPage';
import StatementPage from '../../pages/statement/StatementPage';
import SimulatorsPage from '../../pages/simulators/SimulatorsPage';
import ProductsPage from '../../pages/products/ProductsPage';
import AnalyticsPage from '../../pages/analytics/AnalyticsPage';
import AppointmentsPage from '../../pages/appointments/AppointmentsPage';
import ChatPage from '../../pages/chat/ChatPage';
import ProfilePage from '../../pages/profile/ProfilePage';
import ContactPage from '../../pages/contact/ContactPage';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/portfolio/add" element={<AddAssetPage />} />
      <Route path="/statement" element={<StatementPage />} />
      <Route path="/simulators" element={<SimulatorsPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
};

export default UserRoutes;
