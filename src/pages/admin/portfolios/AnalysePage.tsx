
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, XAxis, YAxis, Bar, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartPie, ChartBar, CalendarRange } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample data - would be replaced with real data from API
const assetClassData = [
  { name: 'Immobilier', reel: 450000, theorique: 550000, fill: '#E6AF2E' },
  { name: 'Financier', reel: 250000, theorique: 320000, fill: '#247BA0' },
  { name: 'Liquidités', reel: 75000, theorique: 110000, fill: '#2E933C' },
  { name: 'Autres', reel: 45000, theorique: 70000, fill: '#3F4756' },
];

const evolutionData = [
  { mois: 'Jan', reel: 780000, theorique: 980000 },
  { mois: 'Fév', reel: 800000, theorique: 1000000 },
  { mois: 'Mar', reel: 820000, theorique: 1020000 },
  { mois: 'Avr', reel: 810000, theorique: 1030000 },
  { mois: 'Mai', reel: 830000, theorique: 1050000 },
  { mois: 'Juin', reel: 850000, theorique: 1070000 },
  { mois: 'Juil', reel: 880000, theorique: 1080000 },
  { mois: 'Août', reel: 920000, theorique: 1100000 },
  { mois: 'Sep', reel: 950000, theorique: 1120000 },
  { mois: 'Oct', reel: 980000, theorique: 1150000 },
  { mois: 'Nov', reel: 1000000, theorique: 1170000 },
  { mois: 'Déc', reel: 1050000, theorique: 1200000 },
];

// Detailed data for drilling down
const detailedAssetData = {
  Immobilier: [
    { name: 'Résidence Principale', reel: 320000, theorique: 350000, fill: '#F9D56E' },
    { name: 'Locatif', reel: 130000, theorique: 200000, fill: '#E6AF2E' },
  ],
  Financier: [
    { name: 'Assurance Vie', reel: 120000, theorique: 170000, fill: '#5BBA6F' },
    { name: 'PER', reel: 80000, theorique: 100000, fill: '#2E933C' },
    { name: 'Actions', reel: 50000, theorique: 50000, fill: '#0A2463' },
  ],
  Liquidités: [
    { name: 'Livrets', reel: 40000, theorique: 60000, fill: '#247BA0' },
    { name: 'Compte Courant', reel: 35000, theorique: 50000, fill: '#0A2463' },
  ],
  Autres: [
    { name: 'Art', reel: 25000, theorique: 40000, fill: '#3F4756' },
    { name: 'Autres', reel: 20000, theorique: 30000, fill: '#EAEDF2' },
  ],
};

const formatEuro = (value: number) => `${value.toLocaleString('fr-FR')} €`;

const AnalysePage = () => {
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [drilldownCategory, setDrilldownCategory] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState('repartition');

  // Handle click on a pie chart slice to drill down
  const handlePieClick = (data: any) => {
    if (drilldownCategory === data.name) {
      setDrilldownCategory(null);
    } else {
      setDrilldownCategory(data.name);
    }
  };

  // Chart config for the tooltip
  const chartConfig = {
    reel: {
      label: "Encours réel",
      theme: { light: "#0A2463", dark: "#0A2463" },
    },
    theorique: {
      label: "Encours théorique",
      theme: { light: "#E6AF2E", dark: "#E6AF2E" },
    },
  };

  const currentData = drilldownCategory ? detailedAssetData[drilldownCategory as keyof typeof detailedAssetData] : assetClassData;

  return (
    <div className="space-y-6 p-6 pb-16 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-eparnova-blue">Analyse des Portefeuilles</h1>
        <p className="text-muted-foreground">Comparaison des encours réels et théoriques pour analyse détaillée</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle>Encours Total</CardTitle>
            <CardDescription>Vision actuelle des actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Encours Réel</p>
                <p className="text-2xl font-bold text-eparnova-blue">820 000 €</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Encours Théorique</p>
                <p className="text-2xl font-bold text-eparnova-gold">1 050 000 €</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Potentiel de Conversion</p>
                <p className="text-2xl font-bold text-eparnova-green">230 000 €</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-auto">
          <CardHeader className="pb-2">
            <CardTitle>Période d'Analyse</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuelle</SelectItem>
                <SelectItem value="quarterly">Trimestrielle</SelectItem>
                <SelectItem value="yearly">Annuelle</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="repartition" className="flex items-center gap-2">
              <ChartPie className="h-4 w-4" />
              Répartition des Actifs
            </TabsTrigger>
            <TabsTrigger value="evolution" className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              Évolution Temporelle
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="repartition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {drilldownCategory 
                  ? `Détail ${drilldownCategory} (Cliquez pour revenir)`
                  : 'Répartition par Classe d\'Actifs (Cliquez pour détailler)'}
              </CardTitle>
              <CardDescription>
                {drilldownCategory
                  ? `Vue détaillée des composants de la catégorie ${drilldownCategory}`
                  : 'Comparaison encours réel vs théorique par catégorie'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 px-2">
              <div className="h-96 w-full">
                <ChartContainer config={chartConfig}>
                  <PieChart>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Pie
                      data={currentData}
                      dataKey="reel"
                      nameKey="name"
                      cx="30%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${formatEuro(value)}`}
                      onClick={handlePieClick}
                      isAnimationActive={true}
                      animationDuration={800}
                    >
                      {currentData.map((entry, index) => (
                        <Cell key={`cell-reel-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Pie
                      data={currentData}
                      dataKey="theorique"
                      nameKey="name"
                      cx="70%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${formatEuro(value)}`}
                      onClick={handlePieClick}
                      isAnimationActive={true}
                      animationDuration={800}
                    >
                      {currentData.map((entry, index) => (
                        <Cell key={`cell-theorique-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex justify-center">
                  <p className="text-lg font-semibold text-eparnova-blue">Encours Réel</p>
                </div>
                <div className="flex justify-center">
                  <p className="text-lg font-semibold text-eparnova-gold">Encours Théorique</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Comparaison Détaillée</CardTitle>
              <CardDescription>Visualisation par barres des écarts entre encours</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 px-2">
              <div className="h-80 w-full">
                <ChartContainer config={chartConfig}>
                  <BarChart data={currentData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatEuro} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="reel" name="Encours réel" fill="#0A2463" />
                    <Bar dataKey="theorique" name="Encours théorique" fill="#E6AF2E" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Encours</CardTitle>
              <CardDescription>Suivi temporel des valeurs d'encours</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 px-2">
              <div className="h-96 w-full">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer>
                    <BarChart data={evolutionData}>
                      <XAxis dataKey="mois" />
                      <YAxis tickFormatter={formatEuro} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="reel" name="Encours réel" fill="#0A2463" />
                      <Bar dataKey="theorique" name="Encours théorique" fill="#E6AF2E" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tendances et Analyse</CardTitle>
                <CardDescription>Insights et recommandations basés sur l'analyse des données</CardDescription>
              </div>
              <CalendarRange className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-eparnova-blue pl-4">
                  <h4 className="font-semibold">Potentiel d'Encours</h4>
                  <p className="text-sm text-muted-foreground">
                    Un écart de 230 000 € identifié entre l'encours théorique et réel, 
                    soit un potentiel de conversion de 22% des actifs suivis.
                  </p>
                </div>
                
                <div className="border-l-4 border-eparnova-green pl-4">
                  <h4 className="font-semibold">Progression Positive</h4>
                  <p className="text-sm text-muted-foreground">
                    Croissance continue de l'encours réel sur les 6 derniers mois (+10%),
                    indiquant une tendance positive de conversion.
                  </p>
                </div>
                
                <div className="border-l-4 border-eparnova-gold pl-4">
                  <h4 className="font-semibold">Opportunités Principales</h4>
                  <p className="text-sm text-muted-foreground">
                    Le secteur immobilier locatif présente le plus fort potentiel 
                    d'augmentation d'encours réel (70 000 €), suivi des assurances vie (50 000 €).
                  </p>
                </div>
                
                <div className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-semibold">Recommandations</h4>
                  <p className="text-sm text-muted-foreground">
                    Cibler prioritairement la conversion des comptes assurance vie et 
                    investissements locatifs, qui représentent 52% du potentiel total.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysePage;
