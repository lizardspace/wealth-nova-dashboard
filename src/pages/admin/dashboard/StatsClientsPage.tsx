import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Users, Brain, TrendingUp } from "lucide-react";

// Sample data for clients statistics
const clientsTotalData = [
  { month: "Jan", clients: 120 },
  { month: "Fév", clients: 132 },
  { month: "Mar", clients: 145 },
  { month: "Avr", clients: 155 },
  { month: "Mai", clients: 170 },
  { month: "Juin", clients: 184 },
  { month: "Juil", clients: 192 },
  { month: "Août", clients: 200 },
  { month: "Sept", clients: 215 },
  { month: "Oct", clients: 230 },
  { month: "Nov", clients: 245 },
  { month: "Déc", clients: 260 },
];

const clientsAgeData = [
  { name: "18-25 ans", value: 15 },
  { name: "26-35 ans", value: 65 },
  { name: "36-45 ans", value: 85 },
  { name: "46-55 ans", value: 50 },
  { name: "56-65 ans", value: 35 },
  { name: "+65 ans", value: 10 },
];

const clientsScoreData = [
  { score: "0-20", clients: 12 },
  { score: "21-40", clients: 35 },
  { score: "41-60", clients: 78 },
  { score: "61-80", clients: 95 },
  { score: "81-100", clients: 40 },
];

const clientsObjectifsData = [
  { name: "Préparation retraite", value: 95 },
  { name: "Achat immobilier", value: 70 },
  { name: "Optimisation fiscale", value: 55 },
  { name: "Transmission", value: 45 },
  { name: "Placement", value: 85 },
  { name: "Autre", value: 25 },
];

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B', '#6366F1'];

const StatsClientsPage = () => {
  const activeClients = 205;
  const inactiveClients = 55;
  const totalClients = activeClients + inactiveClients;
  const completedProfiles = 187;
  const incompleteProfiles = 73;
  const averageScore = 64;

  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Statistiques Clients</h1>
          <p className="text-muted-foreground">
            Analyse démographique et comportementale de la clientèle
          </p>
        </div>
        <Button variant="outline" className="mt-2 sm:mt-0">
          <Download className="mr-2 h-4 w-4" />
          Exporter les statistiques
        </Button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="min-h-[180px] flex flex-col">
          <CardHeader className="pb-2">
            <CardDescription>Total clients</CardDescription>
            <CardTitle className="text-2xl">{totalClients}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-end">
            <div className="flex items-center text-sm text-green-600 font-medium">
              <TrendingUp className="mr-1 h-4 w-4" />
              +15 nouveaux ce mois
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[180px] flex flex-col">
          <CardHeader className="pb-2">
            <CardDescription>Clients actifs</CardDescription>
            <CardTitle className="text-2xl">{activeClients} ({Math.round((activeClients/totalClients)*100)}%)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-end">
            <div className="text-sm text-muted-foreground">
              Connexion dans les 30 derniers jours
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[180px] flex flex-col">
          <CardHeader className="pb-2">
            <CardDescription>Profils complets</CardDescription>
            <CardTitle className="text-2xl">{completedProfiles} ({Math.round((completedProfiles/totalClients)*100)}%)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-end">
            <div className="text-sm text-muted-foreground">
              Questionnaires finalisés
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[180px] flex flex-col">
          <CardHeader className="pb-2">
            <CardDescription>Score patrimonial moyen</CardDescription>
            <CardTitle className="text-2xl">{averageScore}/100</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-end">
            <div className="text-sm text-muted-foreground">
              Calculé par l'IA Eparnova
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="min-h-[450px] flex flex-col">
          <CardHeader>
            <CardTitle>Évolution du nombre de clients</CardTitle>
            <CardDescription>
              Croissance mensuelle sur 12 mois
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={{ clients: { color: "#8B5CF6" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={clientsTotalData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    name="Nombre de clients" 
                    dataKey="clients" 
                    fill="var(--color-clients)" 
                    barSize={30} 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="min-h-[450px] flex flex-col">
          <CardHeader>
            <CardTitle>Répartition par âge</CardTitle>
            <CardDescription>
              Segmentation démographique des clients
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clientsAgeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {clientsAgeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="min-h-[450px] flex flex-col">
          <CardHeader>
            <CardTitle>Distribution des scores patrimoniaux</CardTitle>
            <CardDescription>
              Évaluation IA des situations patrimoniales
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={{ clients: { color: "#8B5CF6" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={clientsScoreData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                  <XAxis dataKey="score" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    name="Nombre de clients" 
                    dataKey="clients" 
                    fill="var(--color-clients)" 
                    barSize={40} 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="min-h-[450px] flex flex-col">
          <CardHeader>
            <CardTitle>Objectifs patrimoniaux</CardTitle>
            <CardDescription>
              Principales motivations des clients
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={clientsObjectifsData} 
                  layout="vertical" 
                  margin={{ top: 20, right: 30, left: 80, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100} 
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="value" 
                    fill="#8B5CF6" 
                    barSize={25} 
                    radius={[0, 4, 4, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsClientsPage;