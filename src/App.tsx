import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { AdminPlaceholder, PublicOnlyRoute, PrivateRoute } from "./components/routes/RouteGroups";
import NotFound from "./pages/NotFound";
import "./App.css";

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Client routes
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

// Admin pages
import VueGeneralePage from "./pages/admin/dashboard/VueGeneralePage";
import EncoursPage from "./pages/admin/dashboard/EncoursPage";
import StatsClientsPage from "./pages/admin/dashboard/StatsClientsPage";
import AlertesPage from "./pages/admin/dashboard/AlertesPage";
import PerformancePage from "./pages/admin/dashboard/PerformancePage";
import ListeClientsPage from "./pages/admin/clients/ListeClientsPage";
import ExportDonneesPage from "./pages/admin/clients/ExportDonneesPage";
import NouveauClientPage from "./pages/admin/clients/NouveauClientPage";
import VueGlobalePage from "./pages/admin/portfolios/VueGlobalePage";
import EncoursReelsPage from "./pages/admin/portfolios/EncoursReelsPage";
import EncoursTheoriquesPage from "./pages/admin/portfolios/EncoursTheoriquesPage";
import AnalysePage from "./pages/admin/portfolios/AnalysePage";
import ToolsListPage from "./pages/admin/tools/ToolsListPage";
import SimulatorsListPage from "./pages/admin/tools/SimulatorsListPage";
import SimulatorDetailPage from "./pages/admin/tools/SimulatorDetailPage";
import NewSimulatorPage from "./pages/admin/tools/NewSimulatorPage";
import ProductsListPage from "./pages/admin/tools/ProductsListPage";
import ProductDetailPage from "./pages/admin/tools/ProductDetailPage";
import NewProductPage from "./pages/admin/tools/NewProductPage";
import ConditionalRulesPage from "./pages/admin/tools/ConditionalRulesPage";
import ScoresPage from "./pages/admin/ai/ScoresPage";
import ClientScorePage from "./pages/admin/ai/ClientScorePage";
import RecommendationsPage from "./pages/admin/ai/RecommendationsPage";
import InteractionTrackingPage from "./pages/admin/ai/InteractionTrackingPage";
import DocumentsToSignPage from "./pages/admin/documents/DocumentsToSignPage";
import DocumentsSignedPage from "./pages/admin/documents/DocumentsSignedPage";
import DocumentsArchivePage from "./pages/admin/documents/DocumentsArchivePage";
import AlertesDashboardPage from "./pages/admin/alertes/AlertesDashboardPage";
import InactiveClientsPage from "./pages/admin/alertes/InactiveClientsPage";
import IncompleteProfilesPage from "./pages/admin/alertes/IncompleteProfilesPage";
import RolesPage from "./pages/admin/settings/RolesPage";
import PlatformPage from "./pages/admin/settings/PlatformPage";
import SecurityPage from "./pages/admin/settings/SecurityPage";
import PlanningPage from "./pages/admin/appointments/PlanningPage";
import CalendarPage from "./pages/admin/appointments/CalendarPage";
import HistoriquePage from "./pages/admin/appointments/HistoriquePage";

const queryClient = new QueryClient();

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
              <MainLayout>
                <Routes>
                  {/* User routes */}
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

                  {/* Admin Routes */}
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  
                  {/* Dashboard Routes */}
                  <Route path="/admin/dashboard" element={<VueGeneralePage />} />
                  <Route path="/admin/dashboard/encours" element={<EncoursPage />} />
                  <Route path="/admin/dashboard/stats-clients" element={<StatsClientsPage />} />
                  <Route path="/admin/dashboard/alertes" element={<AlertesPage />} />
                  <Route path="/admin/dashboard/performance" element={<PerformancePage />} />
                  
                  {/* Client Routes */}
                  <Route path="/admin/clients" element={<ListeClientsPage />} />
                  <Route path="/admin/clients/export" element={<ExportDonneesPage />} />
                  <Route path="/admin/clients/new" element={<NouveauClientPage />} />
                  <Route path="/admin/clients/:clientId" element={<AdminPlaceholder title="Détail client" />} />
                  <Route path="/admin/clients/:clientId/edit" element={<AdminPlaceholder title="Édition client" />} />
                  <Route path="/admin/clients/:clientId/simulations" element={<AdminPlaceholder title="Simulations client" />} />
                  <Route path="/admin/clients/:clientId/documents" element={<AdminPlaceholder title="Documents client" />} />
                  <Route path="/admin/clients/:clientId/rendez-vous" element={<AdminPlaceholder title="Rendez-vous client" />} />
                  <Route path="/admin/clients/:clientId/chat-history" element={<AdminPlaceholder title="Historique chat" />} />
                  
                  {/* Portfolio Routes */}
                  <Route path="/admin/portfolios" element={<VueGlobalePage />} />
                  <Route path="/admin/portfolios/reels" element={<EncoursReelsPage />} />
                  <Route path="/admin/portfolios/theoriques" element={<EncoursTheoriquesPage />} />
                  <Route path="/admin/portfolios/analyse" element={<AnalysePage />} />
                  <Route path="/admin/portfolios/classe-actif" element={<AdminPlaceholder title="Classes d'actifs" />} />
                  <Route path="/admin/portfolios/evolution" element={<AdminPlaceholder title="Évolution portefeuilles" />} />
                  
                  {/* Tools Routes */}
                  <Route path="/admin/outils" element={<ToolsListPage />} />
                  <Route path="/admin/outils/simulateurs" element={<SimulatorsListPage />} />
                  <Route path="/admin/outils/simulateurs/:id" element={<SimulatorDetailPage />} />
                  <Route path="/admin/outils/simulateurs/new" element={<NewSimulatorPage />} />
                  <Route path="/admin/outils/produits" element={<ProductsListPage />} />
                  <Route path="/admin/outils/produits/:id" element={<ProductDetailPage />} />
                  <Route path="/admin/outils/produits/new" element={<NewProductPage />} />
                  <Route path="/admin/outils/regles-affichage" element={<ConditionalRulesPage />} />
                  
                  {/* AI Routes */}
                  <Route path="/admin/ia" element={<Navigate to="/admin/ia/scores" replace />} />
                  <Route path="/admin/ia/scores" element={<ScoresPage />} />
                  <Route path="/admin/ia/scores/:clientId" element={<ClientScorePage />} />
                  <Route path="/admin/ia/recommandations" element={<RecommendationsPage />} />
                  <Route path="/admin/ia/recommandations/:id" element={<AdminPlaceholder title="Détail recommandation" />} />
                  <Route path="/admin/ia/suivi-interactions" element={<InteractionTrackingPage />} />
                  <Route path="/admin/ia/suivi-interactions/:id" element={<AdminPlaceholder title="Détail interaction" />} />
                  
                  {/* Documents Routes */}
                  <Route path="/admin/documents/en-attente" element={<DocumentsToSignPage />} />
                  <Route path="/admin/documents/signes" element={<DocumentsSignedPage />} />
                  <Route path="/admin/documents/historique" element={<DocumentsArchivePage />} />
                  <Route path="/admin/documents/detail/:id" element={<AdminPlaceholder title="Détail document" />} />
                  <Route path="/admin/documents/modele" element={<AdminPlaceholder title="Modèles de documents" />} />
                  
                  {/* Alerts Routes */}
                  <Route path="/admin/alertes" element={<AlertesDashboardPage />} />
                  <Route path="/admin/alertes/inactifs" element={<InactiveClientsPage />} />
                  <Route path="/admin/alertes/profils-incomplets" element={<IncompleteProfilesPage />} />
                  <Route path="/admin/alertes/projets-en-cours" element={<AdminPlaceholder title="Projets non finalisés" />} />
                  <Route path="/admin/alertes/gains-potentiels" element={<AdminPlaceholder title="Optimisations non activées" />} />
                  
                  {/* Settings Routes */}
                  <Route path="/admin/parametres/roles" element={<RolesPage />} />
                  <Route path="/admin/parametres/roles/:id" element={<AdminPlaceholder title="Détail utilisateur" />} />
                  <Route path="/admin/parametres/roles/new" element={<AdminPlaceholder title="Nouvel utilisateur" />} />
                  <Route path="/admin/parametres/plateforme" element={<PlatformPage />} />
                  <Route path="/admin/parametres/securite" element={<SecurityPage />} />
                  <Route path="/admin/parametres/historique-acces" element={<AdminPlaceholder title="Journal connexions" />} />
                  
                  {/* Appointments Routes */}
                  <Route path="/admin/rendez-vous" element={<PlanningPage />} />
                  <Route path="/admin/rendez-vous/calendrier" element={<CalendarPage />} />
                  <Route path="/admin/rendez-vous/creneau/new" element={<AdminPlaceholder title="Nouveau créneau" />} />
                  <Route path="/admin/rendez-vous/creneau/:id/edit" element={<AdminPlaceholder title="Modifier créneau" />} />
                  <Route path="/admin/rendez-vous/historique" element={<HistoriquePage />} />
                </Routes>
              </MainLayout>
            </PrivateRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
