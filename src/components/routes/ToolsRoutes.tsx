
import React from 'react';
import { Route } from 'react-router-dom';
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
    <>
      <Route path="/admin/outils" element={<ToolsListPage />} />
      <Route path="/admin/outils/simulateurs" element={<SimulatorsListPage />} />
      <Route path="/admin/outils/simulateurs/:id" element={<SimulatorDetailPage />} />
      <Route path="/admin/outils/simulateurs/new" element={<NewSimulatorPage />} />
      <Route path="/admin/outils/produits" element={<ProductsListPage />} />
      <Route path="/admin/outils/produits/:id" element={<ProductDetailPage />} />
      <Route path="/admin/outils/produits/new" element={<NewProductPage />} />
      <Route path="/admin/outils/regles-affichage" element={<ConditionalRulesPage />} />
    </>
  );
};

export default ToolsRoutes;
