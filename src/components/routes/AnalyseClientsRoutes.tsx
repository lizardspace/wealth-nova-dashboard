import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreditAnalysis from '../../pages/admin/analyse-clients/CreditAnalysis';
import InsuranceAnalysis from '../../pages/admin/analyse-clients/InsuranceAnalysis';
import UserGoals from '../../pages/admin/analyse-clients/UserGoals';
import BudgetLifestyle from '../../pages/admin/analyse-clients/BudgetLifestyle';
import TaxAnalysis from '../../pages/admin/analyse-clients/TaxAnalysis';
import InvestorProfiles from '../../pages/admin/analyse-clients/InvestorProfiles';
import PatrimonyAnalysis from '../../pages/admin/analyse-clients/PatrimonyAnalysis';
import FamilySummary from '../../pages/admin/analyse-clients/FamilySummary';

const AnalyseClientsRoutes = () => {
  return (
    <Routes>
      <Route path="/family-summary" element={<FamilySummary />} />
      <Route path="/credit-analysis" element={<CreditAnalysis />} />
      <Route path="/insurance-analysis" element={<InsuranceAnalysis />} />
      <Route path="/user-goals" element={<UserGoals />} />
      <Route path="/budget-lifestyle" element={<BudgetLifestyle />} />
      <Route path="/tax-analysis" element={<TaxAnalysis />} />
      <Route path="/investor-profiles" element={<InvestorProfiles />} />
      <Route path="/patrimony-analysis" element={<PatrimonyAnalysis />} />
    </Routes>
  );
};

export default AnalyseClientsRoutes;
