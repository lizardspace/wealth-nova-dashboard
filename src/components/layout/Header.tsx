
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
    <header className="glass backdrop-blur-xl shadow-lg border-b border-white/20 z-20 sticky top-0">
      <div className="h-16 flex items-center justify-between px-4">
        <div className="md:hidden w-8"></div> {/* Spacer for menu button */}
        
        <div className="text-xl md:text-2xl font-bold text-eparnova-blue flex items-center mx-auto md:mx-0 transition-all duration-300 hover:scale-105 cursor-pointer hover-glow" onClick={() => navigate('/admin/dashboard')}>
          <span className="text-eparnova-gold animate-glow">EPAR</span>NOVA <span className="text-xs ml-2 glass px-3 py-1 rounded-full backdrop-blur-sm">Admin</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70 group-hover:text-blue-500 transition-all duration-300" />
            <Input 
              type="search" 
              placeholder="Rechercher..." 
              className="pl-8 glass border-white/30 hover:border-white/50 focus:border-blue-300/50 transition-all duration-300 focus:ring-2 focus:ring-blue-200/50 backdrop-blur-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Button variant="ghost" size="icon" className="relative glass hover:glass-card transition-all duration-300 hover-lift">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full glass hover:glass-card transition-all duration-300 hover-lift">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1 glass-card animate-scale-in border-white/20">
              <DropdownMenuItem asChild>
                <div className="cursor-pointer flex items-center transition-all duration-200 hover:bg-white/20 rounded-md">
                  <span className="font-medium">Admin</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <div className="cursor-pointer flex items-center hover:text-blue-600 transition-all duration-200 hover:bg-white/20 rounded-md">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-100/20 transition-all duration-200 rounded-md">
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
