import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AssetDistributionChart from '@/components/dashboard/AssetDistributionChart';

const PortfolioPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-eparnova-blue">Mon Portefeuille</h1>
          <p className="text-muted-foreground mt-1">Gestion et suivi de vos actifs financiers</p>
        </div>
        <Button asChild>
          <Link to="/portfolio/add" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Ajouter un actif</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AssetDistributionChart />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé</CardTitle>
              <CardDescription>Vue globale de votre portefeuille</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Valeur totale</span>
                  <span className="font-medium text-lg">325 000 €</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Rendement annuel moyen</span>
                  <span className="font-medium text-green-600">+4,8%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Nombre d'actifs</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Dernier ajout</span>
                  <span className="font-medium">22 avril 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
