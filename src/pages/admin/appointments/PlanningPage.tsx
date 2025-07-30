import React, { useState, useEffect } from 'react';
import { CalendarIcon, Filter, Plus, List, LayoutGrid, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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

  // Fonction pour récupérer les rendez-vous depuis Supabase
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      // Transformer les données pour correspondre au format Event
      const transformedEvents: Event[] = (data || []).map(appointment => ({
        id: appointment.id,
        title: appointment.title,
        client: appointment.client,
        advisor: appointment.advisor,
        type: appointment.type as AppointmentType,
        date: appointment.date, // Format: YYYY-MM-DD
        time: appointment.time, // Format: HH:MM:SS
        duration: appointment.duration,
        status: appointment.status as Event['status'],
        notes: appointment.notes || '',
        created_at: appointment.created_at,
        updated_at: appointment.updated_at
      }));
      
      setEvents(transformedEvents);
    } catch (err) {
      console.error('Erreur lors de la récupération des rendez-vous:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Charger les rendez-vous au montage du composant
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fonction pour ajouter un nouveau rendez-vous
  const addAppointment = async (newAppointment: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          title: newAppointment.title,
          client: newAppointment.client,
          advisor: newAppointment.advisor,
          type: newAppointment.type,
          date: newAppointment.date,
          time: newAppointment.time,
          duration: newAppointment.duration,
          status: newAppointment.status,
          notes: newAppointment.notes
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Recharger les rendez-vous
      await fetchAppointments();
      
      return data;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du rendez-vous:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
      throw err;
    }
  };

  // Fonction pour mettre à jour un rendez-vous
  const updateAppointment = async (id: string, updates: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Recharger les rendez-vous
      await fetchAppointments();
      
      return data;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  // Fonction pour supprimer un rendez-vous
  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Recharger les rendez-vous
      await fetchAppointments();
    } catch (err) {
      console.error('Erreur lors de la suppression du rendez-vous:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };
  
  const weekDays = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 })
  });

  // Logique de filtrage améliorée
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

  // Fonction utilitaire pour parser les dates au format "15/04/2025"
  const parseDate = (dateString: string): Date => {
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    // Si c'est déjà au format ISO (YYYY-MM-DD)
    return new Date(dateString);
  };

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
    let filtered = [...events];
    
    // Appliquer les filtres d'onglet
    if (activeTab === "today") {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date);
        return isToday(appDate);
      });
    } else if (activeTab === "week") {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date);
        return isThisWeek(appDate, { weekStartsOn: 1 });
      });
    } else if (activeTab === "month") {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date);
        return isThisMonth(appDate);
      });
    } else if (activeTab === "upcoming") {
      const now = new Date();
      filtered = filtered.filter(app => {
        const appDate = new Date(app.date);
        return (appDate >= now || isToday(appDate)) && 
               (app.status === "upcoming" || app.status === "confirmed");
      });
    }
    
    // Appliquer le filtre conseiller
    if (selectedAdvisor !== "tous") {
      filtered = filtered.filter(app => 
        app.advisor.toLowerCase().includes(selectedAdvisor.toLowerCase())
      );
    }
    
    // Appliquer le filtre type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(app => 
        selectedTypes.includes(app.type)
      );
    }
    
    // Appliquer le filtre recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(app => 
        app.client.toLowerCase().includes(query) ||
        app.title.toLowerCase().includes(query) ||
        app.advisor.toLowerCase().includes(query)
      );
    }
    
    return filtered as HistoricalAppointment[];
  };

  // Filtrer les événements pour le calendrier
  const filterCalendarEvents = () => {
    let filtered = [...events];
    
    // Appliquer le filtre conseiller
    if (selectedAdvisor !== "tous") {
      filtered = filtered.filter(event => 
        event.advisor.toLowerCase().includes(selectedAdvisor.toLowerCase())
      );
    }
    
    // Appliquer le filtre type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(event => 
        selectedTypes.includes(event.type)
      );
    }
    
    // Appliquer le filtre recherche
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
          <div className="text-lg">Chargement des rendez-vous...</div>
        </div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Planning des rendez-vous</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-4">Erreur: {error}</div>
            <Button onClick={fetchAppointments}>Réessayer</Button>
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