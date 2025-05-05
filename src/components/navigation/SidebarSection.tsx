
import React from 'react';
import NavItem from './NavItem';

type NavItemData = {
  to: string;
  icon: React.ElementType;
  label: string;
  isPremium?: boolean;
};

type SidebarSectionProps = {
  title: string;
  items: NavItemData[];
  onItemClick?: () => void;
};

const SidebarSection = ({ title, items, onItemClick }: SidebarSectionProps) => {
  return (
    <div>
      <h2 className="text-sidebar-foreground/70 font-medium text-xs uppercase mb-2 px-3">{title}</h2>
      <div className="space-y-1">
        {items.map((item) => (
          <NavItem 
            key={item.to} 
            to={item.to} 
            icon={item.icon} 
            label={item.label}
            isPremium={item.isPremium}
            onClick={onItemClick} 
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarSection;
