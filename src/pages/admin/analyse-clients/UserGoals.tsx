import React, { useState, useEffect } from 'react';
import { supabase } from './../../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { TrendingUp, Target, Users, DollarSign, Calendar, Briefcase } from 'lucide-react';

const UserGoalsAnalysis = () => {
  const [goalsData, setGoalsData] = useState({
    objectifsPatrimoniaux: [],
    projets5Ans: [],
    objectifsInvestissement: [],
    prioriteGestion: [],
    complementRetraite: []
  });
  const [loading, setLoading] = useState(true);
  const [totalClients, setTotalClients] = useState(0);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0', '#ffb347'];

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

    setGoalsData({
      objectifsPatrimoniaux: Object.entries(objectifsCount).map(([name, value]) => ({ name, value })),
      projets5Ans: Object.entries(projetsCount).map(([name, value]) => ({ name, value })),
      objectifsInvestissement: Object.entries(investissementCount).map(([name, value]) => ({ name, value })),
      prioriteGestion: Object.entries(prioriteCount).map(([name, value]) => ({ name, value })),
      complementRetraite: Object.entries(retraiteCount).map(([name, value]) => ({ name, value }))
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Analyse des Objectifs Financiers</h1>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold">{totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Objectifs Définis</p>
                <p className="text-2xl font-bold">
                  {goalsData.objectifsPatrimoniaux.reduce((sum, item) => sum + item.value, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Projets 5 ans</p>
                <p className="text-2xl font-bold">
                  {goalsData.projets5Ans.reduce((sum, item) => sum + item.value, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Objectifs Investissement</p>
                <p className="text-2xl font-bold">
                  {goalsData.objectifsInvestissement.reduce((sum, item) => sum + item.value, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectifs Patrimoniaux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectifs Patrimoniaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalsData.objectifsPatrimoniaux}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {goalsData.objectifsPatrimoniaux.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Objectifs d'Investissement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Objectifs d'Investissement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={goalsData.objectifsInvestissement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques secondaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projets 5 ans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Projets à 5 ans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={goalsData.projets5Ans}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  fontSize={11}
                />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priorités de Gestion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Priorités de Gestion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={goalsData.prioriteGestion}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {goalsData.prioriteGestion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Complément Retraite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Compléments de Retraite Souhaités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={goalsData.complementRetraite} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={150}
                fontSize={12}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#8dd1e1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Légendes et insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Insights Clés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">Objectif Principal</h4>
                <p className="text-sm text-blue-600">
                  {goalsData.objectifsPatrimoniaux.length > 0 && 
                    `${goalsData.objectifsPatrimoniaux[0]?.name} (${goalsData.objectifsPatrimoniaux[0]?.value} clients)`
                  }
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Projet Principal 5 ans</h4>
                <p className="text-sm text-green-600">
                  {goalsData.projets5Ans.length > 0 && 
                    `${goalsData.projets5Ans[0]?.name} (${goalsData.projets5Ans[0]?.value} clients)`
                  }
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800">Priorité Gestion</h4>
                <p className="text-sm text-orange-600">
                  {goalsData.prioriteGestion.length > 0 && 
                    `${goalsData.prioriteGestion[0]?.name} (${goalsData.prioriteGestion[0]?.value} clients)`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-blue-500 bg-gray-50">
                <h4 className="font-semibold">Personnalisation des Offres</h4>
                <p className="text-sm text-gray-600">
                  Adapter les produits selon les objectifs patrimoniaux dominants
                </p>
              </div>
              <div className="p-3 border-l-4 border-green-500 bg-gray-50">
                <h4 className="font-semibold">Planification Long Terme</h4>
                <p className="text-sm text-gray-600">
                  Développer des stratégies pour les projets à 5 ans identifiés
                </p>
              </div>
              <div className="p-3 border-l-4 border-orange-500 bg-gray-50">
                <h4 className="font-semibold">Communication Ciblée</h4>
                <p className="text-sm text-gray-600">
                  Segmenter les messages selon les priorités de gestion
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserGoalsAnalysis;