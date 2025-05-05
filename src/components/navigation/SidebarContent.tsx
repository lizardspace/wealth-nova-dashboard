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
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarItem = {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  end?: boolean;
};

type SidebarSectionProps = {
  title: string;
  items: SidebarItem[];
  onItemClick?: () => void;
};

const SidebarSection = ({ title, items, onItemClick }: SidebarSectionProps) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 mr-2 text-slate-500" />
        ) : (
          <ChevronRight className="w-4 h-4 mr-2 text-slate-500" />
        )}
        <span className="font-medium">{title}</span>
      </button>
      {isExpanded && (
        <div className="ml-2 space-y-1 border-l-2 border-slate-100 pl-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onItemClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    'w-4 h-4 mr-3 flex-shrink-0',
                    isActive ? 'text-blue-500' : 'text-slate-500'
                  )} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

type SidebarContentProps = {
  onItemClick?: () => void;
};

const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const dashboardItems = [
    { to: "/admin/dashboard", icon: Home, label: "Vue générale", end: true },
    { to: "/admin/dashboard/encours", icon: BarChart, label: "Encours R/T" },
    { to: "/admin/dashboard/stats-clients", icon: Users, label: "Stats clients" },
    { to: "/admin/dashboard/alertes", icon: Bell, label: "Alertes" },
    { to: "/admin/dashboard/performance", icon: BarChart, label: "Performance" }
  ];

  const clientsItems = [
    { to: "/admin/clients", icon: Users, label: "Liste clients", end: true },
    { to: "/admin/clients/export", icon: FileText, label: "Export données" },
    { to: "/admin/clients/new", icon: Users, label: "Nouveau client" }
  ];

  const portfolioItems = [
    { to: "/admin/portfolios", icon: Briefcase, label: "Vue globale", end: true },
    { to: "/admin/portfolios/reels", icon: Briefcase, label: "Encours réels" },
    { to: "/admin/portfolios/theoriques", icon: Briefcase, label: "Encours théoriques" },
    { to: "/admin/portfolios/analyse", icon: BarChart, label: "Analyses" }
  ];

  const toolsItems = [
    { to: "/admin/outils", icon: Settings, label: "Liste des outils", end: true },
    { to: "/admin/outils/simulateurs", icon: Settings, label: "Simulateurs" },
    { to: "/admin/outils/produits", icon: Settings, label: "Produits" }
  ];

  const aiItems = [
    { to: "/admin/ia/scores", icon: Brain, label: "Scores", end: true },
    { to: "/admin/ia/recommandations", icon: Brain, label: "Recommandations" },
    { to: "/admin/ia/suivi-interactions", icon: Brain, label: "Suivi IA" }
  ];

  const documentsItems = [
    { to: "/admin/documents/en-attente", icon: FileText, label: "À signer", end: true },
    { to: "/admin/documents/signes", icon: FileText, label: "Signés" },
    { to: "/admin/documents/historique", icon: FileText, label: "Archives" }
  ];

  const alertsItems = [
    { to: "/admin/alertes", icon: Bell, label: "Vue d'ensemble", end: true },
    { to: "/admin/alertes/inactifs", icon: Bell, label: "Clients inactifs" },
    { to: "/admin/alertes/profils-incomplets", icon: Bell, label: "Profils incomplets" }
  ];

  const settingsItems = [
    { to: "/admin/parametres/roles", icon: Users, label: "Utilisateurs", end: true },
    { to: "/admin/parametres/plateforme", icon: Settings, label: "Plateforme" },
    { to: "/admin/parametres/securite", icon: Shield, label: "Sécurité" }
  ];

  const appointmentsItems = [
    { to: "/admin/rendez-vous", icon: Calendar, label: "Planning", end: true },
    { to: "/admin/rendez-vous/calendrier", icon: Calendar, label: "Calendrier" },
    { to: "/admin/rendez-vous/historique", icon: Calendar, label: "Historique" }
  ];

  return (
    <div className="w-64 h-full flex flex-col bg-slate-50 border-r border-slate-200 overflow-y-auto">
      <div className="p-4 border-b border-slate-200 bg-white">
        <h1 className="text-xl font-bold text-slate-800 flex items-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
            <Brain className="w-5 h-5 text-indigo-600" />
          </div>
          Eparnova
        </h1>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-4">
        <SidebarSection title="Tableau de bord" items={dashboardItems} onItemClick={onItemClick} />
        <SidebarSection title="Clients" items={clientsItems} onItemClick={onItemClick} />
        <SidebarSection title="Portefeuilles" items={portfolioItems} onItemClick={onItemClick} />
        <SidebarSection title="Outils" items={toolsItems} onItemClick={onItemClick} />
        <SidebarSection title="Intelligence Artificielle" items={aiItems} onItemClick={onItemClick} />
        <SidebarSection title="Documents" items={documentsItems} onItemClick={onItemClick} />
        <SidebarSection title="Alertes" items={alertsItems} onItemClick={onItemClick} />
        <SidebarSection title="Rendez-vous" items={appointmentsItems} onItemClick={onItemClick} />
        <SidebarSection title="Paramètres" items={settingsItems} onItemClick={onItemClick} />
      </nav>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-sm font-medium text-purple-600">AD</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">Admin User</p>
            <p className="text-xs text-slate-500">Administrateur</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;