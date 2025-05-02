
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import "./App.css";

// Import des pages
import PortfolioPage from "./pages/portfolio/PortfolioPage";
import AddAssetPage from "./pages/portfolio/AddAssetPage";
import StatementPage from "./pages/statement/StatementPage";
import SimulatorsPage from "./pages/simulators/SimulatorsPage";
import ProductsPage from "./pages/products/ProductsPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import AppointmentsPage from "./pages/appointments/AppointmentsPage";
import ChatPage from "./pages/chat/ChatPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ContactPage from "./pages/contact/ContactPage";

// Import de la nouvelle page d'analyse des portefeuilles
import AnalysePage from "./pages/admin/portfolios/AnalysePage";

// Import des nouvelles pages dashboard
import EncoursPage from "./pages/admin/dashboard/EncoursPage";
import StatsClientsPage from "./pages/admin/dashboard/StatsClientsPage";
import AlertesPage from "./pages/admin/dashboard/AlertesPage";
import PerformancePage from "./pages/admin/dashboard/PerformancePage";

// Import des nouvelles pages clients
import ListeClientsPage from "./pages/admin/clients/ListeClientsPage";
import ExportDonneesPage from "./pages/admin/clients/ExportDonneesPage";
import NouveauClientPage from "./pages/admin/clients/NouveauClientPage";

// Import des nouvelles pages portefeuilles
import VueGlobalePage from "./pages/admin/portfolios/VueGlobalePage";
import EncoursReelsPage from "./pages/admin/portfolios/EncoursReelsPage";
import EncoursTheoriquesPage from "./pages/admin/portfolios/EncoursTheoriquesPage";

// Dans App.tsx
import ToolsListPage from "./pages/admin/tools/ToolsListPage";
import SimulatorsListPage from "./pages/admin/tools/SimulatorsListPage";
import SimulatorDetailPage from "./pages/admin/tools/SimulatorDetailPage";
import NewSimulatorPage from "./pages/admin/tools/NewSimulatorPage";
import ProductsListPage from "./pages/admin/tools/ProductsListPage";
import ProductDetailPage from "./pages/admin/tools/ProductDetailPage";
import NewProductPage from "./pages/admin/tools/NewProductPage";
import ConditionalRulesPage from "./pages/admin/tools/ConditionalRulesPage";

// Admin placeholder component - Will need to be implemented properly
const AdminPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500">Cette page est en cours de développement.</p>
  </div>
);

const queryClient = new QueryClient();

// Simple auth check
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />
          <Route path="/register" element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } />

          {/* Protected Routes */}
          <Route element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }>
            <Route path="/" element={<Index />} />

            {/* Portfolio routes */}
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/add" element={<AddAssetPage />} />

            {/* Statement route */}
            <Route path="/statement" element={<StatementPage />} />

            {/* Tools routes */}
            <Route path="/simulators" element={<SimulatorsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />

            {/* Contact routes */}
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminPlaceholder title="Tableau de bord" />} />
            <Route path="/admin/dashboard/encours" element={<EncoursPage />} />
            <Route path="/admin/dashboard/stats-clients" element={<StatsClientsPage />} />
            <Route path="/admin/dashboard/alertes" element={<AlertesPage />} />
            <Route path="/admin/dashboard/performance" element={<PerformancePage />} />

            {/* Admin Clients Routes */}
            <Route path="/admin/clients" element={<ListeClientsPage />} />
            <Route path="/admin/clients/export" element={<ExportDonneesPage />} />
            <Route path="/admin/clients/new" element={<NouveauClientPage />} />
            <Route path="/admin/clients/:clientId" element={<AdminPlaceholder title="Détail client" />} />
            <Route path="/admin/clients/:clientId/edit" element={<AdminPlaceholder title="Édition client" />} />
            <Route path="/admin/clients/:clientId/simulations" element={<AdminPlaceholder title="Simulations client" />} />
            <Route path="/admin/clients/:clientId/documents" element={<AdminPlaceholder title="Documents client" />} />
            <Route path="/admin/clients/:clientId/rendez-vous" element={<AdminPlaceholder title="Rendez-vous client" />} />
            <Route path="/admin/clients/:clientId/chat-history" element={<AdminPlaceholder title="Historique chat" />} />

            {/* Admin Portfolios Routes */}
            <Route path="/admin/portfolios" element={<VueGlobalePage />} />
            <Route path="/admin/portfolios/reels" element={<EncoursReelsPage />} />
            <Route path="/admin/portfolios/theoriques" element={<EncoursTheoriquesPage />} />
            <Route path="/admin/portfolios/analyse" element={<AnalysePage />} />
            <Route path="/admin/portfolios/classe-actif" element={<AdminPlaceholder title="Classes d'actifs" />} />
            <Route path="/admin/portfolios/evolution" element={<AdminPlaceholder title="Évolution portefeuilles" />} />

            {/* Admin Outils Routes */}
            <Route path="/admin/outils" element={<ToolsListPage />} />
            <Route path="/admin/outils/simulateurs" element={<SimulatorsListPage />} />
            <Route path="/admin/outils/simulateurs/:id" element={<SimulatorDetailPage />} />
            <Route path="/admin/outils/simulateurs/new" element={<NewSimulatorPage />} />
            <Route path="/admin/outils/produits" element={<ProductsListPage />} />
            <Route path="/admin/outils/produits/:id" element={<ProductDetailPage />} />
            <Route path="/admin/outils/produits/new" element={<NewProductPage />} />
            <Route path="/admin/outils/regles-affichage" element={<ConditionalRulesPage />} />

            {/* Admin IA Routes */}
            <Route path="/admin/ia/scores" element={<AdminPlaceholder title="Scores patrimoniaux" />} />
            <Route path="/admin/ia/scores/:clientId" element={<AdminPlaceholder title="Score client" />} />
            <Route path="/admin/ia/recommandations" element={<AdminPlaceholder title="Recommandations" />} />
            <Route path="/admin/ia/recommandations/:clientId" element={<AdminPlaceholder title="Recommandations client" />} />
            <Route path="/admin/ia/suivi-interactions" element={<AdminPlaceholder title="Suivi IA-client" />} />

            {/* Admin Documents Routes */}
            <Route path="/admin/documents/en-attente" element={<AdminPlaceholder title="Documents à signer" />} />
            <Route path="/admin/documents/signes" element={<AdminPlaceholder title="Documents signés" />} />
            <Route path="/admin/documents/historique" element={<AdminPlaceholder title="Archives documentaires" />} />
            <Route path="/admin/documents/modele" element={<AdminPlaceholder title="Modèles de documents" />} />

            {/* Admin Alertes Routes */}
            <Route path="/admin/alertes" element={<AdminPlaceholder title="Vue d'ensemble opportunités" />} />
            <Route path="/admin/alertes/inactifs" element={<AdminPlaceholder title="Clients inactifs" />} />
            <Route path="/admin/alertes/profils-incomplets" element={<AdminPlaceholder title="Profils incomplets" />} />
            <Route path="/admin/alertes/projets-en-cours" element={<AdminPlaceholder title="Projets non finalisés" />} />
            <Route path="/admin/alertes/gains-potentiels" element={<AdminPlaceholder title="Optimisations non activées" />} />

            {/* Admin Parametres Routes */}
            <Route path="/admin/parametres/roles" element={<AdminPlaceholder title="Gestion utilisateurs" />} />
            <Route path="/admin/parametres/roles/new" element={<AdminPlaceholder title="Nouvel utilisateur" />} />
            <Route path="/admin/parametres/plateforme" element={<AdminPlaceholder title="Configuration plateforme" />} />
            <Route path="/admin/parametres/securite" element={<AdminPlaceholder title="Paramètres sécurité" />} />
            <Route path="/admin/parametres/historique-acces" element={<AdminPlaceholder title="Journal connexions" />} />

            {/* Admin Rendez-vous Routes */}
            <Route path="/admin/rendez-vous" element={<AdminPlaceholder title="Planning global" />} />
            <Route path="/admin/rendez-vous/calendrier" element={<AdminPlaceholder title="Vue calendrier" />} />
            <Route path="/admin/rendez-vous/creneau/new" element={<AdminPlaceholder title="Nouveau créneau" />} />
            <Route path="/admin/rendez-vous/creneau/:id/edit" element={<AdminPlaceholder title="Modifier créneau" />} />
            <Route path="/admin/rendez-vous/historique" element={<AdminPlaceholder title="Archives rendez-vous" />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
