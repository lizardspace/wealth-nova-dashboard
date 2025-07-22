import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  ArrowUpRight, Users, Briefcase, AlertTriangle, Brain, CalendarClock, Mail,
  FileText, RefreshCw, Download, Loader2, Phone, BarChart as BarChartIcon,
  PieChart as PieChartIcon, Edit, ChevronRight, Plus, ArrowRight, AlertCircle,
  CheckCircle, Clock, TrendingUp, DollarSign, Zap
} from "lucide-react";
import {
  BarChart as ReBarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart,
  Pie, Cell, AreaChart, Area
} from 'recharts';
import { cn } from "@/lib/utils";

// Palette de couleurs cohérente
const COLORS = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  purple: '#8B5CF6',
  orange: '#F97316',
  pink: '#D946EF',
  blue: '#0EA5E9',
  teal: '#14B8A6',
  yellow: '#F59E0B'
};

const CHART_COLORS = [
  COLORS.primary, 
  COLORS.secondary, 
  COLORS.success, 
  COLORS.warning, 
  COLORS.danger, 
  COLORS.info,
  COLORS.purple
];

// Interfaces pour le typage des données
interface DashboardData {
  encoursStats: Array<{ month: string; encours_reels_banque: number; encours_reels_assurance_vie: number; encours_reels_capitalisation: number; encours_reels_entreprise: number; encours_reels_total: number; }>;
  clientsStats: Array<{ month: string; total_clients: number; nouveaux_clients: number; }>;
  recentActivities: Array<{ client: string; action: string; produit: string; montant: number; date_action: string; type: string; }>;
  alertesOpportunites: Array<{ type_alerte: string; couleur: string; nombre: number; }>;
  repartitionActifs: Array<{ classe_actif: string; valeur_totale: number; }>;
  prochainsRdv: Array<{ client: string; theme: string; date_rdv: string; heure: string; }>;
  epargneDisponible: Array<{ client: string; value: number; produit: string; email?: string; }>;
  realtimeStats: { totalClients: number; nouveauxClients: number; tauxConversion: number; };
  totalAssets: { encoursTotalActuel: number; };
  totalEpargne: { epargneDisponibleActuelle: number; };
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const [
    { data: encoursStats, error: encoursError },
    { data: clientsStats, error: clientsError },
    { data: recentActivities, error: activitiesError },
    { data: alertesOpportunites, error: alertesError },
    { data: repartitionActifs, error: repartitionError },
    { data: prochainsRdv, error: rdvError },
    { data: epargneDisponible, error: epargneError },
    { data: realtimeStats, error: realtimeError },
    { data: totalAssetsData, error: assetsError },
    { data: totalEpargneData, error: totalEpargneError }
  ] = await Promise.all([
    supabase.from('dashboard_encours_stats').select('*'),
    supabase.from('dashboard_clients_stats').select('*'),
    supabase.from('dashboard_recent_activities').select('*'),
    supabase.from('dashboard_alertes_opportunites').select('*'),
    supabase.from('dashboard_repartition_actifs').select('*'),
    supabase.from('dashboard_prochains_rdv').select('*'),
    supabase.from('dashboard_epargne_disponible').select('*'),
    supabase.from('dashboard_realtime_stats').select('*').single(),
    supabase.from('dashboard_total_assets').select('encourstotalactuel').limit(1),
    supabase.from('dashboard_total_epargne_disponible').select('epargnedisponibleactuelle').limit(1)
  ]);

  const errors = [encoursError, clientsError, activitiesError, alertesError, repartitionError, rdvError, epargneError, realtimeError, assetsError, totalEpargneError].filter(Boolean);
  if (errors.length > 0) {
    console.error('Errors fetching dashboard data:', errors);
    throw new Error('Failed to fetch dashboard data');
  }

  const totalAssets = totalAssetsData?.[0] ? { encoursTotalActuel: totalAssetsData[0].encourstotalactuel } : { encoursTotalActuel: 0 };
  const totalEpargne = totalEpargneData?.[0] ? { epargneDisponibleActuelle: totalEpargneData[0].epargnedisponibleactuelle } : { epargneDisponibleActuelle: 0 };

  return {
    encoursStats: encoursStats || [],
    clientsStats: clientsStats || [],
    recentActivities: recentActivities || [],
    alertesOpportunites: alertesOpportunites || [],
    repartitionActifs: repartitionActifs || [],
    prochainsRdv: prochainsRdv || [],
    epargneDisponible: epargneDisponible || [],
    realtimeStats: realtimeStats || { totalClients: 0, nouveauxClients: 0, tauxConversion: 0 },
    totalAssets,
    totalEpargne
  };
};

const DetailModal = ({ isOpen, onClose, title, description, data, isLoading }) => {
  const getIconForAlertType = (type) => {
    switch (type) {
      case 'Profils incomplets':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'Clients inactifs':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Optimisations fiscales possibles':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      case 'Épargne disponible élevée':
        return <DollarSign className="h-5 w-5 text-emerald-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleContact = (email) => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(title)}`;
  };

  const handleEdit = (userId) => {
    alert(`Navigation vers la page d'édition du client ID: ${userId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIconForAlertType(title)}
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[200px]">Client</TableHead>
                  <TableHead>Détails</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.length > 0 ? (
                  data.map((item) => (
                    <TableRow key={item.user_id || item.id}>
                      <TableCell>
                        <div className="font-medium">{item.first_name} {item.last_name}</div>
                        <div className="text-sm text-muted-foreground">{item.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {item.produit && <div>Produit: {item.produit}</div>}
                          {item.montant && <div>Montant: {Number(item.montant).toLocaleString('fr-FR')} €</div>}
                          {item.date_action && <div>Dernière action: {new Date(item.date_action).toLocaleDateString('fr-FR')}</div>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleContact(item.email)}
                          className="gap-1"
                        >
                          <Mail className="h-4 w-4" />
                          Contacter
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(item.user_id || item.id)}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Éditer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-8 w-8" />
                        Aucune donnée à afficher
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Fermer</Button>
          <Button onClick={() => alert('Action groupée en cours de développement')}>
            Action groupée
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const StatCard = ({ title, value, change, icon, color = 'primary' }) => {
  const colors = {
    primary: 'bg-indigo-50 text-indigo-600',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600'
  };

  const Icon = icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardDescription className="text-sm font-medium">{title}</CardDescription>
          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", colors[color])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <CardTitle className="text-2xl">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {change && (
          <div className={cn(
            "text-xs flex items-center",
            change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'
          )}>
            {change} <ArrowRight className="h-3 w-3 ml-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ActivityItem = ({ client, action, produit, montant, date_action, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'appel':
        return <Phone className="h-4 w-4 text-purple-500" />;
      case 'rdv':
        return <CalendarClock className="h-4 w-4 text-amber-500" />;
      case 'investissement':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 mt-1">
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          {getIcon()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm truncate">{client}</h4>
          <span className="text-xs text-muted-foreground">
            {new Date(date_action).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{action}</p>
        <div className="flex items-center gap-2 mt-1">
          {produit && (
            <Badge variant="outline" className="text-xs font-normal">
              {produit}
            </Badge>
          )}
          {montant && (
            <span className="text-xs font-medium">
              {Number(montant).toLocaleString('fr-FR')} €
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const AppointmentItem = ({ client, theme, date_rdv, heure }) => {
  const formattedDate = new Date(date_rdv).toLocaleDateString('fr-FR', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
          <CalendarClock className="h-4 w-4 text-indigo-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{client}</h4>
          <Badge variant="outline" className="text-xs">
            {heure}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{theme}</p>
        <div className="mt-2">
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
};

const AlertItem = ({ type_alerte, nombre, color, action, onClick }) => {
  const colorClasses = {
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  const getIcon = () => {
    switch (type_alerte) {
      case 'Profils incomplets':
        return <AlertCircle className="h-5 w-5" />;
      case 'Clients inactifs':
        return <Clock className="h-5 w-5" />;
      case 'Épargne disponible élevée':
        return <DollarSign className="h-5 w-5" />;
      case 'Optimisations fiscales possibles':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", colorClasses[color])}>
            {getIcon()}
          </div>
          <div>
            <h4 className="font-medium">{type_alerte}</h4>
            <p className="text-sm text-muted-foreground mt-1">{action}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold">{nombre}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 gap-1 text-primary" 
            onClick={onClick}
          >
            Traiter <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const VueGeneralePage = () => {
  const [periode, setPeriode] = useState("6mois");
  const [isExporting, setIsExporting] = useState(false);
  
  const { data, isLoading, error, refetch } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const [modalState, setModalState] = useState({ 
    isOpen: false, 
    title: '', 
    description: '', 
    viewName: '' 
  });

  const { data: modalData, isLoading: isModalLoading } = useQuery({
    queryKey: ['modalDetails', modalState.viewName],
    queryFn: async () => {
      if (!modalState.viewName) return [];
      const { data, error } = await supabase.from(modalState.viewName).select('*');
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: modalState.isOpen && !!modalState.viewName,
  });

  const handleOpenModal = (title, description, viewName) => {
    setModalState({ isOpen: true, title, description, viewName });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, title: '', description: '', viewName: '' });
  };

  const safeMap = <T, U>(array: T[] | undefined | null, callback: (item: T, index: number) => U): U[] => {
    if (!Array.isArray(array)) return [];
    return array.filter(item => item != null).map(callback);
  };

  const safeNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Fonctions de traitement des données
  const processEncourData = () => {
    if (!data?.encoursStats || data.encoursStats.length === 0) return [];
    return safeMap(data.encoursStats, (item) => ({
      month: item?.month ? new Date(item.month + '-01').toLocaleDateString('fr-FR', { month: 'short' }) : 'N/A',
      banque: safeNumber(item?.encours_reels_banque),
      assurance: safeNumber(item?.encours_reels_assurance_vie),
      capitalisation: safeNumber(item?.encours_reels_capitalisation),
      entreprise: safeNumber(item?.encours_reels_entreprise),
    }));
  };

  const processRepartitionData = () => {
    if (!data?.repartitionActifs || data.repartitionActifs.length === 0) return [];
    const total = data.repartitionActifs.reduce((sum, item) => sum + safeNumber(item?.valeur_totale), 0);
    if (total === 0) return [];
    return safeMap(data.repartitionActifs, (item) => ({
      name: item?.classe_actif || 'Autre',
      value: safeNumber(item?.valeur_totale),
    })).filter(item => item.value > 0);
  };

  const processAlertesData = () => {
    if (!data?.alertesOpportunites || data.alertesOpportunites.length === 0) return [];
    const colorMap = { amber: 'amber', red: 'red', blue: 'blue', purple: 'purple' };
    const actionMap = {
      'Profils incomplets': 'Compléter les informations client.',
      'Clients inactifs': 'Prendre contact pour un suivi.',
      'Épargne disponible élevée': 'Proposer des opportunités d\'investissement.',
      'Optimisations fiscales possibles': 'Planifier un audit fiscal.'
    };
    return safeMap(data.alertesOpportunites, (item) => ({
      ...item,
      nombre: safeNumber(item?.nombre),
      color: colorMap[item.couleur] || 'blue',
      action: actionMap[item.type_alerte] || 'Action requise'
    }));
  };

  const encoursData = processEncourData();
  const repartitionData = processRepartitionData();
  const alertesData = processAlertesData();
  const clientsData = data?.clientsStats ? safeMap(data.clientsStats, item => ({
      month: new Date(item.month + '-01').toLocaleDateString('fr-FR', { month: 'short' }),
      total: safeNumber(item.total_clients),
      nouveaux: safeNumber(item.nouveaux_clients)
  })) : [];

  const totalAlertes = alertesData.reduce((sum, item) => sum + item.nombre, 0);
  const encoursTotalActuel = safeNumber(data?.totalAssets?.encoursTotalActuel);
  const epargneDisponibleActuelle = safeNumber(data?.totalEpargne?.epargneDisponibleActuelle);
  const clientsActuels = safeNumber(data?.realtimeStats?.totalClients);
  const nouveauxClients = safeNumber(data?.realtimeStats?.nouveauxClients);

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M€`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k€`;
    return num.toString();
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg font-medium">Chargement du tableau de bord...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center p-6 max-w-md">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Erreur de chargement</h2>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => refetch()} variant="secondary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tableau de Bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre portefeuille clients</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={periode} onValueChange={setPeriode}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6mois">6 derniers mois</SelectItem>
              <SelectItem value="1an">12 derniers mois</SelectItem>
              <SelectItem value="3ans">3 dernières années</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
          <Button 
            variant="outline" 
            disabled={isExporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Actifs totaux" 
          value={`${(encoursTotalActuel / 1000000).toFixed(2)}M€`} 
          change="+12.5% vs mois dernier" 
          icon={Briefcase} 
          color="primary"
        />
        <StatCard 
          title="Épargne disponible" 
          value={`${(epargneDisponibleActuelle / 1000000).toFixed(2)}M€`} 
          change="+8.2% vs mois dernier" 
          icon={DollarSign} 
          color="success"
        />
        <StatCard 
          title="Portefeuille clients" 
          value={clientsActuels.toLocaleString('fr-FR')} 
          change={`+${nouveauxClients.toLocaleString('fr-FR')} ce mois`} 
          icon={Users} 
          color="info"
        />
        <StatCard 
          title="Alertes actives" 
          value={totalAlertes.toLocaleString('fr-FR')} 
          change="3 nouvelles cette semaine" 
          icon={AlertTriangle} 
          color="warning"
        />
      </div>

      <Tabs defaultValue="encours">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="encours" className="gap-1">
              <Briefcase className="h-4 w-4" />
              Actifs
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-1">
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="alertes" className="gap-1">
              <AlertCircle className="h-4 w-4" />
              Alertes
            </TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            Données mises à jour à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <TabsContent value="encours" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Évolution des actifs
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={encoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6B7280' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000)}k`}
                      tick={{ fill: '#6B7280' }}
                      tickLine={false}
                    />
                    <Tooltip 
                      formatter={(value) => [`${(safeNumber(value) / 1000).toFixed(1)}k€`, '']}
                      labelFormatter={(label) => `Mois: ${label}`}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="banque" 
                      stroke={COLORS.primary} 
                      fill={COLORS.primary}
                      fillOpacity={0.1}
                      name="Banque" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="assurance" 
                      stroke={COLORS.success} 
                      fill={COLORS.success}
                      fillOpacity={0.1}
                      name="Assurance Vie" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="capitalisation" 
                      stroke={COLORS.warning} 
                      fill={COLORS.warning}
                      fillOpacity={0.1}
                      name="Capitalisation" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="entreprise" 
                      stroke={COLORS.secondary} 
                      fill={COLORS.secondary}
                      fillOpacity={0.1}
                      name="Entreprise" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-primary" />
                  Répartition des actifs
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie 
                      data={repartitionData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={120}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {repartitionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHART_COLORS[index % CHART_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${(value / 1000).toFixed(1)}k€`, name]}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      formatter={(value) => (
                        <span className="text-sm text-gray-600">{value}</span>
                      )}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5 text-primary" />
                  Évolution des clients
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={clientsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6B7280' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280' }}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="total" 
                      name="Clients totaux" 
                      fill={COLORS.primary} 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="nouveaux" 
                      name="Nouveaux clients" 
                      fill={COLORS.orange} 
                      radius={[4, 4, 0, 0]}
                    />
                  </ReBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  Rendez-vous à venir
                </CardTitle>
                <CardDescription>Prochains rendez-vous programmés</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[340px]">
                  <div className="space-y-3">
                    {safeMap(data?.prochainsRdv, (rdv, index) => (
                      <AppointmentItem 
                        key={index}
                        client={rdv.client}
                        theme={rdv.theme}
                        date_rdv={rdv.date_rdv}
                        heure={rdv.heure}
                      />
                    ))}
                    {(!data?.prochainsRdv || data.prochainsRdv.length === 0) && (
                      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                        <CalendarClock className="h-8 w-8" />
                        Aucun rendez-vous à venir
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="ghost" className="text-primary">
                  Voir tous les rendez-vous <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Distribution des alertes
                </CardTitle>
                <CardDescription>Alertes nécessitant votre attention</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart 
                    layout="vertical" 
                    data={alertesData} 
                    margin={{ left: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      type="number" 
                      tick={{ fill: '#6B7280' }}
                      tickLine={false}
                    />
                    <YAxis 
                      dataKey="type_alerte" 
                      type="category" 
                      width={120}
                      tick={{ fill: '#6B7280' }}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="nombre" 
                      name="Nombre de cas"
                    >
                      {alertesData.map((entry, index) => {
                        const colorMap = {
                          amber: COLORS.warning,
                          red: COLORS.danger,
                          blue: COLORS.info,
                          purple: COLORS.secondary
                        };
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={colorMap[entry.color] || COLORS.primary} 
                          />
                        );
                      })}
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Actions prioritaires
                </CardTitle>
                <CardDescription>Actions recommandées pour chaque type d'alerte</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[340px]">
                  <div className="space-y-4">
                    {alertesData.map((alerte, index) => {
                      const alertTypeToViewMap = {
                        'Profils incomplets': 'dashboard_details_profils_incomplets',
                        'Clients inactifs': 'dashboard_details_clients_inactifs',
                        'Optimisations fiscales possibles': 'dashboard_details_optimisations_fiscales',
                        'Épargne disponible élevée': 'dashboard_epargne_disponible'
                      };
                      const viewName = alertTypeToViewMap[alerte.type_alerte];
                      return (
                        <AlertItem
                          key={index}
                          type_alerte={alerte.type_alerte}
                          nombre={alerte.nombre}
                          color={alerte.color}
                          action={alerte.action}
                          onClick={() => handleOpenModal(alerte.type_alerte, alerte.action, viewName)}
                        />
                      );
                    })}
                    {alertesData.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                        <CheckCircle className="h-8 w-8" />
                        Aucune alerte active
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Section Activités récentes et Épargne disponible */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Activités récentes
            </CardTitle>
            <CardDescription>Dernières interactions avec vos clients</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {safeMap(data?.recentActivities, (activity, index) => (
                  <ActivityItem
                    key={index}
                    client={activity.client}
                    action={activity.action}
                    produit={activity.produit}
                    montant={activity.montant}
                    date_action={activity.date_action}
                    type={activity.type}
                  />
                ))}
                {(!data?.recentActivities || data.recentActivities.length === 0) && (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                    <FileText className="h-8 w-8" />
                    Aucune activité récente
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t">
            <Button variant="ghost" className="text-primary">
              Voir toutes les activités <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Top épargnes disponibles
            </CardTitle>
            <CardDescription>Clients avec le plus d'épargne disponible</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safeMap([...(data?.epargneDisponible || [])]
                .sort((a, b) => b.value - a.value)
                .slice(0, 5), (item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium">{item.client}</div>
                      <div className="text-xs text-muted-foreground">{item.produit}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {safeNumber(item.value).toLocaleString('fr-FR')} €
                    </div>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-primary"
                      onClick={() => item.email && handleOpenModal(
                        `Épargne disponible - ${item.client}`,
                        `${item.produit} - ${safeNumber(item.value).toLocaleString('fr-FR')} €`,
                        'dashboard_epargne_disponible'
                      )}
                    >
                      Contacter
                    </Button>
                  </div>
                </div>
              ))}
              {(!data?.epargneDisponible || data.epargneDisponible.length === 0) && (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                  <DollarSign className="h-8 w-8" />
                  Aucune donnée d'épargne disponible
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t">
            <Button variant="ghost" className="text-primary">
              Voir toutes les opportunités <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Rendu de la modale */}
      <DetailModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        title={modalState.title}
        description={modalState.description}
        data={modalData}
        isLoading={isModalLoading}
      />
    </div>
  );
};

export default VueGeneralePage;