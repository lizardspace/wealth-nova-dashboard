import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Sample data for performance charts
const performanceData = [
  { month: 'Jan', global: 1.2, benchmark: 0.9, immobilier: 0.8, placements: 1.5 },
  { month: 'Fév', global: 0.9, benchmark: 0.7, immobilier: 0.5, placements: 1.2 },
  { month: 'Mar', global: 1.5, benchmark: 0.9, immobilier: 1.0, placements: 1.8 },
  { month: 'Avr', global: 1.8, benchmark: 1.3, immobilier: 1.2, placements: 2.1 },
  { month: 'Mai', global: 1.4, benchmark: 1.1, immobilier: 0.9, placements: 1.7 },
  { month: 'Juin', global: 1.0, benchmark: 0.8, immobilier: 0.7, placements: 1.2 },
  { month: 'Juil', global: 1.3, benchmark: 1.0, immobilier: 0.8, placements: 1.6 },
  { month: 'Août', global: 1.6, benchmark: 1.2, immobilier: 1.1, placements: 1.9 },
  { month: 'Sept', global: 1.9, benchmark: 1.5, immobilier: 1.3, placements: 2.2 },
  { month: 'Oct', global: 2.1, benchmark: 1.7, immobilier: 1.5, placements: 2.4 },
  { month: 'Nov', global: 1.7, benchmark: 1.4, immobilier: 1.2, placements: 2.0 },
  { month: 'Déc', global: 2.2, benchmark: 1.8, immobilier: 1.6, placements: 2.5 },
];

const yearlyPerformance = [
  { year: '2020', performance: 4.2, benchmark: 3.8 },
  { year: '2021', performance: 5.8, benchmark: 4.5 },
  { year: '2022', performance: 3.7, benchmark: 3.2 },
  { year: '2023', performance: 6.5, benchmark: 5.1 },
  { year: '2024', performance: 8.3, benchmark: 6.7 },
];

const assetClassPerformance = [
  { name: 'Assurance Vie', ytd: 4.2, yr1: 3.9, yr3: 11.5 },
  { name: 'PER', ytd: 3.8, yr1: 3.6, yr3: 10.8 },
  { name: 'SCPI', ytd: 5.1, yr1: 4.9, yr3: 14.2 },
  { name: 'Actions', ytd: 7.3, yr1: 6.8, yr3: 22.5 },
  { name: 'Fonds €', ytd: 2.5, yr1: 2.3, yr3: 6.9 },
  { name: 'Immobilier', ytd: 3.6, yr1: 3.4, yr3: 9.8 },
];

// Performance comparison across advisors
const advisorsPerformance = [
  { name: 'Conseiller A', performance: 8.3 },
  { name: 'Conseiller B', performance: 7.8 },
  { name: 'Conseiller C', performance: 8.5 },
  { name: 'Conseiller D', performance: 8.1 },
  { name: 'Conseiller E', performance: 7.6 },
  { name: 'Moyenne', performance: 8.0 },
];

const PerformancePage = () => {
  const [period, setPeriod] = useState<'ytd' | 'yr1' | 'yr3'>('ytd');

  const periodLabels = {
    ytd: "Depuis le début d'année",
    yr1: 'Sur 1 an',
    yr3: 'Sur 3 ans',
  };

  const currentPerformance = 8.3;
  const benchmarkPerformance = 6.7;
  const performanceDelta = currentPerformance - benchmarkPerformance;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Performance des portefeuilles</h1>
          <p className="text-muted-foreground">Analyse des rendements et évolution temporelle</p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Période
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Performance annuelle</CardDescription>
            <CardTitle className="text-2xl">+{currentPerformance}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-green-600 font-medium text-sm">
              <TrendingUp className="mr-1 h-4 w-4" />+{performanceDelta.toFixed(1)}% vs benchmark
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Performance sur 3 ans</CardDescription>
            <CardTitle className="text-2xl">+21.4%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-600 font-medium">
              <TrendingUp className="mr-1 h-4 w-4 inline" />
              +3.2% vs benchmark
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Meilleure classe d'actifs</CardDescription>
            <CardTitle className="text-2xl">Actions: +7.3%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Cette année</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Volatilité moyenne</CardDescription>
            <CardTitle className="text-2xl">4.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-green-600 font-medium text-sm">
              <TrendingDown className="mr-1 h-4 w-4" />
              -0.8% par rapport à l'an dernier
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution de la performance</CardTitle>
          <CardDescription>Comparaison avec le benchmark sur 12 mois</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ChartContainer
            config={{
              global: { color: '#8B5CF6' },
              benchmark: { color: '#D1D5DB' },
              immobilier: { color: '#3B82F6' },
              placements: { color: '#EC4899' },
            }}
          >
            <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={value => `${value}%`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                name="Performance globale"
                dataKey="global"
                stroke="var(--color-global)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                name="Benchmark"
                dataKey="benchmark"
                stroke="var(--color-benchmark)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                name="Immobilier"
                dataKey="immobilier"
                stroke="var(--color-immobilier)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                name="Placements financiers"
                dataKey="placements"
                stroke="var(--color-placements)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance annuelle historique</CardTitle>
            <CardDescription>Évolution sur 5 ans</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                performance: { color: '#8B5CF6' },
                benchmark: { color: '#D1D5DB' },
              }}
            >
              <AreaChart
                data={yearlyPerformance}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={value => `${value}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area
                  type="monotone"
                  name="Performance"
                  dataKey="performance"
                  stroke="var(--color-performance)"
                  fill="var(--color-performance)"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  name="Benchmark"
                  dataKey="benchmark"
                  stroke="var(--color-benchmark)"
                  fill="var(--color-benchmark)"
                  fillOpacity={0.3}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparaison des conseillers</CardTitle>
            <CardDescription>Performance moyenne des portefeuilles clients</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ performance: { color: '#8B5CF6' } }}>
              <BarChart
                data={advisorsPerformance}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis type="number" tickFormatter={value => `${value}%`} />
                <YAxis type="category" dataKey="name" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  name="Performance"
                  dataKey="performance"
                  fill="var(--color-performance)"
                  barSize={20}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Performance par classe d'actifs</CardTitle>
            <CardDescription>Rendements par catégorie d'investissement</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={period === 'ytd' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('ytd')}
            >
              YTD
            </Button>
            <Button
              variant={period === 'yr1' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('yr1')}
            >
              1 an
            </Button>
            <Button
              variant={period === 'yr3' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('yr3')}
            >
              3 ans
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 font-medium">Classe d'actifs</th>
                  <th className="py-2 font-medium text-right">
                    Performance {periodLabels[period]}
                  </th>
                  <th className="py-2 font-medium text-right">+/- Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {assetClassPerformance.map(asset => {
                  const value = asset[period];
                  const benchmark = period === 'ytd' ? 3.8 : period === 'yr1' ? 3.5 : 10.5;
                  const delta = value - benchmark;

                  return (
                    <tr key={asset.name}>
                      <td className="py-3">{asset.name}</td>
                      <td className="py-3 text-right">{value}%</td>
                      <td
                        className={`py-3 text-right ${delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : ''}`}
                      >
                        {delta > 0 && '+'}
                        {delta.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Les performances passées ne préjugent pas des performances futures. Données mises à jour
            au 15/04/2024.
          </p>
        </CardFooter>
      </Card>

      <Alert className="bg-blue-50 border-blue-200">
        <TrendingUp className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Analyse des performances</AlertTitle>
        <AlertDescription className="text-blue-600">
          La surperformance de 1.6% par rapport au benchmark s'explique principalement par les
          allocations actions et SCPI. La stratégie d'allocation en actions internationales a permis
          de dégager un alpha significatif.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PerformancePage;
