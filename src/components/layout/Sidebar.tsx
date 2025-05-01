
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, 
  BarChart, 
  Briefcase, 
  Calendar, 
  FileText, 
  Home, 
  PiggyBank,
  Mail, 
  MessageCircle,
  User,
  Star,
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
            {isPremium && <Star className="ml-auto h-3 w-3 text-eparnova-gold" />}
          </NavLink>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isPremium ? (
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-eparnova-gold" />
              <span>Fonctionnalité Premium</span>
            </div>
          ) : (
            <span>Accéder à {label}</span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar = () => {
  return (
    <div className="w-64 bg-sidebar h-full flex flex-col overflow-y-auto border-r border-sidebar-border">
      <div className="p-4">
        <h2 className="text-sidebar-foreground font-medium mb-1">Tableau de bord</h2>
        <div className="space-y-1">
          <NavItem to="/" icon={Home} label="Accueil" />
          <NavItem to="/portfolio" icon={Briefcase} label="Mon Portefeuille" />
          <NavItem to="/statement" icon={FileText} label="Bilan Patrimonial" />
        </div>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <h2 className="text-sidebar-foreground font-medium mb-1">Outils</h2>
        <div className="space-y-1">
          <NavItem to="/simulators" icon={Activity} label="Simulateurs" />
          <NavItem to="/products" icon={PiggyBank} label="Produits Financiers" />
          <NavItem to="/analytics" icon={BarChart} label="Analyses" isPremium={true} />
        </div>
      </div>
      
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <h2 className="text-sidebar-foreground font-medium mb-1">Contact</h2>
        <div className="space-y-1">
          <NavItem to="/appointments" icon={Calendar} label="Rendez-vous" />
          <NavItem to="/chat" icon={MessageCircle} label="Assistant IA" isPremium={true} />
          <NavItem to="/profile" icon={User} label="Mon Profil" />
          <NavItem to="/contact" icon={Mail} label="Contact" />
        </div>
      </div>
      
      <div className="p-4 bg-sidebar-accent/50 mt-2">
        <div className="rounded-md bg-eparnova-gold/20 p-3">
          <h4 className="text-xs font-medium text-eparnova-gold mb-1 flex items-center">
            <Star className="h-3.5 w-3.5 mr-1" />
            Premium
          </h4>
          <p className="text-xs text-sidebar-foreground/90">
            Accédez à toutes les fonctionnalités avancées d'EPARNOVA
          </p>
          <button className="mt-2 bg-eparnova-gold hover:bg-eparnova-gold/90 text-black text-xs py-1 px-2 rounded w-full">
            Découvrir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
