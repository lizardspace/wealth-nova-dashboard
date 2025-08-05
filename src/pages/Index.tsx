
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, FileText, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AssetDistributionChart from '@/components/dashboard/AssetDistributionChart';
import WealthScore from '@/components/dashboard/WealthScore';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';

const Index = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero section with modern gradient */}
      <div className="glass-card p-8 rounded-2xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="animate-slide-in-left">
            <h1 className="text-3xl md:text-4xl font-bold gradient-eparnova bg-gradient-to-r from-eparnova-blue via-eparnova-green to-eparnova-gold bg-clip-text text-transparent">
              Bonjour, Sophie
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">Bienvenue sur votre tableau de bord moderne</p>
          </div>
          <div className="flex gap-3 animate-slide-in-right">
            <Button asChild className="hover-lift gradient-primary text-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/portfolio/add" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Ajouter un actif</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="glass hover:glass-card border-white/30 hover-lift">
              <Link to="/statement" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Voir mon bilan</span>
              </Link>
            </Button>
          </div>
        </div>
        {/* Floating decoration */}
        <div className="absolute top-4 right-4 w-16 h-16 gradient-gold rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 gradient-success rounded-full opacity-15 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Overview cards with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="interactive-card border-none relative overflow-hidden" style={{animationDelay: '0.1s'}}>
          <div className="absolute inset-0 gradient-primary opacity-10"></div>
          <div className="absolute -top-2 -left-2 w-8 h-8 gradient-primary rounded-full opacity-30 animate-glow"></div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm text-muted-foreground font-medium tracking-wide">TOTAL DU PATRIMOINE</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">325 000 €</div>
            <div className="flex items-center text-sm text-green-600 mt-2">
              <TrendingUp className="h-4 w-4 mr-1 animate-bounce" />
              <span className="font-medium">+5.2% depuis 3 mois</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="interactive-card border-none relative overflow-hidden" style={{animationDelay: '0.2s'}}>
          <div className="absolute inset-0 gradient-success opacity-10"></div>
          <div className="absolute -top-2 -left-2 w-8 h-8 gradient-success rounded-full opacity-30 animate-glow"></div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm text-muted-foreground font-medium tracking-wide">REVENUS MENSUELS</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">3 850 €</div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <span className="font-medium">Salaire net mensuel</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="interactive-card border-none relative overflow-hidden" style={{animationDelay: '0.3s'}}>
          <div className="absolute inset-0 gradient-gold opacity-10"></div>
          <div className="absolute -top-2 -left-2 w-8 h-8 gradient-gold rounded-full opacity-30 animate-glow"></div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm text-muted-foreground font-medium tracking-wide">ÉPARGNE DISPONIBLE</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">42 500 €</div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <span className="font-medium">Sur livrets et comptes courants</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Distribution Chart */}
          <AssetDistributionChart />
          
          {/* Recent Transactions */}
          <RecentTransactions />
        </div>
        
        <div className="space-y-6">
          {/* Wealth Score Card */}
          <WealthScore score={76} />
          
          {/* Upcoming Appointments */}
          <UpcomingAppointments />
          
          {/* Premium Promo with enhanced glassmorphism */}
          <Card className="gradient-eparnova text-white border-none overflow-hidden relative hover-lift group animate-glow">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-24 h-24 gradient-gold rounded-full opacity-30 -mr-8 -mt-8 blur-2xl animate-float"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/20 rounded-full -ml-4 -mb-4 blur-xl animate-float" style={{animationDelay: '1s'}}></div>
            <div className="relative z-10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-6 w-6 text-eparnova-gold animate-pulse" />
                  Premium
                </CardTitle>
                <CardDescription className="text-white/90 text-base">
                  Accédez à toutes les fonctionnalités
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="opacity-95 leading-relaxed">Analyses personnalisées, simulateurs avancés et bien plus...</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full gradient-gold text-black hover:scale-105 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl" size="sm">
                  <span>Découvrir l'offre</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
