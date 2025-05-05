
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart, 
  Users, 
  Briefcase, 
  Settings,
  FileText, 
  Bell, 
  Calendar, 
  Brain,
  Home,
  Shield,
} from 'lucide-react';
import SidebarSection from './SidebarSection';

type SidebarContentProps = {
  onItemClick?: () => void;
};

const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const dashboardItems = [
    { to: "/admin/dashboard", icon: Home, label: "Vue générale" },
    { to: "/admin/dashboard/encours", icon: BarChart, label: "Encours R/T" },
    { to: "/admin/dashboard/stats-clients", icon: Users, label: "Stats clients" },
    { to: "/admin/dashboard/alertes", icon: Bell, label: "Alertes" },
    { to: "/admin/dashboard/performance", icon: BarChart, label: "Performance" }
  ];

  const clientsItems = [
    { to: "/admin/clients", icon: Users, label: "Liste clients" },
    { to: "/admin/clients/export", icon: FileText, label: "Export données" },
    { to: "/admin/clients/new", icon: Users, label: "Nouveau client" }
  ];

  const portfolioItems = [
    { to: "/admin/portfolios", icon: Briefcase, label: "Vue globale" },
    { to: "/admin/portfolios/reels", icon: Briefcase, label: "Encours réels" },
    { to: "/admin/portfolios/theoriques", icon: Briefcase, label: "Encours théoriques" },
    { to: "/admin/portfolios/analyse", icon: BarChart, label: "Analyses" }
  ];

  const toolsItems = [
    { to: "/admin/outils", icon: Settings, label: "Liste des outils" },
    { to: "/admin/outils/simulateurs", icon: Settings, label: "Simulateurs" },
    { to: "/admin/outils/produits", icon: Settings, label: "Produits" }
  ];

  const aiItems = [
    { to: "/admin/ia/scores", icon: Brain, label: "Scores" },
    { to: "/admin/ia/recommandations", icon: Brain, label: "Recommandations" },
    { to: "/admin/ia/suivi-interactions", icon: Brain, label: "Suivi IA" }
  ];

  const documentsItems = [
    { to: "/admin/documents/en-attente", icon: FileText, label: "À signer" },
    { to: "/admin/documents/signes", icon: FileText, label: "Signés" },
    { to: "/admin/documents/historique", icon: FileText, label: "Archives" }
  ];

  const alertsItems = [
    { to: "/admin/alertes", icon: Bell, label: "Vue d'ensemble" },
    { to: "/admin/alertes/inactifs", icon: Bell, label: "Clients inactifs" },
    { to: "/admin/alertes/profils-incomplets", icon: Bell, label: "Profils incomplets" }
  ];

  const settingsItems = [
    { to: "/admin/parametres/roles", icon: Users, label: "Utilisateurs" },
    { to: "/admin/parametres/plateforme", icon: Settings, label: "Plateforme" },
    { to: "/admin/parametres/securite", icon: Shield, label: "Sécurité" }
  ];

  const appointmentsItems = [
    { to: "/admin/rendez-vous", icon: Calendar, label: "Planning" },
    { to: "/admin/rendez-vous/calendrier", icon: Calendar, label: "Calendrier" },
    { to: "/admin/rendez-vous/historique", icon: Calendar, label: "Historique" }
  ];

  return (
    <div className="w-full bg-sidebar h-full flex flex-col overflow-y-auto border-r border-sidebar-border">
      <div className="p-4">
        

        <div className="space-y-6">
          <SidebarSection title="Tableau de bord" items={dashboardItems} onItemClick={onItemClick} />
          <SidebarSection title="Clients" items={clientsItems} onItemClick={onItemClick} />
          <SidebarSection title="Portefeuilles" items={portfolioItems} onItemClick={onItemClick} />
          <SidebarSection title="Outils" items={toolsItems} onItemClick={onItemClick} />
          <SidebarSection title="Intelligence Artificielle" items={aiItems} onItemClick={onItemClick} />
          <SidebarSection title="Documents" items={documentsItems} onItemClick={onItemClick} />
          <SidebarSection title="Alertes" items={alertsItems} onItemClick={onItemClick} />
          <SidebarSection title="Paramètres" items={settingsItems} onItemClick={onItemClick} />
          <SidebarSection title="Rendez-vous" items={appointmentsItems} onItemClick={onItemClick} />
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;
