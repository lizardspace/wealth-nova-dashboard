
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
  Home
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  isPremium?: boolean;
};

const NavItem = ({ to, icon: Icon, label, isPremium }: NavItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={to}
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-md text-sm
              ${isActive 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }
            `}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        </TooltipTrigger>
        <TooltipContent side="right">
          <span>Accéder à {label}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar = () => {
  return (
    <div className="w-64 bg-sidebar h-full flex flex-col overflow-y-auto border-r border-sidebar-border">
      <div className="p-4">
        <NavLink to="/admin" className="flex items-center mb-6">
          <span className="text-xl font-bold text-eparnova-blue">
            <span className="text-eparnova-gold">EPAR</span>NOVA
          </span>
        </NavLink>

        <div className="space-y-6">
          {/* Dashboard Section */}
          <div>
            <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Tableau de bord</h2>
            <div className="space-y-1">
              <NavItem to="/admin/dashboard" icon={Home} label="Vue générale" />
              <NavItem to="/admin/dashboard/encours" icon={BarChart} label="Encours R/T" />
              <NavItem to="/admin/dashboard/stats-clients" icon={Users} label="Stats clients" />
              <NavItem to="/admin/dashboard/alertes" icon={Bell} label="Alertes" />
              <NavItem to="/admin/dashboard/performance" icon={BarChart} label="Performance" />
            </div>
          </div>

          {/* Clients Section */}
          <div>
            <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Clients</h2>
            <div className="space-y-1">
              <NavItem to="/admin/clients" icon={Users} label="Liste clients" />
              <NavItem to="/admin/clients/export" icon={FileText} label="Export données" />
              <NavItem to="/admin/clients/new" icon={Users} label="Nouveau client" />
            </div>
          </div>

          {/* Portfolios Section */}
          <div>
            <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Portefeuilles</h2>
            <div className="space-y-1">
              <NavItem to="/admin/portfolios" icon={Briefcase} label="Vue globale" />
              <NavItem to="/admin/portfolios/reels" icon={Briefcase} label="Encours réels" />
              <NavItem to="/admin/portfolios/theoriques" icon={Briefcase} label="Encours théoriques" />
              <NavItem to="/admin/portfolios/analyse" icon={BarChart} label="Analyses" />
            </div>
          </div>

          {/* Tools Section */}
          <div>
            <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Outils</h2>
            <div className="space-y-1">
              <NavItem to="/admin/outils" icon={Settings} label="Liste des outils" />
              <NavItem to="/admin/outils/simulateurs" icon={Settings} label="Simulateurs" />
              <NavItem to="/admin/outils/produits" icon={Settings} label="Produits" />
            </div>
          </div>

          {/* IA Section */}
          <div>
            <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Intelligence Artificielle</h2>
            <div className="space-y-1">
              <NavItem to="/admin/ia/scores" icon={Brain} label="Scores" />
              <NavItem to="/admin/ia/recommandations" icon={Brain} label="Recommandations" />
              <NavItem to="/admin/ia/suivi-interactions" icon={Brain} label="Suivi IA" />
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Documents</h2>
            <div className="space-y-1">
              <NavItem to="/admin/documents/en-attente" icon={FileText} label="À signer" />
              <NavItem to="/admin/documents/signes" icon={FileText} label="Signés" />
              <NavItem to="/admin/documents/historique" icon={FileText} label="Archives" />
            </div>
          </div>

          {/* Alerts Section */}
          <div>
            <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Alertes</h2>
            <div className="space-y-1">
              <NavItem to="/admin/alertes" icon={Bell} label="Vue d'ensemble" />
              <NavItem to="/admin/alertes/inactifs" icon={Bell} label="Clients inactifs" />
              <NavItem to="/admin/alertes/profils-incomplets" icon={Bell} label="Profils incomplets" />
            </div>
          </div>

          {/* Settings Section */}
          <div>
            <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Paramètres</h2>
            <div className="space-y-1">
              <NavItem to="/admin/parametres/roles" icon={Settings} label="Utilisateurs" />
              <NavItem to="/admin/parametres/plateforme" icon={Settings} label="Plateforme" />
              <NavItem to="/admin/parametres/securite" icon={Settings} label="Sécurité" />
            </div>
          </div>

          {/* Appointments Section */}
          <div>
            <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Rendez-vous</h2>
            <div className="space-y-1">
              <NavItem to="/admin/rendez-vous" icon={Calendar} label="Planning" />
              <NavItem to="/admin/rendez-vous/calendrier" icon={Calendar} label="Calendrier" />
              <NavItem to="/admin/rendez-vous/historique" icon={Calendar} label="Historique" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
