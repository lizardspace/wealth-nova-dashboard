import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ArrowRight } from 'lucide-react';

const StatementPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-eparnova-blue">Bilan Patrimonial</h1>
        <p className="text-muted-foreground mt-1">Analyse complète de votre situation financière</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-eparnova-blue">
              Bilan patrimonial au 01/05/2025
            </h2>
            <p className="text-muted-foreground">Dernière mise à jour: aujourd'hui</p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Télécharger en PDF</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Actif</CardTitle>
              <CardDescription>Ce que vous possédez</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>Immobilier</span>
                  <span className="font-medium">195 000 €</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>Placements financiers</span>
                  <span className="font-medium">87 500 €</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>Liquidités</span>
                  <span className="font-medium">42 500 €</span>
                </div>
                <div className="flex justify-between items-center font-bold text-eparnova-blue pt-2">
                  <span>TOTAL ACTIF</span>
                  <span>325 000 €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Passif</CardTitle>
              <CardDescription>Ce que vous devez</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>Prêt immobilier</span>
                  <span className="font-medium">125 000 €</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>Crédit à la consommation</span>
                  <span className="font-medium">8 500 €</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span>Autres dettes</span>
                  <span className="font-medium">0 €</span>
                </div>
                <div className="flex justify-between items-center font-bold text-eparnova-blue pt-2">
                  <span>TOTAL PASSIF</span>
                  <span>133 500 €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-md">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Patrimoine Net</h3>
            <div className="text-2xl font-bold text-eparnova-blue">191 500 €</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-eparnova-blue/90 to-eparnova-blue text-white border-none">
          <CardHeader>
            <CardTitle>Analyse complète</CardTitle>
            <CardDescription className="text-white/80">
              Rapport détaillé pour votre conseiller
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90 mb-4">
              Obtenez une analyse approfondie de votre patrimoine avec des recommandations
              personnalisées.
            </p>
            <Button className="w-full bg-white text-eparnova-blue hover:bg-white/90">
              <FileText className="h-4 w-4 mr-2" />
              <span>Générer un rapport</span>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progression annuelle</CardTitle>
            <CardDescription>Évolution de votre patrimoine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>2025 (actuel)</span>
                <span className="font-medium">191 500 €</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>2024</span>
                <span>182 000 €</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>2023</span>
                <span>172 500 €</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <span>Voir l'historique complet</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
            <CardDescription>Basées sur votre situation actuelle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                Attention à la concentration de votre patrimoine dans l'immobilier (60%).
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                Pensez à augmenter votre exposition en actions pour plus de rendement.
              </div>
              <Button variant="outline" className="w-full mt-4">
                <span>Toutes les recommandations</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatementPage;
