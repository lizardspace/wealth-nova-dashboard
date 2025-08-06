import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './../../../lib/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Target,
  Users,
  DollarSign,
  Calendar,
  Briefcase,
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  PieChart as PieChartIcon,
  BarChart3,
  Award,
  Zap,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  Activity,
  Lightbulb,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UserGoalsAnalysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [goalsData, setGoalsData] = useState({
    objectifsPatrimoniaux: [],
    projets5Ans: [],
    objectifsInvestissement: [],
    prioriteGestion: [],
    complementRetraite: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalClients, setTotalClients] = useState(0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

  useEffect(() => {
    fetchGoalsData();
  }, []);

  const fetchGoalsData = async () => {
    try {
      setLoading(true);

      // Récupération des objectifs patrimoniaux
      const { data: personalInfo, error: personalError } = await supabase
        .from('personalinfo')
        .select('objectifs_patrimoniaux, projets_5_ans, priorite_gestion')
        .not('objectifs_patrimoniaux', 'is', null)
        .not('projets_5_ans', 'is', null);

      if (personalError) throw personalError;

      // Récupération des objectifs d'investissement
      const { data: patrimoineFinancier, error: patrimoineError } = await supabase
        .from('patrimoinefinancier')
        .select('objectifs_investissement, horizon_investissement')
        .not('objectifs_investissement', 'is', null);

      if (patrimoineError) throw patrimoineError;

      // Récupération des données de retraite
      const { data: retraiteData, error: retraiteError } = await supabase
        .from('retraite')
        .select('complement_retraite, montant_epargne')
        .not('complement_retraite', 'is', null);

      if (retraiteError) throw retraiteError;

      // Compter le total des clients
      const { count: totalCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      setTotalClients(totalCount || 0);

      // Traitement des données
      processGoalsData(personalInfo, patrimoineFinancier, retraiteData);

    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'objectifs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processGoalsData = (personalInfo, patrimoineFinancier, retraiteData) => {
    // Traitement des objectifs patrimoniaux
    const objectifsCount = {};
    personalInfo.forEach(client => {
      if (client.objectifs_patrimoniaux) {
        client.objectifs_patrimoniaux.forEach(objectif => {
          objectifsCount[objectif] = (objectifsCount[objectif] || 0) + 1;
        });
      }
    });

    // Traitement des projets 5 ans
    const projetsCount = {};
    personalInfo.forEach(client => {
      if (client.projets_5_ans) {
        client.projets_5_ans.forEach(projet => {
          projetsCount[projet] = (projetsCount[projet] || 0) + 1;
        });
      }
    });

    // Traitement des objectifs d'investissement
    const investissementCount = {};
    patrimoineFinancier.forEach(client => {
      if (client.objectifs_investissement) {
        client.objectifs_investissement.forEach(objectif => {
          investissementCount[objectif] = (investissementCount[objectif] || 0) + 1;
        });
      }
    });

    // Traitement des priorités de gestion
    const prioriteCount = {};
    personalInfo.forEach(client => {
      if (client.priorite_gestion) {
        prioriteCount[client.priorite_gestion] = (prioriteCount[client.priorite_gestion] || 0) + 1;
      }
    });

    // Traitement du complément retraite
    const retraiteCount = {};
    retraiteData.forEach(client => {
      if (client.complement_retraite) {
        retraiteCount[client.complement_retraite] = (retraiteCount[client.complement_retraite] || 0) + 1;
      }
    });

    // Trier les données par valeur décroissante
    setGoalsData({
      objectifsPatrimoniaux: Object.entries(objectifsCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      projets5Ans: Object.entries(projetsCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      objectifsInvestissement: Object.entries(investissementCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      prioriteGestion: Object.entries(prioriteCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      complementRetraite: Object.entries(retraiteCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchGoalsData();
    setRefreshing(false);
    toast({
      title: "✅ Données actualisées",
      description: "L'analyse des objectifs a été mise à jour avec succès",
    });
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // N'affiche pas les labels pour les segments < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Calculs statistiques
  const totalObjectifs = goalsData.objectifsPatrimoniaux.reduce((sum, item) => sum + item.value, 0);
  const totalProjets = goalsData.projets5Ans.reduce((sum, item) => sum + item.value, 0);
  const totalInvestissement = goalsData.objectifsInvestissement.reduce((sum, item) => sum + item.value, 0);
  const totalPriorites = goalsData.prioriteGestion.reduce((sum, item) => sum + item.value, 0);

  const engagementRate = totalClients > 0 ? ((totalObjectifs / totalClients) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eparnova-blue"></div>
          <span className="text-lg text-muted-foreground">Chargement des objectifs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-6">
      {/* Enhanced Header with glassmorphism */}
      <div className="glass-card p-8 rounded-2xl relative overflow-hidden border-white/20">
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/analyse-clients')}
              className="glass hover:glass-card transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-eparnova-blue via-eparnova-green to-eparnova-gold bg-clip-text text-transparent">
                Analyse des Objectifs Financiers
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Vision complète des aspirations et projets de vos clients
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Target className="h-10 w-10 text-eparnova-blue animate-float" />
              <Award className="h-8 w-8 text-eparnova-green animate-float" style={{animationDelay: '1s'}} />
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="icon"
              className="glass border-white/30 hover:glass-card"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-24 h-24 gradient-success rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-4 left-4 w-20 h-20 gradient-warning rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Enhanced Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <p className="text-3xl font-bold text-foreground">{totalClients}</p>
                <p className="text-xs text-muted-foreground mt-1">clients enregistrés</p>
              </div>
              <div className="p-3 gradient-primary rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-success opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Objectifs Définis</p>
                <p className="text-3xl font-bold text-green-600">{totalObjectifs}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {engagementRate.toFixed(1)}% d'engagement
                </p>
              </div>
              <div className="p-3 gradient-success rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-warning opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projets 5 ans</p>
                <p className="text-3xl font-bold text-orange-600">{totalProjets}</p>
                <p className="text-xs text-muted-foreground mt-1">projets planifiés</p>
              </div>
              <div className="p-3 gradient-warning rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-gold opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Obj. Investissement</p>
                <p className="text-3xl font-bold text-purple-600">{totalInvestissement}</p>
                <p className="text-xs text-muted-foreground mt-1">stratégies définies</p>
              </div>
              <div className="p-3 gradient-gold rounded-xl">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 gradient-secondary opacity-5"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Priorités</p>
                <p className="text-3xl font-bold text-blue-600">{totalPriorites}</p>
                <p className="text-xs text-muted-foreground mt-1">priorités définies</p>
              </div>
              <div className="p-3 gradient-secondary rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Rate Progress */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-eparnova-blue" />
            <span>Taux d'Engagement Client</span>
          </CardTitle>
          <CardDescription>Pourcentage de clients ayant défini des objectifs patrimoniaux</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {totalObjectifs} clients sur {totalClients} ont défini des objectifs
              </span>
              <Badge variant={engagementRate > 75 ? "default" : engagementRate > 50 ? "secondary" : "outline"}>
                {engagementRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={engagementRate} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectifs Patrimoniaux */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-eparnova-blue" />
              <span>Objectifs Patrimoniaux</span>
            </CardTitle>
            <CardDescription>Répartition des objectifs patrimoniaux par type</CardDescription>
          </CardHeader>
          <CardContent>
            {goalsData.objectifsPatrimoniaux.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={goalsData.objectifsPatrimoniaux}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {goalsData.objectifsPatrimoniaux.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelStyle={{ color: '#374151' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun objectif patrimonial défini</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Objectifs d'Investissement */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-eparnova-green" />
              <span>Objectifs d'Investissement</span>
            </CardTitle>
            <CardDescription>Distribution des stratégies d'investissement</CardDescription>
          </CardHeader>
          <CardContent>
            {goalsData.objectifsInvestissement.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={goalsData.objectifsInvestissement.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    fontSize={11}
                    stroke="#6b7280"
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Nombre de clients']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun objectif d'investissement défini</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projets 5 ans */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-eparnova-gold" />
              <span>Projets à 5 ans</span>
            </CardTitle>
            <CardDescription>Planification des projets à moyen terme</CardDescription>
          </CardHeader>
          <CardContent>
            {goalsData.projets5Ans.length > 0 ? (
              <ResponsiveContainer width="100%" height={270}>
                <AreaChart data={goalsData.projets5Ans.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={11}
                    stroke="#6b7280"
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Nombre de clients']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun projet à 5 ans défini</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priorités de Gestion */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-eparnova-secondary" />
              <span>Priorités de Gestion</span>
            </CardTitle>
            <CardDescription>Préférences de gestion patrimoniale</CardDescription>
          </CardHeader>
          <CardContent>
            {goalsData.prioriteGestion.length > 0 ? (
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Pie
                    data={goalsData.prioriteGestion}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {goalsData.prioriteGestion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelStyle={{ color: '#374151' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune priorité de gestion définie</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Retirement Complement Chart */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-eparnova-blue" />
            <span>Compléments de Retraite Souhaités</span>
          </CardTitle>
          <CardDescription>Besoins en compléments de retraite exprimés par les clients</CardDescription>
        </CardHeader>
        <CardContent>
          {goalsData.complementRetraite.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={goalsData.complementRetraite} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={180}
                  fontSize={12}
                  stroke="#6b7280"
                />
                <Tooltip 
                  formatter={(value, name) => [value, 'Nombre de clients']}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-80 text-muted-foreground">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun complément de retraite défini</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Insights Clés</span>
            </CardTitle>
            <CardDescription>Principales tendances identifiées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goalsData.objectifsPatrimoniaux.length > 0 && (
                <div className="p-4 glass rounded-lg border border-blue-200/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Objectif Principal</h4>
                  </div>
                  <p className="text-sm text-blue-600">
                    {goalsData.objectifsPatrimoniaux[0]?.name} - {goalsData.objectifsPatrimoniaux[0]?.value} clients
                    ({((goalsData.objectifsPatrimoniaux[0]?.value / totalObjectifs) * 100).toFixed(1)}%)
                  </p>
                </div>
              )}

              {goalsData.projets5Ans.length > 0 && (
                <div className="p-4 glass rounded-lg border border-green-200/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-green-800">Projet Principal 5 ans</h4>
                  </div>
                  <p className="text-sm text-green-600">
                    {goalsData.projets5Ans[0]?.name} - {goalsData.projets5Ans[0]?.value} clients
                    ({((goalsData.projets5Ans[0]?.value / totalProjets) * 100).toFixed(1)}%)
                  </p>
                </div>
              )}

              {goalsData.prioriteGestion.length > 0 && (
                <div className="p-4 glass rounded-lg border border-orange-200/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-4 w-4 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">Priorité Gestion</h4>
                  </div>
                  <p className="text-sm text-orange-600">
                    {goalsData.prioriteGestion[0]?.name} - {goalsData.prioriteGestion[0]?.value} clients
                    ({((goalsData.prioriteGestion[0]?.value / totalPriorites) * 100).toFixed(1)}%)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Recommandations</span>
            </CardTitle>
            <CardDescription>Actions suggérées basées sur l'analyse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 glass rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Personnalisation des Offres</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Adapter les produits selon les objectifs patrimoniaux dominants pour améliorer l'adéquation
                </p>
              </div>

              <div className="p-4 glass rounded-lg border-l-4 border-green-500">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-green-800">Planification Long Terme</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Développer des stratégies spécifiques pour les projets à 5 ans les plus demandés
                </p>
              </div>

              <div className="p-4 glass rounded-lg border-l-4 border-orange-500">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-4 w-4 text-orange-600" />
                  <h4 className="font-semibold text-orange-800">Communication Ciblée</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Segmenter les messages selon les priorités de gestion pour maximiser l'engagement
                </p>
              </div>

              {engagementRate < 50 && (
                <div className="p-4 glass rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <h4 className="font-semibold text-red-800">Améliorer l'Engagement</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Taux d'engagement faible ({engagementRate.toFixed(1)}%). Relancer la collecte d'objectifs clients
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserGoalsAnalysis;