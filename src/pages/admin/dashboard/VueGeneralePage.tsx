import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  Briefcase, 
  AlertTriangle, 
  Brain,
  CalendarClock, 
  Mail,
  MessageSquare,
  BarChart,
  PieChart,
  Phone,
  FileText,
  RefreshCw,
  Download,
  Loader2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  BarChart as ReBarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardData, useRealtimeStats } from './../../../hooks/useDashboardData';

const COLORS = ['#8B5CF6', '#F97316', '#D946EF', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

import { EncoursStat, ClientStat, ActiviteRecente, AlerteOpportunite, RepartitionActif, ProchainRdv } from './../../../hooks/useDashboardData';

interface DashboardData {
  encoursStats: EncoursStat[];
  clientsStats: ClientStat[];
  recentActivities: ActiviteRecente[];
  alertesOpportunites: AlerteOpportunite[];
  repartitionActifs: RepartitionActif[];
  prochainsRdv: ProchainRdv[];
  epargneDisponible: Array<{ // Garder cette définition locale si elle n'est pas dans le hook
    client: string;
    value: number;
    produit: string;
  }>;
}

const DEFAULT_DATA: DashboardData = {
  encoursStats: [],
  clientsStats: [],
  recentActivities: [],
  alertesOpportunites: [],
  repartitionActifs: [],
  prochainsRdv: [],
  epargneDisponible: []
};

// Service pour récupérer les totaux en temps réel
const DashboardService = {
  async getCurrentTotals(data: DashboardData) {
    try {
      // En production, remplacer par un appel API réel
      return this.calculateTotalsFromExistingData(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des totaux:', error);
      return { encoursTotalActuel: 0, epargneDisponibleActuelle: 0 };
    }
  },
  
  calculateTotalsFromExistingData(data: DashboardData) {
    // Le total des encours est la somme des actifs
    const encoursTotalActuel = data.repartitionActifs.reduce(
      (acc, actif) => acc + actif.valeur_totale,
      0
    );
    
    // Calcul de l'épargne disponible
    const epargneDisponibleActuelle = data?.epargneDisponible?.reduce((sum, item) => 
      sum + (item.value || 0), 0
    ) || 0;
    
    return { encoursTotalActuel, epargneDisponibleActuelle };
  },

  async exportDashboardData() {
    // Implémentation fictive pour l'exemple
    return {
      date: new Date().toISOString(),
      data: "Données exportées"
    };
  }
};

// Hook personnalisé pour les totaux
const useCurrentTotals = (dashboardData: DashboardData) => {
  const [totals, setTotals] = React.useState({
    encoursTotalActuel: 0,
    epargneDisponibleActuelle: 0,
    loading: true,
    error: null
  });
  
  React.useEffect(() => {
    const fetchTotals = async () => {
      try {
        // Essayer d'abord de récupérer les totaux en temps réel
        const apiTotals = await DashboardService.getCurrentTotals(dashboardData);
        setTotals({
          ...apiTotals,
          loading: false,
          error: null
        });
      } catch (error) {
        // Fallback: calculer à partir des données existantes
        const calculatedTotals = DashboardService.calculateTotalsFromExistingData(dashboardData);
        setTotals({
          ...calculatedTotals,
          loading: false,
          error: error instanceof Error ? error : new Error('Erreur de chargement des totaux')
        });
      }
    };
    
    fetchTotals();
  }, [dashboardData]);
  
  return totals;
};

const VueGeneralePage = () => {
  const [periode, setPeriode] = React.useState("6mois");
  const [isExporting, setIsExporting] = React.useState(false);
  
  const { loading, error, refreshData, data = DEFAULT_DATA } = useDashboardData();
  const realtimeStats = useRealtimeStats();
  const { 
    encoursTotalActuel, 
    epargneDisponibleActuelle,
    loading: totalsLoading,
    error: totalsError
  } = useCurrentTotals(data);

  // Fonction utilitaire pour le mapping sécurisé
  const safeMap = <T, U>(array: T[] | undefined, callback: (item: T, index: number) => U): U[] => {
    return Array.isArray(array) ? array.map(callback) : [];
  };

  // Traitement des données avec protections
  const processEncourData = () => {
    if (!data?.encoursStats || data.encoursStats.length === 0) {
      return [{
        month: new Date().toLocaleDateString('fr-FR', { month: 'short' }),
        banque: 0,
        assurance: 0,
        capitalisation: 0,
        entreprise: 0,
        total: encoursTotalActuel
      }];
    }
    
    return safeMap(data.encoursStats, (item) => ({
      month: item.month,
      banque: item.encours_reels_banque,
      assurance: item.encours_reels_assurance_vie,
      capitalisation: item.encours_reels_capitalisation,
      entreprise: item.encours_reels_entreprise,
      total: item.encours_reels_total
    }));
  };

  const processClientData = () => {
    return safeMap(data?.clientsStats, (item) => ({
      month: item?.month ? new Date(item.month).toLocaleDateString('fr-FR', { month: 'short' }) : '',
      total: item?.total_clients || 0,
      nouveaux: item?.nouveaux_clients || 0
    }));
  };

  const processRepartitionData = () => {
    const total = safeMap(data?.repartitionActifs, item => item?.valeur_totale || 0)
                  .reduce((sum, value) => sum + value, 0) || encoursTotalActuel;
    
    return safeMap(data?.repartitionActifs, (item) => ({
      name: item?.classe_actif || 'Autre',
      value: total > 0 ? Math.round(((item?.valeur_totale || 0) / total) * 100) : 0,
      montant: item?.valeur_totale || 0
    })).filter(item => item.value > 0);
  };

  const processAlertesData = () => {
    const colorMap: { [key: string]: string } = {
      amber: '#F59E0B',
      red: '#EF4444',
      blue: '#3B82F6',
      purple: '#8B5CF6'
    };

    return safeMap(data?.alertesOpportunites, (item) => ({
      ...item,
      color: item?.couleur ? colorMap[item.couleur] || '#6B7280' : '#6B7280',
      action: {
        'Profils incomplets': 'Compléter le profil',
        'Clients inactifs': 'Relance client',
        'Épargne disponible élevée': 'Proposition investissement',
        'Optimisations fiscales possibles': 'Audit fiscal'
      }[item?.type_alerte || ''] || 'Action requise'
    }));
  };

  const encoursData = processEncourData();
  const clientsData = processClientData();
  const alertesData = processAlertesData();
  const totalAlertes = alertesData.reduce((sum, item) => sum + (item?.nombre || 0), 0);
  const repartitionData = processRepartitionData();
  const tauxConversion = realtimeStats?.tauxConversion || 0;
  const clientsActuels = realtimeStats?.totalClients || 0;
  const nouveauxClients = realtimeStats?.nouveauxClients || 0;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const exportData = await DashboardService.exportDashboardData();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading || totalsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  if (error || totalsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
          <p className="text-muted-foreground mb-4">
            {error?.message || totalsError?.message || 'Une erreur est survenue'}
          </p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord patrimonial</h1>
        <div className="flex gap-2">
          <Button 
            onClick={refreshData} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Select value={periode} onValueChange={setPeriode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1mois">1 mois</SelectItem>
              <SelectItem value="3mois">3 mois</SelectItem>
              <SelectItem value="6mois">6 mois</SelectItem>
              <SelectItem value="1an">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardDescription>Encours total</CardDescription>
            <CardTitle className="text-2xl text-blue-700">
              {(encoursTotalActuel / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              Tous produits confondus
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-emerald-100">
            <CardDescription>Épargne disponible</CardDescription>
            <CardTitle className="text-2xl text-emerald-700">
              {(epargneDisponibleActuelle / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              Potentiel d'investissement
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardDescription>Portefeuille clients</CardDescription>
            <CardTitle className="text-2xl text-purple-700">
              {clientsActuels.toLocaleString('fr-FR')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <Users className="mr-2 h-4 w-4" />
              +{nouveauxClients.toLocaleString('fr-FR')} ce mois
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-amber-100">
            <CardDescription>Alertes actives</CardDescription>
            <CardTitle className="text-2xl text-amber-700">
              {totalAlertes.toLocaleString('fr-FR')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Actions à mener
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <Tabs defaultValue="encours" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="encours">Encours</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="alertes">Alertes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="encours">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des encours</CardTitle>
                <CardDescription>Répartition par type de produit</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {encoursData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={encoursData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => `${(Number(value) / 1000).toFixed(1)} k€`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="banque" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Banque"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="assurance" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Assurance-vie"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="capitalisation" 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        name="Capitalisation"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="entreprise" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        name="Entreprise"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <BarChart className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucune donnée disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des actifs</CardTitle>
                <CardDescription>Allocation globale du portefeuille</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {repartitionData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={repartitionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {repartitionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${value}%`,
                          `${(props.payload.montant / 1000).toFixed(1)} k€`
                        ]}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <PieChart className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucune donnée disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution de la clientèle</CardTitle>
                <CardDescription>Nouveaux clients et portefeuille total</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {clientsData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={clientsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" name="Total clients" fill="#8B5CF6" />
                      <Bar dataKey="nouveaux" name="Nouveaux clients" fill="#F97316" />
                    </ReBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucune donnée disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prochains rendez-vous</CardTitle>
                <CardDescription>Agenda des consultations</CardDescription>
              </CardHeader>
              <CardContent>
                {data?.prochainsRdv?.length > 0 ? (
                  <ScrollArea className="h-[340px] pr-4">
                    <div className="space-y-3">
                      {safeMap(data.prochainsRdv, (rdv, index) => (
                        <div key={index} className="border rounded-md p-3 hover:bg-accent/50 transition-colors">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 p-2 mr-3 bg-purple-100 rounded-full text-purple-600">
                              <CalendarClock className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{rdv?.client}</p>
                              <p className="text-sm text-muted-foreground">{rdv?.theme}</p>
                            </div>
                            <div className="ml-4 text-right">
                              <Badge variant="outline" className="mb-1">
                                {rdv?.date_rdv}
                              </Badge>
                              <p className="text-sm font-medium">{rdv?.heure}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[340px]">
                    <CalendarClock className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucun rendez-vous à venir</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Voir l'agenda complet
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des alertes</CardTitle>
                <CardDescription>Par type et criticité</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {alertesData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      layout="vertical"
                      data={alertesData}
                      margin={{ left: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="type_alerte" type="category" width={120} />
                      <Tooltip 
                        formatter={(value, name, props) => [
                          value,
                          `Action recommandée: ${props.payload.action}`
                        ]}
                      />
                      <Bar dataKey="nombre" name="Nombre d'alertes">
                        {alertesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </ReBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucune alerte active</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions prioritaires</CardTitle>
                <CardDescription>Liste détaillée des alertes</CardDescription>
              </CardHeader>
              <CardContent>
                {alertesData?.length > 0 ? (
                  <ScrollArea className="h-[340px] pr-4">
                    <div className="space-y-3">
                      {alertesData.map((alerte, index) => (
                        <div key={index} className="border rounded-md p-3 hover:bg-accent/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-3" 
                                style={{ backgroundColor: alerte.color }}
                              />
                              <div>
                                <div className="font-medium">{alerte.type_alerte}</div>
                                <div className="text-sm text-muted-foreground">
                                  {alerte.action}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{alerte.nombre} cas</div>
                              <Button variant="outline" size="sm" className="mt-1">
                                Traiter
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[340px]">
                    <Brain className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucune action prioritaire</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Voir toutes les alertes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Activités récentes et épargne disponible */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activités récentes</CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.recentActivities?.length > 0 ? (
              <div className="space-y-4">
                {safeMap(data.recentActivities, (activity, index) => (
                  <div key={index} className="flex items-start pb-4 last:pb-0">
                    <div className="relative flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary">
                        {activity.type === 'email' && <Mail className="h-5 w-5" />}
                        {activity.type === 'call' && <Phone className="h-5 w-5" />}
                        {activity.type === 'meeting' && <CalendarClock className="h-5 w-5" />}
                        {activity.type === 'document' && <FileText className="h-5 w-5" />}
                      </div>
                      {index < (data.recentActivities?.length || 0) - 1 && (
                        <div className="absolute left-5 top-10 w-px h-full bg-border" />
                      )}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.client} - {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.produit} • {activity.montant?.toLocaleString('fr-FR')} €
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.date_action ? new Date(activity.date_action).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Date inconnue'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Aucune activité récente</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Voir l'historique complet
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top épargne disponible</CardTitle>
            <CardDescription>Clients avec capital à investir</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.epargneDisponible?.length > 0 ? (
              <div className="space-y-4">
                {safeMap(
                  [...data.epargneDisponible]
                    .sort((a, b) => (b.value || 0) - (a.value || 0))
                    .slice(0, 5),
                  (item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-md">
                      <div className="flex items-center">
                        <div className="mr-3 font-medium text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {item.client?.split(' ')[0]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.produit}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {(item.value || 0).toLocaleString('fr-FR')} €
                        </div>
                        <Button variant="link" size="sm" className="h-4 p-0 text-xs">
                          Contacter
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">Aucune épargne disponible</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Voir tous les clients
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VueGeneralePage;