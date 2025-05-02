
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, User, Star, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const [premiumDialog, setPremiumDialog] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePremiumClick = () => {
    setPremiumDialog(true);
  };

  const handleStartTrial = () => {
    toast({
      title: "Essai Premium activé",
      description: "Votre essai gratuit de 14 jours commence aujourd'hui. Profitez de toutes les fonctionnalités Premium !",
      duration: 5000,
    });
    setPremiumDialog(false);
  };

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
        
        <Link to="/" className="text-xl md:text-2xl font-bold text-eparnova-blue flex items-center mx-auto md:mx-0">
          <span className="text-eparnova-gold">EPAR</span>NOVA
        </Link>
        
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
          <Button 
            variant="outline" 
            size="sm"
            className="hidden sm:flex items-center gap-1 border-eparnova-gold text-eparnova-gold hover:bg-eparnova-gold/10"
            onClick={handlePremiumClick}
          >
            <Star className="h-4 w-4" />
            <span className="font-medium">Premium</span>
          </Button>
          
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
                <Link to="/profile" className="cursor-pointer">
                  Mon Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Link>
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
      
      {/* Premium Dialog */}
      <Dialog open={premiumDialog} onOpenChange={setPremiumDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-eparnova-gold" />
              Découvrez EPARNOVA Premium
            </DialogTitle>
            <DialogDescription>
              Accédez à toutes les fonctionnalités avancées pour optimiser votre patrimoine
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/20 p-3 rounded-md">
                <h3 className="font-medium mb-1">Analyse IA personnalisée</h3>
                <p className="text-xs text-muted-foreground">Recommandations sur mesure basées sur votre profil complet</p>
              </div>
              <div className="bg-muted/20 p-3 rounded-md">
                <h3 className="font-medium mb-1">Rapports détaillés</h3>
                <p className="text-xs text-muted-foreground">Exportez vos analyses en PDF et partagez-les</p>
              </div>
              <div className="bg-muted/20 p-3 rounded-md">
                <h3 className="font-medium mb-1">Simulateurs avancés</h3>
                <p className="text-xs text-muted-foreground">Projections fiscales et patrimoniales complètes</p>
              </div>
              <div className="bg-muted/20 p-3 rounded-md">
                <h3 className="font-medium mb-1">Support prioritaire</h3>
                <p className="text-xs text-muted-foreground">Accès à un conseiller dédié sous 4h</p>
              </div>
            </div>
            
            <div className="bg-eparnova-gold/10 p-4 rounded-md">
              <h3 className="text-eparnova-gold font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Offre spéciale
              </h3>
              <p className="mt-1 text-sm">Essayez Premium gratuitement pendant 14 jours</p>
              <div className="mt-2">
                <span className="text-2xl font-bold">29,99€</span>
                <span className="text-sm text-muted-foreground">/mois après la période d'essai</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPremiumDialog(false)}>Pas maintenant</Button>
            <Button 
              className="bg-eparnova-gold hover:bg-eparnova-gold/90 text-black" 
              onClick={handleStartTrial}
            >
              Commencer l'essai gratuit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
