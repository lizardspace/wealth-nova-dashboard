
import React from 'react';
import { NavLink } from 'react-router-dom';
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

export default NavItem;
