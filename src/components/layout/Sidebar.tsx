
import React, { useState } from 'react';
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
  Menu,
  X,
  Shield,
  Lock
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  isPremium?: boolean;
  onClick?: () => void;
};

const NavItem = ({ to, icon: Icon, label, isPremium, onClick }: NavItemProps) => {
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
            onClick={onClick}
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

const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
  <div className="w-full bg-sidebar h-full flex flex-col overflow-y-auto border-r border-sidebar-border">
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
            <NavItem to="/admin/dashboard" icon={Home} label="Vue générale" onClick={onItemClick} />
            <NavItem to="/admin/dashboard/encours" icon={BarChart} label="Encours R/T" onClick={onItemClick} />
            <NavItem to="/admin/dashboard/stats-clients" icon={Users} label="Stats clients" onClick={onItemClick} />
            <NavItem to="/admin/dashboard/alertes" icon={Bell} label="Alertes" onClick={onItemClick} />
            <NavItem to="/admin/dashboard/performance" icon={BarChart} label="Performance" onClick={onItemClick} />
          </div>
        </div>

        {/* Clients Section */}
        <div>
          <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Clients</h2>
          <div className="space-y-1">
            <NavItem to="/admin/clients" icon={Users} label="Liste clients" onClick={onItemClick} />
            <NavItem to="/admin/clients/export" icon={FileText} label="Export données" onClick={onItemClick} />
            <NavItem to="/admin/clients/new" icon={Users} label="Nouveau client" onClick={onItemClick} />
          </div>
        </div>

        {/* Portfolios Section */}
        <div>
          <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Portefeuilles</h2>
          <div className="space-y-1">
            <NavItem to="/admin/portfolios" icon={Briefcase} label="Vue globale" onClick={onItemClick} />
            <NavItem to="/admin/portfolios/reels" icon={Briefcase} label="Encours réels" onClick={onItemClick} />
            <NavItem to="/admin/portfolios/theoriques" icon={Briefcase} label="Encours théoriques" onClick={onItemClick} />
            <NavItem to="/admin/portfolios/analyse" icon={BarChart} label="Analyses" onClick={onItemClick} />
          </div>
        </div>

        {/* Tools Section */}
        <div>
          <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Outils</h2>
          <div className="space-y-1">
            <NavItem to="/admin/outils" icon={Settings} label="Liste des outils" onClick={onItemClick} />
            <NavItem to="/admin/outils/simulateurs" icon={Settings} label="Simulateurs" onClick={onItemClick} />
            <NavItem to="/admin/outils/produits" icon={Settings} label="Produits" onClick={onItemClick} />
          </div>
        </div>

        {/* IA Section */}
        <div>
          <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Intelligence Artificielle</h2>
          <div className="space-y-1">
            <NavItem to="/admin/ia/scores" icon={Brain} label="Scores" onClick={onItemClick} />
            <NavItem to="/admin/ia/recommandations" icon={Brain} label="Recommandations" onClick={onItemClick} />
            <NavItem to="/admin/ia/suivi-interactions" icon={Brain} label="Suivi IA" onClick={onItemClick} />
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Documents</h2>
          <div className="space-y-1">
            <NavItem to="/admin/documents/en-attente" icon={FileText} label="À signer" onClick={onItemClick} />
            <NavItem to="/admin/documents/signes" icon={FileText} label="Signés" onClick={onItemClick} />
            <NavItem to="/admin/documents/historique" icon={FileText} label="Archives" onClick={onItemClick} />
          </div>
        </div>

        {/* Alerts Section */}
        <div>
          <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Alertes</h2>
          <div className="space-y-1">
            <NavItem to="/admin/alertes" icon={Bell} label="Vue d'ensemble" onClick={onItemClick} />
            <NavItem to="/admin/alertes/inactifs" icon={Bell} label="Clients inactifs" onClick={onItemClick} />
            <NavItem to="/admin/alertes/profils-incomplets" icon={Bell} label="Profils incomplets" onClick={onItemClick} />
          </div>
        </div>

        {/* Settings Section */}
        <div>
          <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Paramètres</h2>
          <div className="space-y-1">
            <NavItem to="/admin/parametres/roles" icon={Users} label="Utilisateurs" onClick={onItemClick} />
            <NavItem to="/admin/parametres/plateforme" icon={Settings} label="Plateforme" onClick={onItemClick} />
            <NavItem to="/admin/parametres/securite" icon={Shield} label="Sécurité" onClick={onItemClick} />
          </div>
        </div>

        {/* Appointments Section */}
        <div>
          <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">Rendez-vous</h2>
          <div className="space-y-1">
            <NavItem to="/admin/rendez-vous" icon={Calendar} label="Planning" onClick={onItemClick} />
            <NavItem to="/admin/rendez-vous/calendrier" icon={Calendar} label="Calendrier" onClick={onItemClick} />
            <NavItem to="/admin/rendez-vous/historique" icon={Calendar} label="Historique" onClick={onItemClick} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
            <SidebarContent onItemClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div className="hidden md:block w-64 flex-shrink-0">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
