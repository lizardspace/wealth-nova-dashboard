import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  PieChart,
  XAxis,
  YAxis,
  Bar,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartPie, ChartBar, CalendarRange } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Données d'exemple
const SAMPLE_ASSET_CLASS_DATA = [
  { name: 'Immobilier', reel: 450000, theorique: 550000, fill: '#E6AF2E' },
  { name: 'Financier', reel: 250000, theorique: 320000, fill: '#247BA0' },
  { name: 'Liquidités', reel: 75000, theorique: 110000, fill: '#2E933C' },
  { name: 'Autres', reel: 45000, theorique: 70000, fill: '#3F4756' },
];

const SAMPLE_EVOLUTION_DATA = [
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

const SAMPLE_DETAILED_DATA = {
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

  const handlePieClick = (data: any) => {
    if (drilldownCategory === data.name) {
      setDrilldownCategory(null);
    } else {
      setDrilldownCategory(data.name);
    }
  };

  const chartConfig = {
    reel: {
      label: 'Encours réel',
      theme: { light: '#0A2463', dark: '#0A2463' },
    },
    theorique: {
      label: 'Encours théorique',
      theme: { light: '#E6AF2E', dark: '#E6AF2E' },
    },
  };

  const currentData = drilldownCategory
    ? SAMPLE_DETAILED_DATA[drilldownCategory as keyof typeof SAMPLE_DETAILED_DATA] || []
    : SAMPLE_ASSET_CLASS_DATA;

  return (
    <div className="space-y-8 p-6 pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analyse des Portefeuilles</h1>
        <p className="text-lg text-muted-foreground">Comparaison des encours réels et théoriques</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="min-h-[200px]">
          <CardHeader>
            <CardTitle>Encours Total</CardTitle>
            <CardDescription>Vue globale des actifs</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Réel</p>
              <p className="text-3xl font-bold">820 000 €</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Théorique</p>
              <p className="text-3xl font-bold">1 050 000 €</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Potentiel</p>
              <p className="text-3xl font-bold">230 000 €</p>
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[200px]">
          <CardHeader>
            <CardTitle>Période d'Analyse</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center h-full pt-2">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-full">
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

      {/* Main Content */}
      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
          <TabsTrigger value="repartition" className="flex items-center gap-2 text-md">
            <ChartPie className="h-5 w-5" />
            Répartition
          </TabsTrigger>
          <TabsTrigger value="evolution" className="flex items-center gap-2 text-md">
            <ChartBar className="h-5 w-5" />
            Évolution
          </TabsTrigger>
        </TabsList>

        {/* Asset Allocation Tab */}
        <TabsContent value="repartition" className="space-y-8">
          <Card className="min-h-[750px]">
            <CardHeader>
              <CardTitle className="text-2xl">
                {drilldownCategory
                  ? `Détail ${drilldownCategory}`
                  : "Répartition par Classe d'Actifs"}
              </CardTitle>
              <CardDescription className="text-lg">
                {drilldownCategory
                  ? `Composition détaillée (cliquez pour revenir)`
                  : 'Comparaison encours réel vs théorique (cliquez pour détailler)'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[650px] pt-6">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 20, right: 20, bottom: 140, left: 20 }}>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      wrapperStyle={{
                        paddingTop: '40px',
                        bottom: '40px',
                      }}
                    />
                    <Pie
                      data={currentData}
                      dataKey="reel"
                      nameKey="name"
                      cx="30%"
                      cy="50%"
                      outerRadius={160}
                      label={({ name, value }) => `${name}\n${formatEuro(value)}`}
                      labelLine={false}
                      onClick={handlePieClick}
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
                      outerRadius={160}
                      label={({ name, value }) => `${name}\n${formatEuro(value)}`}
                      labelLine={false}
                      onClick={handlePieClick}
                    >
                      {currentData.map((entry, index) => (
                        <Cell key={`cell-theorique-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Carte de comparaison détaillée avec hauteur augmentée */}
          <Card className="min-h-[800px]">
            <CardHeader>
              <CardTitle className="text-2xl">Comparaison Détaillée</CardTitle>
              <CardDescription className="text-lg">
                Écarts entre encours réel et théorique
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[700px] pt-6">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentData}
                    margin={{
                      top: 40,
                      right: 40,
                      left: 80,
                      bottom: 160,
                    }}
                    layout="vertical"
                  >
                    <XAxis type="number" tickFormatter={formatEuro} tick={{ fontSize: 14 }} />
                    <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 14 }} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      wrapperStyle={{
                        paddingTop: '60px',
                        bottom: '60px',
                      }}
                    />
                    <Bar
                      dataKey="reel"
                      name="Encours réel"
                      fill="#0A2463"
                      radius={[0, 4, 4, 0]}
                      barSize={30}
                    />
                    <Bar
                      dataKey="theorique"
                      name="Encours théorique"
                      fill="#E6AF2E"
                      radius={[0, 4, 4, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evolution Tab */}
        <TabsContent value="evolution" className="space-y-8">
          <Card className="min-h-[750px]">
            <CardHeader>
              <CardTitle className="text-2xl">Évolution Temporelle</CardTitle>
              <CardDescription className="text-lg">Progression sur 12 mois</CardDescription>
            </CardHeader>
            <CardContent className="h-[650px] pt-6">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={SAMPLE_EVOLUTION_DATA}
                    margin={{ top: 20, right: 30, left: 20, bottom: 140 }}
                  >
                    <XAxis
                      dataKey="mois"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tickFormatter={formatEuro} tick={{ fontSize: 12 }} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      wrapperStyle={{
                        paddingTop: '40px',
                        bottom: '40px',
                      }}
                    />
                    <Bar dataKey="reel" name="Encours réel" fill="#0A2463" radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="theorique"
                      name="Encours théorique"
                      fill="#E6AF2E"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Analysis Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Analyse et Recommandations</CardTitle>
                  <CardDescription className="text-lg">
                    Insights basés sur les données
                  </CardDescription>
                </div>
                <CalendarRange className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 py-6">
              {/* ... (votre contenu d'analyse) */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysePage;
