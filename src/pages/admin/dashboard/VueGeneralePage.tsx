import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Import des composants UI (y compris Dialog et Table pour les modales)
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowUpRight, 
  Users, 
  Briefcase, 
  AlertTriangle, 
  Brain,
  CalendarClock, 
  Mail,
  FileText,
  RefreshCw,
  Download,
  Loader2,
  Phone,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Edit
} from "lucide-react";
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

const COLORS = ['#8B5CF6', '#F97316', '#D946EF', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

// Interfaces pour le typage des données
interface DashboardData {
  encoursStats: Array<{ month: string; encours_reels_banque: number; encours_reels_assurance_vie: number; encours_reels_capitalisation: number; encours_reels_entreprise: number; encours_reels_total: number; }>;
  clientsStats: Array<{ month: string; total_clients: number; nouveaux_clients: number; }>;
  recentActivities: Array<{ client: string; action: string; produit: string; montant: number; date_action: string; type: string; }>;
  alertesOpportunites: Array<{ type_alerte: string; couleur: string; nombre: number; }>;
  repartitionActifs: Array<{ classe_actif: string; valeur_totale: number; }>;
  prochainsRdv: Array<{ client: string; theme: string; date_rdv: string; heure: string; }>;
  epargneDisponible: Array<{ client: string; value: number; produit: string; }>;
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
    supabase.from('dashboard_total_assets').select('encoursTotalActuel').limit(1),
    supabase.from('dashboard_total_epargne_disponible').select('epargneDisponibleActuelle').limit(1)
  ]);

  const errors = [encoursError, clientsError, activitiesError, alertesError, repartitionError, rdvError, epargneError, realtimeError, assetsError, totalEpargneError].filter(Boolean);
  if (errors.length > 0) {
    console.error('Errors fetching dashboard data:', errors);
    throw new Error('Failed to fetch dashboard data');
  }

  const totalAssets = totalAssetsData?.[0] || { encoursTotalActuel: 0 };
  const totalEpargne = totalEpargneData?.[0] || { epargneDisponibleActuelle: 0 };

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

// Composant pour la modale affichant les détails
const DetailModal = ({ isOpen, onClose, title, description, data, isLoading }) => {
  if (!isOpen) return null;

  const handleContact = (email) => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(title)}`;
  };

  const handleEdit = (userId) => {
    // Remplacez par votre logique de navigation, ex: router.push(`/admin/clients/${userId}`)
    alert(`Navigation vers la page d'édition du client ID: ${userId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.length > 0 ? (
                  data.map((item) => (
                    <TableRow key={item.user_id || item.id}>
                      <TableCell>{item.first_name} {item.last_name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleContact(item.email)}>
                          <Mail className="h-4 w-4 mr-2" /> Contacter
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item.user_id || item.id)}>
                          <Edit className="h-4 w-4 mr-2" /> Voir le profil
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">Aucune donnée à afficher.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

  const [modalState, setModalState] = useState({ isOpen: false, title: '', description: '', viewName: '' });

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

  // Fonctions de traitement des données (processEncourData, etc.)
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
    const colorMap = { amber: '#F59E0B', red: '#EF4444', blue: '#3B82F6', purple: '#8B5CF6' };
    const actionMap = {
      'Profils incomplets': 'Compléter les informations client.',
      'Clients inactifs': 'Prendre contact pour un suivi.',
      'Épargne disponible élevée': 'Proposer des opportunités d\'investissement.',
      'Optimisations fiscales possibles': 'Planifier un audit fiscal.'
    };
    return safeMap(data.alertesOpportunites, (item) => ({
      ...item,
      nombre: safeNumber(item?.nombre),
      color: colorMap[item.couleur] || '#6B7280',
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

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <div className="text-red-500 p-4">Erreur de chargement: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}><RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Rafraîchir</Button>
          <Select value={periode} onValueChange={setPeriode}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Période" /></SelectTrigger><SelectContent><SelectItem value="6mois">6 mois</SelectItem><SelectItem value="1an">1 an</SelectItem></SelectContent></Select>
          <Button variant="outline" disabled={isExporting}><Download className="h-4 w-4 mr-2" /> Exporter</Button>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardDescription>Actifs totaux</CardDescription><CardTitle className="text-2xl">{(encoursTotalActuel / 1000000).toFixed(2)} M€</CardTitle></CardHeader><CardContent><div className="text-sm text-muted-foreground">Tous produits confondus</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Épargne disponible</CardDescription><CardTitle className="text-2xl text-emerald-600">{(epargneDisponibleActuelle / 1000000).toFixed(2)} M€</CardTitle></CardHeader><CardContent><div className="text-sm text-muted-foreground">Potentiel d'investissement</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Portefeuille clients</CardDescription><CardTitle className="text-2xl">{clientsActuels.toLocaleString('fr-FR')}</CardTitle></CardHeader><CardContent><div className="text-sm text-muted-foreground">+{nouveauxClients.toLocaleString('fr-FR')} ce mois-ci</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Alertes actives</CardDescription><CardTitle className="text-2xl text-amber-600">{totalAlertes.toLocaleString('fr-FR')}</CardTitle></CardHeader><CardContent><div className="text-sm text-muted-foreground">Actions requises</div></CardContent></Card>
      </div>

      <Tabs defaultValue="encours" className="w-full">
        <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="encours">Actifs</TabsTrigger><TabsTrigger value="clients">Clients</TabsTrigger><TabsTrigger value="alertes">Alertes</TabsTrigger></TabsList>
        
        <TabsContent value="encours" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle>Évolution des actifs</CardTitle></CardHeader><CardContent className="h-[400px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={encoursData}><CartesianGrid /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value) => `${(safeNumber(value) / 1000).toFixed(1)} k€`} /><Legend /><Line type="monotone" dataKey="banque" stroke="#3B82F6" name="Banque" /><Line type="monotone" dataKey="assurance" stroke="#10B981" name="Assurance Vie" /><Line type="monotone" dataKey="capitalisation" stroke="#F59E0B" name="Capitalisation" /><Line type="monotone" dataKey="entreprise" stroke="#8B5CF6" name="Entreprise" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle>Répartition des actifs</CardTitle></CardHeader><CardContent className="h-[400px]"><ResponsiveContainer width="100%" height="100%"><RePieChart><Pie data={repartitionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{repartitionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip formatter={(value, name) => [`${(value / 1000).toFixed(1)} k€`, name]} /></RePieChart></ResponsiveContainer></CardContent></Card>
        </TabsContent>

        <TabsContent value="clients" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle>Évolution des clients</CardTitle></CardHeader><CardContent className="h-[400px]"><ResponsiveContainer width="100%" height="100%"><ReBarChart data={clientsData}><CartesianGrid /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Bar dataKey="total" name="Clients totaux" fill="#8B5CF6" /><Bar dataKey="nouveaux" name="Nouveaux clients" fill="#F97316" /></ReBarChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader><CardTitle>Rendez-vous à venir</CardTitle></CardHeader><CardContent><ScrollArea className="h-[340px]"><div className="space-y-3">{safeMap(data?.prochainsRdv, (rdv, index) => (<div key={index} className="border rounded-md p-3"><div className="flex items-center justify-between"><div className="font-medium">{rdv.client}</div><Badge variant="outline">{rdv.date_rdv}</Badge></div><p className="text-sm text-muted-foreground">{rdv.theme}</p></div>))}</div></ScrollArea></CardContent></Card>
        </TabsContent>

        <TabsContent value="alertes" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle>Distribution des alertes</CardTitle></CardHeader><CardContent className="h-[400px]"><ResponsiveContainer width="100%" height="100%"><ReBarChart layout="vertical" data={alertesData} margin={{ left: 30 }}><CartesianGrid /><XAxis type="number" /><YAxis dataKey="type_alerte" type="category" width={120} /><Tooltip /><Bar dataKey="nombre" name="Nombre de cas">{alertesData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Bar></ReBarChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader><CardTitle>Actions prioritaires</CardTitle></CardHeader><CardContent><ScrollArea className="h-[340px]"><div className="space-y-3">{alertesData.map((alerte, index) => {
                const alertTypeToViewMap = {
                    'Profils incomplets': 'dashboard_details_profils_incomplets',
                    'Clients inactifs': 'dashboard_details_clients_inactifs',
                    'Optimisations fiscales possibles': 'dashboard_details_optimisations_fiscales',
                    'Épargne disponible élevée': 'dashboard_epargne_disponible'
                };
                const viewName = alertTypeToViewMap[alerte.type_alerte];
                return (<div key={index} className="border rounded-md p-3"><div className="flex items-center justify-between"><div className="flex items-center"><div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: alerte.color }} /><div><div className="font-medium">{alerte.type_alerte}</div><div className="text-sm text-muted-foreground">{alerte.nombre} cas</div></div></div><Button variant="secondary" size="sm" onClick={() => handleOpenModal(alerte.type_alerte, alerte.action, viewName)} disabled={!viewName}>Traiter</Button></div></div>);
            })}</div></ScrollArea></CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Section Activités récentes et Épargne disponible */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardHeader><CardTitle>Activités récentes</CardTitle></CardHeader><CardContent><ScrollArea className="h-[400px]"><div className="space-y-4">{safeMap(data?.recentActivities, (activity, index) => (<div key={index} className="flex items-center"><div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary mr-4"><Mail className="h-5 w-5" /></div><div><p className="font-medium">{activity.client} - {activity.action}</p><p className="text-sm text-muted-foreground">{activity.produit} • {safeNumber(activity.montant).toLocaleString('fr-FR')} €</p></div></div>))}</div></ScrollArea></CardContent></Card>
        <Card><CardHeader><CardTitle>Top épargnes disponibles</CardTitle></CardHeader><CardContent><div className="space-y-4">{safeMap([...(data?.epargneDisponible || [])].sort((a, b) => b.value - a.value).slice(0, 5), (item, index) => (<div key={index} className="flex items-center justify-between"><div className="font-medium">{item.client}</div><div className="text-right"><div className="font-semibold">{safeNumber(item.value).toLocaleString('fr-FR')} €</div><Button variant="link" size="sm" className="h-auto p-0" onClick={() => handleContact(item.email)}>Contacter</Button></div></div>))}</div></CardContent></Card>
      </div>

      {/* Rendu de la modale (invisible par défaut) */}
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
