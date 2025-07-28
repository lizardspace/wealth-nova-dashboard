
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
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur EPARNOVA !",
    });
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b z-10 sticky top-0">
      <div className="h-16 flex items-center justify-between px-4">
        <div className="md:hidden w-8"></div> {/* Spacer for menu button */}
        
        <div className="text-xl md:text-2xl font-bold text-eparnova-blue flex items-center mx-auto md:mx-0 transition-all hover:scale-105 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
          <span className="text-eparnova-gold">EPAR</span>NOVA <span className="text-xs ml-2 bg-eparnova-blue/10 text-eparnova-blue px-2 py-1 rounded-md">Admin</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70 group-hover:text-blue-500 transition-colors" />
            <Input 
              type="search" 
              placeholder="Rechercher..." 
              className="pl-8 bg-muted/30 border-none hover:bg-muted/50 focus:bg-white transition-all focus:ring-1 focus:ring-blue-200"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 transition-colors">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1 animate-scale-in">
              <DropdownMenuItem asChild>
                <div className="cursor-pointer flex items-center">
                  <span className="font-medium">Admin</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <div className="cursor-pointer flex items-center hover:text-blue-600 transition-colors">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors">
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
