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
  epargneDisponible: Array<{
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

// Service for real-time totals
const DashboardService = {
  async getCurrentTotals(data: DashboardData) {
    try {
      // In production, replace with real API call
      return this.calculateTotalsFromExistingData(data);
    } catch (error) {
      console.error('Error fetching totals:', error);
      return { encoursTotalActuel: 0, epargneDisponibleActuelle: 0 };
    }
  },
  
  calculateTotalsFromExistingData(data: DashboardData) {
    // Secure calculation of total assets
    let encoursTotalActuel = 0;
    
    if (data?.repartitionActifs && Array.isArray(data.repartitionActifs)) {
      encoursTotalActuel = data.repartitionActifs.reduce((acc, actif) => {
        const valeur = Number(actif?.valeur_totale) || 0;
        return acc + valeur;
      }, 0);
    }
    
    // Fallback to encours stats if no repartition data
    if (encoursTotalActuel === 0 && data?.encoursStats && Array.isArray(data.encoursStats) && data.encoursStats.length > 0) {
      const dernierMois = data.encoursStats[data.encoursStats.length - 1];
      encoursTotalActuel = Number(dernierMois?.encours_reels_total) || 0;
    }
    
    // Secure calculation of available savings
    let epargneDisponibleActuelle = 0;
    
    if (data?.epargneDisponible && Array.isArray(data.epargneDisponible)) {
      epargneDisponibleActuelle = data.epargneDisponible.reduce((sum, item) => {
        const valeur = Number(item?.value) || 0;
        return sum + valeur;
      }, 0);
    }
    
    return { encoursTotalActuel, epargneDisponibleActuelle };
  },

  async exportDashboardData() {
    // Mock implementation for example
    return {
      date: new Date().toISOString(),
      data: "Exported data"
    };
  }
};

// Custom hook for totals with enhanced error handling
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
        setTotals(prev => ({ ...prev, loading: true, error: null }));
        
        // Calculate totals securely
        const calculatedTotals = DashboardService.calculateTotalsFromExistingData(dashboardData);
        
        setTotals({
          ...calculatedTotals,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error calculating totals:', error);
        setTotals({
          encoursTotalActuel: 0,
          epargneDisponibleActuelle: 0,
          loading: false,
          error: error instanceof Error ? error : new Error('Error calculating totals')
        });
      }
    };
    
    // Add delay to avoid repeated calculations
    const timeoutId = setTimeout(fetchTotals, 100);
    return () => clearTimeout(timeoutId);
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

  // Utility function for safe mapping with validation
  const safeMap = <T, U>(array: T[] | undefined | null, callback: (item: T, index: number) => U): U[] => {
    if (!Array.isArray(array)) return [];
    return array.filter(item => item != null).map(callback);
  };

  // Function to validate and convert numbers
  const safeNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Data processing with enhanced protections
  const processEncourData = () => {
    if (!data?.encoursStats || !Array.isArray(data.encoursStats) || data.encoursStats.length === 0) {
      return [{
        month: new Date().toLocaleDateString('fr-FR', { month: 'short' }),
        banque: 0,
        assurance: 0,
        capitalisation: 0,
        entreprise: 0,
        total: safeNumber(encoursTotalActuel)
      }];
    }
    
    return safeMap(data.encoursStats, (item) => ({
      month: item?.month || 'N/A',
      banque: safeNumber(item?.encours_reels_banque),
      assurance: safeNumber(item?.encours_reels_assurance_vie),
      capitalisation: safeNumber(item?.encours_reels_capitalisation),
      entreprise: safeNumber(item?.encours_reels_entreprise),
      total: safeNumber(item?.encours_reels_total)
    }));
  };

  const processClientData = () => {
    if (!data?.clientsStats || !Array.isArray(data.clientsStats)) {
      return [];
    }
    
    return safeMap(data.clientsStats, (item) => ({
      month: item?.month ? new Date(item.month).toLocaleDateString('fr-FR', { month: 'short' }) : 'N/A',
      total: safeNumber(item?.total_clients),
      nouveaux: safeNumber(item?.nouveaux_clients)
    }));
  };

  const processRepartitionData = () => {
    if (!data?.repartitionActifs || !Array.isArray(data.repartitionActifs)) {
      return [];
    }
    
    const totalMontant = data.repartitionActifs.reduce((sum, item) => 
      sum + safeNumber(item?.valeur_totale), 0
    );
    
    // Use calculated total or encours as fallback
    const total = totalMontant > 0 ? totalMontant : safeNumber(encoursTotalActuel);
    
    if (total === 0) return [];
    
    return safeMap(data.repartitionActifs, (item) => {
      const montant = safeNumber(item?.valeur_totale);
      const pourcentage = Math.round((montant / total) * 100);
      
      return {
        name: item?.classe_actif || 'Other',
        value: pourcentage,
        montant: montant
      };
    }).filter(item => item.value > 0);
  };

  const processAlertesData = () => {
    if (!data?.alertesOpportunites || !Array.isArray(data.alertesOpportunites)) {
      return [];
    }
    
    const colorMap: { [key: string]: string } = {
      amber: '#F59E0B',
      red: '#EF4444',
      blue: '#3B82F6',
      purple: '#8B5CF6'
    };

    const actionMap: { [key: string]: string } = {
      'Profils incomplets': 'Complete profile',
      'Clients inactifs': 'Client follow-up',
      'Épargne disponible élevée': 'Investment proposal',
      'Optimisations fiscales possibles': 'Tax audit'
    };

    return safeMap(data.alertesOpportunites, (item) => ({
      ...item,
      nombre: safeNumber(item?.nombre),
      color: item?.couleur ? colorMap[item.couleur] || '#6B7280' : '#6B7280',
      action: actionMap[item?.type_alerte || ''] || 'Action required'
    }));
  };

  // Data calculations with error handling
  let encoursData, clientsData, alertesData, repartitionData;
  
  try {
    encoursData = processEncourData();
    clientsData = processClientData();
    alertesData = processAlertesData();
    repartitionData = processRepartitionData();
  } catch (error) {
    console.error('Error processing data:', error);
    encoursData = [];
    clientsData = [];
    alertesData = [];
    repartitionData = [];
  }

  const totalAlertes = alertesData.reduce((sum, item) => sum + safeNumber(item?.nombre), 0);
  const tauxConversion = safeNumber(realtimeStats?.tauxConversion);
  const clientsActuels = safeNumber(realtimeStats?.totalClients);
  const nouveauxClients = safeNumber(realtimeStats?.nouveauxClients);

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
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading || totalsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || totalsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading error</h3>
          <p className="text-muted-foreground mb-4">
            {error?.message || totalsError?.message || 'An error occurred'}
          </p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wealth Management Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            onClick={refreshData} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Select value={periode} onValueChange={setPeriode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1mois">1 month</SelectItem>
              <SelectItem value="3mois">3 months</SelectItem>
              <SelectItem value="6mois">6 months</SelectItem>
              <SelectItem value="1an">1 year</SelectItem>
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
            Export
          </Button>
        </div>
      </div>

      {/* Key statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
            <CardDescription>Total assets</CardDescription>
            <CardTitle className="text-2xl text-blue-700">
              {(safeNumber(encoursTotalActuel) / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <BarChart className="mr-2 h-4 w-4" />
              All products combined
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-emerald-50 to-emerald-100">
            <CardDescription>Available savings</CardDescription>
            <CardTitle className="text-2xl text-emerald-700">
              {(safeNumber(epargneDisponibleActuelle) / 1000000).toFixed(2)} M€
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
              Investment potential
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-purple-100">
            <CardDescription>Client portfolio</CardDescription>
            <CardTitle className="text-2xl text-purple-700">
              {clientsActuels.toLocaleString('fr-FR')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <Users className="mr-2 h-4 w-4" />
              +{nouveauxClients.toLocaleString('fr-FR')} this month
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-amber-100">
            <CardDescription>Active alerts</CardDescription>
            <CardTitle className="text-2xl text-amber-700">
              {totalAlertes.toLocaleString('fr-FR')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Actions required
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main charts */}
      <Tabs defaultValue="encours" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="encours">Assets</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="alertes">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="encours">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assets evolution</CardTitle>
                <CardDescription>By product type</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {encoursData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={encoursData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => `${(safeNumber(value) / 1000).toFixed(1)} k€`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="banque" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Bank"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="assurance" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Life insurance"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="capitalisation" 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        name="Capitalization"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="entreprise" 
                        stroke="#8B5CF6" 
                        strokeWidth={2}
                        name="Business"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <BarChart className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assets allocation</CardTitle>
                <CardDescription>Global portfolio distribution</CardDescription>
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
                          `${(safeNumber(props.payload.montant) / 1000).toFixed(1)} k€`
                        ]}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <PieChart className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No data available</p>
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
                <CardTitle>Client evolution</CardTitle>
                <CardDescription>New clients and total portfolio</CardDescription>
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
                      <Bar dataKey="nouveaux" name="New clients" fill="#F97316" />
                    </ReBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming appointments</CardTitle>
                <CardDescription>Consultation agenda</CardDescription>
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
                              <p className="font-medium truncate">{rdv?.client || 'Unknown client'}</p>
                              <p className="text-sm text-muted-foreground">{rdv?.theme || 'Undefined theme'}</p>
                            </div>
                            <div className="ml-4 text-right">
                              <Badge variant="outline" className="mb-1">
                                {rdv?.date_rdv || 'Date TBD'}
                              </Badge>
                              <p className="text-sm font-medium">{rdv?.heure || 'Time TBD'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[340px]">
                    <CalendarClock className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No upcoming appointments</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View full agenda
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alerts distribution</CardTitle>
                <CardDescription>By type and criticality</CardDescription>
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
                          `Recommended action: ${props.payload.action}`
                        ]}
                      />
                      <Bar dataKey="nombre" name="Number of alerts">
                        {alertesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </ReBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No active alerts</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority actions</CardTitle>
                <CardDescription>Detailed alerts list</CardDescription>
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
                                <div className="font-medium">{alerte.type_alerte || 'Unknown type'}</div>
                                <div className="text-sm text-muted-foreground">
                                  {alerte.action}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{safeNumber(alerte.nombre)} cases</div>
                              <Button variant="outline" size="sm" className="mt-1">
                                Process
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
                    <p className="text-gray-500">No priority actions</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View all alerts
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent activities and available savings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activities</CardTitle>
            <CardDescription>Latest actions on the platform</CardDescription>
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
                        {activity.client || 'Unknown client'} - {activity.action || 'No action'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.produit || 'No product'} • {safeNumber(activity.montant).toLocaleString('fr-FR')} €
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.date_action ? new Date(activity.date_action).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View full history
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top available savings</CardTitle>
            <CardDescription>Clients with capital to invest</CardDescription>
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
                            {item.client?.split(' ')[0] || 'Client'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.produit || 'Product'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {safeNumber(item.value).toLocaleString('fr-FR')} €
                        </div>
                        <Button variant="link" size="sm" className="h-4 p-0 text-xs">
                          Contact
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No available savings</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View all clients
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VueGeneralePage;
