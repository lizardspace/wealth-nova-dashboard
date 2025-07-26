import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { supabase } from "@/lib/supabase";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Users, Brain, TrendingUp } from "lucide-react";

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B', '#6366F1'];

const StatsClientsPage = () => {
  const [clientsTotalData, setClientsTotalData] = useState([]);
  const [clientsAgeData, setClientsAgeData] = useState([]);
  const [clientsScoreData, setClientsScoreData] = useState([]);
  const [clientsObjectifsData, setClientsObjectifsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: users, error: usersError } = await supabase.from('users').select('id, created_at, last_login');
        if (usersError) throw usersError;

        const { data: personalInfos, error: personalInfosError } = await supabase.from('personalinfo').select('user_id, age, objectifs_patrimoniaux');
        if (personalInfosError) throw personalInfosError;

        const { data: profiles, error: profilesError } = await supabase.from('profileinvestisseur').select('user_id, score');
        if (profilesError) throw profilesError;

        // Process data here
        const totalClientsData = users.reduce((acc, user) => {
          const month = new Date(user.created_at).toLocaleString('default', { month: 'short' });
          const year = new Date(user.created_at).getFullYear();
          const key = `${month} ${year}`;
          if (!acc[key]) {
            acc[key] = { month: key, clients: 0 };
          }
          acc[key].clients++;
          return acc;
        }, {} as Record<string, { month: string; clients: number }>);
        setClientsTotalData(Object.values(totalClientsData));

        const ageData = personalInfos.reduce((acc, info) => {
          const age = info.age;
          if (age >= 18 && age <= 25) acc['18-25 ans']++;
          else if (age >= 26 && age <= 35) acc['26-35 ans']++;
          else if (age >= 36 && age <= 45) acc['36-45 ans']++;
          else if (age >= 46 && age <= 55) acc['46-55 ans']++;
          else if (age >= 56 && age <= 65) acc['56-65 ans']++;
          else if (age > 65) acc['+65 ans']++;
          return acc;
        }, { '18-25 ans': 0, '26-35 ans': 0, '36-45 ans': 0, '46-55 ans': 0, '56-65 ans': 0, '+65 ans': 0 } as Record<string, number>);
        setClientsAgeData(Object.entries(ageData).map(([name, value]) => ({ name, value })));

        const scoreData = profiles.reduce((acc, profile) => {
            const score = profile.score;
            if (score >= 0 && score <= 20) acc['0-20']++;
            else if (score >= 21 && score <= 40) acc['21-40']++;
            else if (score >= 41 && score <= 60) acc['41-60']++;
            else if (score >= 61 && score <= 80) acc['61-80']++;
            else if (score >= 81 && score <= 100) acc['81-100']++;
            return acc;
        }, { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 } as Record<string, number>);
        setClientsScoreData(Object.entries(scoreData).map(([score, clients]) => ({ score, clients })));

        const objectifsData = personalInfos.reduce((acc, info) => {
            info.objectifs_patrimoniaux.forEach((objectif: string) => {
                if (!acc[objectif]) {
                    acc[objectif] = 0;
                }
                acc[objectif]++;
            });
            return acc;
        }, {} as Record<string, number>);
        setClientsObjectifsData(Object.entries(objectifsData).map(([name, value]) => ({ name, value })));

        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [totalClients, setTotalClients] = useState(0);
  const [activeClients, setActiveClients] = useState(0);
  const [completedProfiles, setCompletedProfiles] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: users, error: usersError } = await supabase.from('users').select('id, created_at, last_login');
        if (usersError) throw usersError;

        const { data: personalInfos, error: personalInfosError } = await supabase.from('personalinfo').select('user_id, age, objectifs_patrimoniaux');
        if (personalInfosError) throw personalInfosError;

        const { data: profiles, error: profilesError } = await supabase.from('profileinvestisseur').select('user_id, score');
        if (profilesError) throw profilesError;

        // Process data here
        const totalClientsData = users.reduce((acc, user) => {
          const month = new Date(user.created_at).toLocaleString('default', { month: 'short' });
          const year = new Date(user.created_at).getFullYear();
          const key = `${month} ${year}`;
          if (!acc[key]) {
            acc[key] = { month: key, clients: 0 };
          }
          acc[key].clients++;
          return acc;
        }, {} as Record<string, { month: string; clients: number }>);
        setClientsTotalData(Object.values(totalClientsData));

        const ageData = personalInfos.reduce((acc, info) => {
          const age = info.age;
          if (age >= 18 && age <= 25) acc['18-25 ans']++;
          else if (age >= 26 && age <= 35) acc['26-35 ans']++;
          else if (age >= 36 && age <= 45) acc['36-45 ans']++;
          else if (age >= 46 && age <= 55) acc['46-55 ans']++;
          else if (age >= 56 && age <= 65) acc['56-65 ans']++;
          else if (age > 65) acc['+65 ans']++;
          return acc;
        }, { '18-25 ans': 0, '26-35 ans': 0, '36-45 ans': 0, '46-55 ans': 0, '56-65 ans': 0, '+65 ans': 0 } as Record<string, number>);
        setClientsAgeData(Object.entries(ageData).map(([name, value]) => ({ name, value })));

        const scoreData = profiles.reduce((acc, profile) => {
            const score = profile.score;
            if (score >= 0 && score <= 20) acc['0-20']++;
            else if (score >= 21 && score <= 40) acc['21-40']++;
            else if (score >= 41 && score <= 60) acc['41-60']++;
            else if (score >= 61 && score <= 80) acc['61-80']++;
            else if (score >= 81 && score <= 100) acc['81-100']++;
            return acc;
        }, { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 } as Record<string, number>);
        setClientsScoreData(Object.entries(scoreData).map(([score, clients]) => ({ score, clients })));

        const objectifsData = personalInfos.reduce((acc, info) => {
            info.objectifs_patrimoniaux.forEach((objectif: string) => {
                if (!acc[objectif]) {
                    acc[objectif] = 0;
                }
                acc[objectif]++;
            });
            return acc;
        }, {} as Record<string, number>);
        setClientsObjectifsData(Object.entries(objectifsData).map(([name, value]) => ({ name, value })));

        setTotalClients(users.length);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        setActiveClients(users.filter(u => new Date(u.last_login) > oneMonthAgo).length);
        setCompletedProfiles(profiles.length);
        setAverageScore(profiles.reduce((acc, p) => acc + p.score, 0) / profiles.length);

        console.log("Total Clients:", users.length);
        console.log("Active Clients:", users.filter(u => new Date(u.last_login) > oneMonthAgo).length);
        console.log("Completed Profiles:", profiles.length);
        console.log("Average Score:", profiles.reduce((acc, p) => acc + p.score, 0) / profiles.length);
        console.log("Clients Total Data:", Object.values(totalClientsData));
        console.log("Clients Age Data:", Object.entries(ageData).map(([name, value]) => ({ name, value })));
        console.log("Clients Score Data:", Object.entries(scoreData).map(([score, clients]) => ({ score, clients })));
        console.log("Clients Objectifs Data:", Object.entries(objectifsData).map(([name, value]) => ({ name, value })));

        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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