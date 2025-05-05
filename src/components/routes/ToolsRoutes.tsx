
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ToolsListPage from '../../pages/admin/tools/ToolsListPage';
import SimulatorsListPage from '../../pages/admin/tools/SimulatorsListPage';
import SimulatorDetailPage from '../../pages/admin/tools/SimulatorDetailPage';
import NewSimulatorPage from '../../pages/admin/tools/NewSimulatorPage';
import ProductsListPage from '../../pages/admin/tools/ProductsListPage';
import ProductDetailPage from '../../pages/admin/tools/ProductDetailPage';
import NewProductPage from '../../pages/admin/tools/NewProductPage';
import ConditionalRulesPage from '../../pages/admin/tools/ConditionalRulesPage';

const ToolsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ToolsListPage />} />
      <Route path="/simulateurs" element={<SimulatorsListPage />} />
      <Route path="/simulateurs/:id" element={<SimulatorDetailPage />} />
      <Route path="/simulateurs/new" element={<NewSimulatorPage />} />
      <Route path="/produits" element={<ProductsListPage />} />
      <Route path="/produits/:id" element={<ProductDetailPage />} />
      <Route path="/produits/new" element={<NewProductPage />} />
      <Route path="/regles-affichage" element={<ConditionalRulesPage />} />
    </Routes>
  );
};

export default ToolsRoutes;
