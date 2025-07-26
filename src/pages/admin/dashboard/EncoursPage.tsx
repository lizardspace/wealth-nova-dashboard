
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

// Sample data for the charts
const encoursMockData = [
  { month: 'Jan', reel: 420000, theorique: 780000 },
  { month: 'Fév', reel: 430000, theorique: 790000 },
  { month: 'Mar', reel: 450000, theorique: 800000 },
  { month: 'Avr', reel: 470000, theorique: 805000 },
  { month: 'Mai', reel: 500000, theorique: 810000 },
  { month: 'Juin', reel: 520000, theorique: 820000 },
  { month: 'Juil', reel: 550000, theorique: 840000 },
  { month: 'Août', reel: 580000, theorique: 845000 },
  { month: 'Sept', reel: 610000, theorique: 850000 },
  { month: 'Oct', reel: 650000, theorique: 870000 },
  { month: 'Nov', reel: 680000, theorique: 890000 },
  { month: 'Déc', reel: 720000, theorique: 910000 },
];

const assetClassData = [
  { name: "Immobilier", reel: 250000, theorique: 450000 },
  { name: "Assurance Vie", reel: 180000, theorique: 210000 },
  { name: "PER", reel: 120000, theorique: 150000 },
  { name: "Liquidités", reel: 90000, theorique: 180000 },
  { name: "Actions", reel: 50000, theorique: 80000 },
  { name: "SCPI", reel: 30000, theorique: 40000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const EncoursPage = () => {
  const [encoursData, setEncoursData] = useState<any[]>([]);
  const [assetClass, setAssetClass] = useState<any[]>([]);

  useEffect(() => {
    const fetchEncoursData = async () => {
      const tables = [
        'bienimmobilier',
        'assurancevie',
        'comptebancaire',
        'contratcapitalisation',
        'entrepriseparticipation',
        'autrepatrimoine'
      ];

      const promises = tables.map(table => supabase.from(table).select('*'));
      const results = await Promise.all(promises);

      const allData: any[] = [];
      results.forEach((res, index) => {
        if (res.error) {
          console.error(`Error fetching data from ${tables[index]}:`, res.error);
        } else {
          allData.push(...res.data);
        }
      });

      const processedData = allData.map(item => {
        let assetType = 'Autre';
        if (item.hasOwnProperty('type_immobilier')) assetType = 'Immobilier';
        else if (item.hasOwnProperty('type_assurance')) assetType = 'Assurance Vie';
        else if (item.hasOwnProperty('type_compte')) assetType = 'Liquidités';
        else if (item.hasOwnProperty('regime')) assetType = 'PER';
        else if (item.hasOwnProperty('type_entreprise')) assetType = 'Actions';

        return {
          ...item,
          assetType,
          isReel: item.contrat_gere === true,
        };
      });

      const monthlyData: { [key: string]: { reel: number; theorique: number } } = {};
      const assetClassTotals: { [key: string]: { reel: number; theorique: number } } = {};

      processedData.forEach(item => {
        const date = new Date(item.date_acquisition);
        const month = date.toLocaleString('default', { month: 'short' });
        const value = item.value || 0;

        if (!monthlyData[month]) {
          monthlyData[month] = { reel: 0, theorique: 0 };
        }
        if (item.isReel) {
          monthlyData[month].reel += value;
        } else {
          monthlyData[month].theorique += value;
        }

        if (!assetClassTotals[item.assetType]) {
          assetClassTotals[item.assetType] = { reel: 0, theorique: 0 };
        }
        if (item.isReel) {
          assetClassTotals[item.assetType].reel += value;
        } else {
          assetClassTotals[item.assetType].theorique += value;
        }
      });

      const encoursChartData = Object.keys(monthlyData).map(month => ({
        month,
        reel: monthlyData[month].reel,
        theorique: monthlyData[month].theorique,
      }));

      const assetClassChartData = Object.keys(assetClassTotals).map(name => ({
        name,
        reel: assetClassTotals[name].reel,
        theorique: assetClassTotals[name].theorique,
      }));

      setEncoursData(encoursChartData);
      setAssetClass(assetClassChartData);
    };

    fetchEncoursData();
  }, []);

  const totalReel = assetClass.reduce((acc, item) => acc + item.reel, 0);
  const totalTheorique = assetClass.reduce((acc, item) => acc + item.theorique, 0);
  const conversionRate = totalTheorique > 0 ? Math.round((totalReel / totalTheorique) * 100) : 0;
  const evolutionMensuelle = encoursData.length > 1 ? Math.round(((encoursData[encoursData.length - 1].reel - encoursData[encoursData.length - 2].reel) / encoursData[encoursData.length - 2].reel) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Encours Réels vs. Théoriques</h1>
          <p className="text-muted-foreground">
            Suivi de l'évolution des encours sous gestion et déclarés
          </p>
        </div>
        <Button variant="outline" className="mt-2 sm:mt-0">
          <Download className="mr-2 h-4 w-4" />
          Exporter les données
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Encours réel</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalReel)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600 font-medium">
              <TrendingUp className="mr-1 h-4 w-4" />
              +{evolutionMensuelle}% par mois
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Encours théorique</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalTheorique)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Potentiel de conversion élevé
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taux de conversion</CardDescription>
            <CardTitle className="text-2xl">{conversionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600 font-medium">
              <TrendingUp className="mr-1 h-4 w-4" />
              +3% depuis le début d'année
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Opportunités identifiées</CardDescription>
            <CardTitle className="text-2xl">28</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Basées sur l'analyse des encours
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Évolution sur 12 mois</CardTitle>
            <CardDescription>
              Comparaison des encours réels et théoriques
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer config={{
              reel: { color: "#8B5CF6" },
              theorique: { color: "#D1D5DB" },
            }}>
              <LineChart data={encoursData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k€`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line 
                  type="monotone" 
                  name="Encours réel" 
                  dataKey="reel" 
                  stroke="var(--color-reel)" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  name="Encours théorique" 
                  dataKey="theorique" 
                  stroke="var(--color-theorique)" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Répartition par classe d'actif</CardTitle>
            <CardDescription>
              Distribution des encours par type d'investissement
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ChartContainer config={{
              reel: { color: "#8B5CF6" },
              theorique: { color: "#D1D5DB" },
            }}>
              <BarChart data={assetClass} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis type="number" tickFormatter={(value) => `${Math.round(value / 1000)}k€`} />
                <YAxis type="category" dataKey="name" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar name="Encours réel" dataKey="reel" fill="var(--color-reel)" barSize={20} />
                <Bar name="Encours théorique" dataKey="theorique" fill="var(--color-theorique)" barSize={20} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>Opportunités de conversion</AlertTitle>
        <AlertDescription>
          Les encours théoriques dépassent de 26% les encours réels. Principal potentiel identifié : la classe "Immobilier" (écart de 200 k€).
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EncoursPage;
