
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur EPARNOVA !",
    });
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b z-10">
      <div className="h-16 flex items-center justify-between px-4">
        <div className="md:hidden w-8"></div> {/* Spacer for menu button */}
        
        <div className="text-xl md:text-2xl font-bold text-eparnova-blue flex items-center mx-auto md:mx-0">
          <span className="text-eparnova-gold">EPAR</span>NOVA <span className="text-xs ml-2 bg-eparnova-blue/10 text-eparnova-blue px-2 py-1 rounded-md">Admin</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
            <Input 
              type="search" 
              placeholder="Rechercher..." 
              className="pl-8 bg-muted/30 border-none"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <div className="cursor-pointer flex items-center">
                  <span className="font-medium">Admin</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <div className="cursor-pointer flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
