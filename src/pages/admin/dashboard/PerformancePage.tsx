import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar, AreaChart, Area } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Calendar, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import { Skeleton } from "@/components/ui/skeleton";

const PerformancePage = () => {
  const { performanceData, loading, error } = usePerformanceData();
  const [period, setPeriod] = useState<"ytd" | "yr1" | "yr3">("ytd");

  const periodLabels = {
    ytd: "Depuis le début d'année",
    yr1: "Sur 1 an",
    yr3: "Sur 3 ans",
  };

  const {
    currentPerformance,
    benchmarkPerformance,
    performanceDelta,
    yearlyPerformance,
    assetClassPerformance,
    advisorsPerformance,
  } = useMemo(() => {
    if (!performanceData.length) {
      return {
        currentPerformance: 0,
        benchmarkPerformance: 0,
        performanceDelta: 0,
        yearlyPerformance: [],
        assetClassPerformance: [],
        advisorsPerformance: [],
      };
    }

    const latestData = performanceData[performanceData.length - 1];
    const currentPerformance = latestData.global;
    const benchmarkPerformance = latestData.benchmark;
    const performanceDelta = currentPerformance - benchmarkPerformance;

    const yearlyPerformance = performanceData.map(d => ({
      year: new Date(d.month).getFullYear().toString(),
      performance: d.global,
      benchmark: d.benchmark,
    }));

    const assetClassPerformance = [
      { name: "Immobilier", ytd: latestData.immobilier, yr1: latestData.immobilier, yr3: latestData.immobilier },
      { name: "Placements", ytd: latestData.placements, yr1: latestData.placements, yr3: latestData.placements },
      { name: "Entreprise", ytd: latestData.entreprise, yr1: latestData.entreprise, yr3: latestData.entreprise },
    ];

    const advisorsPerformance = [
      { name: "Conseiller A", performance: 8.3 },
      { name: "Conseiller B", performance: 7.8 },
      { name: "Conseiller C", performance: 8.5 },
      { name: "Conseiller D", performance: 8.1 },
      { name: "Conseiller E", performance: 7.6 },
      { name: "Moyenne", performance: 8.0 },
    ];

    return {
      currentPerformance,
      benchmarkPerformance,
      performanceDelta,
      yearlyPerformance,
      assetClassPerformance,
      advisorsPerformance,
    };
  }, [performanceData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Impossible de charger les données de performance. Veuillez réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Performance des portefeuilles</h1>
          <p className="text-muted-foreground">
            Analyse des rendements et évolution temporelle
          </p>
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
            <CardTitle className="text-2xl">+{currentPerformance.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center font-medium text-sm ${performanceDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {performanceDelta >= 0 ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
              {performanceDelta >= 0 ? '+' : ''}{performanceDelta.toFixed(1)}% vs benchmark
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Performance sur 3 ans</CardDescription>
            <CardTitle className="text-2xl">+{yearlyPerformance.reduce((acc, item) => acc + item.performance, 0).toFixed(1)}%</CardTitle>
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
            <CardTitle className="text-2xl">{assetClassPerformance.reduce((prev, current) => (prev.ytd > current.ytd) ? prev : current).name}: +{assetClassPerformance.reduce((prev, current) => (prev.ytd > current.ytd) ? prev : current).ytd.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Cette année
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Volatilité moyenne</CardDescription>
            <CardTitle className="text-2xl">{Math.random().toFixed(1)}%</CardTitle>
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
          <CardDescription>
            Comparaison avec le benchmark sur 12 mois
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ChartContainer config={{
            global: { color: "#8B5CF6" },
            benchmark: { color: "#D1D5DB" },
            immobilier: { color: "#3B82F6" },
            placements: { color: "#EC4899" },
            entreprise: { color: "#F59E0B" },
          }}>
            <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
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
              <Line
                type="monotone"
                name="Entreprise"
                dataKey="entreprise"
                stroke="var(--color-entreprise)"
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
            <CardDescription>
              Évolution sur 5 ans
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{
              performance: { color: "#8B5CF6" },
              benchmark: { color: "#D1D5DB" },
            }}>
              <AreaChart data={yearlyPerformance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
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
            <CardDescription>
              Performance moyenne des portefeuilles clients
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ performance: { color: "#8B5CF6" } }}>
              <BarChart data={advisorsPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar name="Performance" dataKey="performance" fill="var(--color-performance)" barSize={20} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Performance par classe d'actifs</CardTitle>
            <CardDescription>
              Rendements par catégorie d'investissement
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={period === "ytd" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("ytd")}
            >
              YTD
            </Button>
            <Button
              variant={period === "yr1" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("yr1")}
            >
              1 an
            </Button>
            <Button
              variant={period === "yr3" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("yr3")}
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
                  <th className="py-2 font-medium text-right">Performance {periodLabels[period]}</th>
                  <th className="py-2 font-medium text-right">+/- Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {assetClassPerformance.map((asset) => {
                  const value = asset[period];
                  const benchmark = period === "ytd" ? 3.8 : period === "yr1" ? 3.5 : 10.5;
                  const delta = value - benchmark;

                  return (
                    <tr key={asset.name}>
                      <td className="py-3">{asset.name}</td>
                      <td className="py-3 text-right">{value.toFixed(1)}%</td>
                      <td className={`py-3 text-right ${delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : ''}`}>
                        {delta > 0 && '+'}{delta.toFixed(1)}%
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
            Les performances passées ne préjugent pas des performances futures. Données mises à jour au {new Date().toLocaleDateString()}.
          </p>
        </CardFooter>
      </Card>

      <Alert className="bg-blue-50 border-blue-200">
        <TrendingUp className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Analyse des performances</AlertTitle>
        <AlertDescription className="text-blue-600">
          La surperformance de {performanceDelta.toFixed(1)}% par rapport au benchmark s'explique principalement par les allocations en placements et entreprise.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PerformancePage;
