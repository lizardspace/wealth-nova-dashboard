import React, { useState, useEffect } from 'react';
import { CalendarIcon, Filter, Plus, List, LayoutGrid, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/lib/supabase';
import { 
  AppointmentType,
  Event,
  HistoricalAppointment
} from '@/components/appointments/AppointmentTypes';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { AppointmentGrid } from '@/components/appointments/AppointmentGrid';
import { CalendarView } from '@/components/appointments/CalendarView';
import { HistoryView } from '@/components/appointments/HistoryView';
import { AppointmentSidebar } from '@/components/appointments/AppointmentSidebar';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isThisWeek, isThisMonth, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PlanningPage(): React.ReactNode {
  const [viewType, setViewType] = useState<"list" | "grid" | "calendar" | "history">("calendar");
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>("tous");
  const [selectedTypes, setSelectedTypes] = useState<AppointmentType[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Données de fallback si la base de données n'est pas accessible
  const fallbackEvents: Event[] = [
    {
      id: 'fallback-1',
      title: 'Consultation initiale',
      client: 'Jean Dupont',
      advisor: 'Marie Martin',
      type: 'consultation',
      date: '2025-07-30',
      time: '09:00:00',
      duration: 60,
      status: 'upcoming',
      notes: 'Premier rendez-vous client',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      title: 'Suivi mensuel',
      client: 'Sophie Leblanc',
      advisor: 'Pierre Durand',
      type: 'suivi',
      date: '2025-07-30',
      time: '10:30:00',
      duration: 45,
      status: 'confirmed',
      notes: 'Révision du portefeuille',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fallback-3',
      title: 'Signature contrat',
      client: 'Michel Bernard',
      advisor: 'Marie Martin',
      type: 'signature',
      date: '2025-07-30',
      time: '14:00:00',
      duration: 30,
      status: 'upcoming',
      notes: 'Signature assurance vie',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Test de connexion Supabase
  const testSupabaseConnection = async () => {
    try {
      setDebugInfo("Test de connexion Supabase...");
      
      // Test simple de connexion
      const { data, error } = await supabase
        .from('appointments')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        setDebugInfo(`Erreur Supabase: ${error.message} (Code: ${error.code})`);
        return false;
      }
      
      setDebugInfo(`Connexion réussie. ${data?.length || 0} enregistrements trouvés.`);
      return true;
    } catch (err) {
      setDebugInfo(`Erreur de connexion: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      return false;
    }
  };

  // Fonction pour récupérer les rendez-vous depuis Supabase
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo("Début de récupération des données...");
      
      // Test de connexion d'abord
      const connectionOk = await testSupabaseConnection();
      if (!connectionOk) {
        throw new Error("Impossible de se connecter à la base de données");
      }
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        setDebugInfo("Aucune donnée trouvée, utilisation des données de fallback");
        setEvents(fallbackEvents);
        return;
      }
      
      // Transformer les données pour correspondre au format Event
      const transformedEvents: Event[] = data.map(appointment => ({
        id: appointment.id,
        title: appointment.title,
        client: appointment.client,
        advisor: appointment.advisor,
        type: appointment.type as AppointmentType,
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration,
        status: appointment.status as Event['status'],
        notes: appointment.notes || '',
        created_at: appointment.created_at,
        updated_at: appointment.updated_at
      }));
      
      setEvents(transformedEvents);
      setDebugInfo(`${transformedEvents.length} rendez-vous chargés avec succès`);
    } catch (err) {
      console.error('Erreur lors de la récupération des rendez-vous:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      setDebugInfo(`Erreur: ${errorMessage}. Utilisation des données de fallback.`);
      
      // Utiliser les données de fallback en cas d'erreur
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  // Créer la table si elle n'existe pas
  const createTableIfNotExists = async () => {
    try {
      setDebugInfo("Tentative de création de la table...");
      
      // Note: Cette approche ne fonctionne généralement pas avec l'API Supabase
      // Il faut utiliser l'interface SQL de Supabase pour créer les tables
      const { error } = await supabase.rpc('create_appointments_table');
      
      if (error) {
        setDebugInfo(`Impossible de créer la table: ${error.message}`);
        return false;
      }
      
      setDebugInfo("Table créée avec succès");
      return true;
    } catch (err) {
      setDebugInfo(`Erreur lors de la création de table: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      return false;
    }
  };

  // Charger les rendez-vous au montage du composant
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Logique de filtrage
  useEffect(() => {
    let filtered = [...events];
    
    // Filtrer par date selon l'onglet actif
    if (activeTab === "today") {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return isToday(eventDate);
      });
    } else if (activeTab === "week") {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return isThisWeek(eventDate, { weekStartsOn: 1 });
      });
    } else if (activeTab === "month") {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return isThisMonth(eventDate);
      });
    } else if (activeTab === "upcoming") {
      const now = new Date();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return (eventDate >= now || isToday(eventDate)) && 
               (event.status === "upcoming" || event.status === "confirmed");
      });
    }
    
    // Filtrer par conseiller
    if (selectedAdvisor !== "tous") {
      filtered = filtered.filter(event => 
        event.advisor.toLowerCase().includes(selectedAdvisor.toLowerCase())
      );
    }
    
    // Filtrer par type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(event => 
        selectedTypes.includes(event.type)
      );
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(event => 
        event.client.toLowerCase().includes(query) || 
        event.title.toLowerCase().includes(query) ||
        event.advisor.toLowerCase().includes(query)
      );
    }
    
    setFilteredEvents(filtered);
  }, [date, selectedAdvisor, selectedTypes, activeTab, searchQuery, events]);

  // Basculer le filtre de type
  const toggleTypeFilter = (type: AppointmentType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handlePreviousDate = () => {
    if (view === 'day') {
      setDate(subDays(date, 1));
    } else if (view === 'week') {
      setDate(subDays(date, 7));
    }
  };

  const handleNextDate = () => {
    if (view === 'day') {
      setDate(addDays(date, 1));
    } else if (view === 'week') {
      setDate(addDays(date, 7));
    }
  };

  // Filtrer les rendez-vous pour l'historique
  const filterHistoricalAppointments = (): HistoricalAppointment[] => {
    return filteredEvents as HistoricalAppointment[];
  };

  // Filtrer les événements pour le calendrier
  const filterCalendarEvents = () => {
    let filtered = [...events];
    
    if (selectedAdvisor !== "tous") {
      filtered = filtered.filter(event => 
        event.advisor.toLowerCase().includes(selectedAdvisor.toLowerCase())
      );
    }
    
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(event => 
        selectedTypes.includes(event.type)
      );
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(event => 
        event.client.toLowerCase().includes(query) || 
        event.title.toLowerCase().includes(query) ||
        event.advisor.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Planning des rendez-vous</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <div className="text-lg">Chargement des rendez-vous...</div>
            {debugInfo && <div className="text-sm text-gray-500 mt-2">{debugInfo}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Planning des rendez-vous</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAppointments}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rendez-vous
          </Button>
        </div>
      </div>

      {/* Affichage des alertes de debug/erreur */}
      {(error || debugInfo) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error && <div className="text-red-600 font-medium">Erreur: {error}</div>}
            {debugInfo && <div className="text-blue-600">{debugInfo}</div>}
            {error && (
              <div className="mt-2 text-sm text-gray-600">
                Mode de démonstration activé avec des données d'exemple.
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar gauche */}
        <AppointmentSidebar 
          date={date} 
          setDate={setDate} 
          selectedAdvisor={selectedAdvisor} 
          setSelectedAdvisor={setSelectedAdvisor} 
          selectedTypes={selectedTypes} 
          toggleTypeFilter={toggleTypeFilter} 
        />

        {/* Contenu principal */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Rechercher un RDV ou un client..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gray-100 rounded-md flex">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={viewType === "list" ? "bg-white shadow" : ""}
                  onClick={() => setViewType("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={viewType === "grid" ? "bg-white shadow" : ""}
                  onClick={() => setViewType("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={viewType === "calendar" ? "bg-white shadow" : ""}
                  onClick={() => setViewType("calendar")}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={viewType === "history" ? "bg-white shadow" : ""}
                  onClick={() => setViewType("history")}
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden">
            <Tabs 
              defaultValue="all" 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="border-b px-4">
                <TabsList className="h-14 gap-4">
                  <TabsTrigger value="all" className="data-[state=active]:text-primary">
                    Tous les RDV ({events.length})
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="data-[state=active]:text-primary">
                    À venir ({events.filter(e => e.status === 'upcoming' || e.status === 'confirmed').length})
                  </TabsTrigger>
                  <TabsTrigger value="today" className="data-[state=active]:text-primary">
                    Aujourd'hui ({events.filter(e => isToday(new Date(e.date))).length})
                  </TabsTrigger>
                  <TabsTrigger value="week" className="data-[state=active]:text-primary">
                    Cette semaine ({events.filter(e => isThisWeek(new Date(e.date), { weekStartsOn: 1 })).length})
                  </TabsTrigger>
                  <TabsTrigger value="month" className="data-[state=active]:text-primary">
                    Ce mois ({events.filter(e => isThisMonth(new Date(e.date))).length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                {viewType === "list" ? <AppointmentList appointments={filteredEvents} /> : 
                 viewType === "grid" ? <AppointmentGrid appointments={filteredEvents} /> : 
                 viewType === "calendar" ? <CalendarView date={date} setDate={setDate} events={filterCalendarEvents()} /> :
                 <HistoryView appointments={filterHistoricalAppointments()} />}
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-0">
                {viewType === "list" ? <AppointmentList appointments={filteredEvents} /> : 
                 viewType === "grid" ? <AppointmentGrid appointments={filteredEvents} /> : 
                 viewType === "calendar" ? <CalendarView date={date} setDate={setDate} events={filterCalendarEvents()} /> :
                 <HistoryView appointments={filterHistoricalAppointments()} />}
              </TabsContent>
              
              <TabsContent value="today" className="mt-0">
                {viewType === "list" ? <AppointmentList appointments={filteredEvents} /> : 
                 viewType === "grid" ? <AppointmentGrid appointments={filteredEvents} /> : 
                 viewType === "calendar" ? <CalendarView date={date} setDate={setDate} events={filterCalendarEvents()} /> :
                 <HistoryView appointments={filterHistoricalAppointments()} />}
              </TabsContent>
              
              <TabsContent value="week" className="mt-0">
                {viewType === "list" ? <AppointmentList appointments={filteredEvents} /> : 
                 viewType === "grid" ? <AppointmentGrid appointments={filteredEvents} /> : 
                 viewType === "calendar" ? <CalendarView date={date} setDate={setDate} events={filterCalendarEvents()} /> :
                 <HistoryView appointments={filterHistoricalAppointments()} />}
              </TabsContent>
              
              <TabsContent value="month" className="mt-0">
                {viewType === "list" ? <AppointmentList appointments={filteredEvents} /> : 
                 viewType === "grid" ? <AppointmentGrid appointments={filteredEvents} /> : 
                 viewType === "calendar" ? <CalendarView date={date} setDate={setDate} events={filterCalendarEvents()} /> :
                 <HistoryView appointments={filterHistoricalAppointments()} />}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}