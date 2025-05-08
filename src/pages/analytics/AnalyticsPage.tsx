import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-eparnova-blue">Analyses</h1>
        <p className="text-muted-foreground mt-1">
          Insights et analyses approfondies de votre patrimoine
        </p>
      </div>

      <div className="bg-gradient-to-br from-eparnova-gold/20 to-amber-100 p-6 rounded-md flex items-center gap-4 mb-6">
        <div className="bg-white rounded-full p-2 shadow-sm">
          <Star className="h-6 w-6 text-eparnova-gold" />
        </div>
        <div>
          <h2 className="text-lg font-medium mb-1">Fonctionnalité Premium</h2>
          <p className="text-sm text-muted-foreground">
            L'accès aux analyses avancées est réservé aux membres Premium. Découvrez tous les
            avantages de l'abonnement Premium pour optimiser la gestion de votre patrimoine.
          </p>
        </div>
        <button className="ml-auto bg-eparnova-gold hover:bg-eparnova-gold/90 text-black font-medium py-2 px-4 rounded">
          Passer à Premium
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 pointer-events-none">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Historique</CardTitle>
            <CardDescription>Analyse de rendement sur plusieurs périodes</CardDescription>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground text-center">Graphique de performance historique</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comparaison Benchmarks</CardTitle>
            <CardDescription>Votre performance vs indices de référence</CardDescription>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Graphique de comparaison avec benchmarks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exposition par Secteurs</CardTitle>
            <CardDescription>Répartition sectorielle de vos investissements</CardDescription>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground text-center">Graphique d'exposition sectorielle</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Analyse de Risque</CardTitle>
            <CardDescription>Évaluation détaillée du profil de risque</CardDescription>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground text-center">Tableau d'analyse de risque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Opportunités d'Optimisation</CardTitle>
            <CardDescription>Recommandations personnalisées</CardDescription>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Liste des opportunités d'optimisation
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
