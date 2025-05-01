
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
    <div className="space-y-6">
      {/* Hero section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-eparnova-blue">Bonjour, Sophie</h1>
          <p className="text-muted-foreground mt-1">Bienvenue sur votre tableau de bord</p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/portfolio/add" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Ajouter un actif</span>
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/statement" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Voir mon bilan</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-eparnova-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">TOTAL DU PATRIMOINE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">325 000 €</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+5.2% depuis 3 mois</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-eparnova-green-light">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">REVENUS MENSUELS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 850 €</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>Salaire net mensuel</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-eparnova-gold">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">ÉPARGNE DISPONIBLE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 500 €</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>Sur livrets et comptes courants</span>
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
          
          {/* Premium Promo */}
          <Card className="bg-gradient-to-br from-eparnova-blue to-eparnova-blue-light text-white border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-eparnova-gold/30 rounded-full -mr-5 -mt-5 blur-xl"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-eparnova-gold" />
                Premium
              </CardTitle>
              <CardDescription className="text-white/80">
                Accédez à toutes les fonctionnalités
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="opacity-90">Analyses personnalisées, simulateurs avancés et bien plus...</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-eparnova-gold text-black hover:bg-eparnova-gold-light" size="sm">
                <span>Découvrir l'offre</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
