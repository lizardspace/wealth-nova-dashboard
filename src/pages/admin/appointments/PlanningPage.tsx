import React, { useState, useEffect } from 'react';
import { CalendarIcon, Filter, Plus, List, LayoutGrid, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  events,
  calendarEvents,
  appointments,
  AppointmentType,
  Event,
  HistoricalAppointment,
} from '@/components/appointments/AppointmentTypes';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { AppointmentGrid } from '@/components/appointments/AppointmentGrid';
import { CalendarView } from '@/components/appointments/CalendarView';
import { HistoryView } from '@/components/appointments/HistoryView';
import { AppointmentSidebar } from '@/components/appointments/AppointmentSidebar';
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isThisWeek,
  isThisMonth,
  isToday,
  parseISO,
} from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PlanningPage(): React.ReactNode {
  const [viewType, setViewType] = useState<'list' | 'grid' | 'calendar' | 'history'>('calendar');
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>('tous');
  const [selectedTypes, setSelectedTypes] = useState<AppointmentType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const weekDays = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });

  // Filtering logic
  useEffect(() => {
    let filtered = [...events];

    // Filter by date based on active tab
    if (activeTab === 'today') {
      filtered = filtered.filter(event => {
        const eventDate = parseDate(event.date);
        return isToday(eventDate);
      });
    } else if (activeTab === 'week') {
      filtered = filtered.filter(event => {
        const eventDate = parseDate(event.date);
        return isThisWeek(eventDate, { weekStartsOn: 1 });
      });
    } else if (activeTab === 'month') {
      filtered = filtered.filter(event => {
        const eventDate = parseDate(event.date);
        return isThisMonth(eventDate);
      });
    } else if (activeTab === 'upcoming') {
      filtered = filtered.filter(
        event => event.status === 'upcoming' || event.status === 'confirmed'
      );
    }

    // Filter by advisor
    if (selectedAdvisor !== 'tous') {
      filtered = filtered.filter(event =>
        event.advisor.toLowerCase().includes(selectedAdvisor.toLowerCase())
      );
    }

    // Filter by type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(event => selectedTypes.includes(event.type));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.client.toLowerCase().includes(query) || event.title.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(filtered);
  }, [date, selectedAdvisor, selectedTypes, activeTab, searchQuery]);

  // Helper function to parse date strings like "15/04/2025" to Date objects
  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Toggle type filter
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

  // Filter appointments for HistoryView
  const filterHistoricalAppointments = (): HistoricalAppointment[] => {
    let filtered = [...appointments];

    // Apply active tab filters
    if (activeTab === 'today') {
      filtered = filtered.filter(app => {
        const appDate = parseDate(app.date);
        return isToday(appDate);
      });
    } else if (activeTab === 'week') {
      filtered = filtered.filter(app => {
        const appDate = parseDate(app.date);
        return isThisWeek(appDate, { weekStartsOn: 1 });
      });
    } else if (activeTab === 'month') {
      filtered = filtered.filter(app => {
        const appDate = parseDate(app.date);
        return isThisMonth(appDate);
      });
    } else if (activeTab === 'upcoming') {
      filtered = filtered.filter(app => app.status === 'upcoming' || app.status === 'confirmed');
    }

    // Apply advisor filter
    if (selectedAdvisor !== 'tous') {
      filtered = filtered.filter(app =>
        app.advisor.toLowerCase().includes(selectedAdvisor.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(app => selectedTypes.includes(app.type));
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => app.client.toLowerCase().includes(query));
    }

    return filtered;
  };

  // Filter calendarEvents for CalendarView
  const filterCalendarEvents = () => {
    let filtered = [...calendarEvents];

    // Apply advisor filter
    if (selectedAdvisor !== 'tous') {
      filtered = filtered.filter(event =>
        event.advisor.toLowerCase().includes(selectedAdvisor.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(event => selectedTypes.includes(event.type));
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.client.toLowerCase().includes(query) || event.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

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
        {/* Left Sidebar */}
        <AppointmentSidebar
          date={date}
          setDate={setDate}
          selectedAdvisor={selectedAdvisor}
          setSelectedAdvisor={setSelectedAdvisor}
          selectedTypes={selectedTypes}
          toggleTypeFilter={toggleTypeFilter}
        />

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Rechercher un RDV ou un client..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gray-100 rounded-md flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewType === 'list' ? 'bg-white shadow' : ''}
                  onClick={() => setViewType('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewType === 'grid' ? 'bg-white shadow' : ''}
                  onClick={() => setViewType('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewType === 'calendar' ? 'bg-white shadow' : ''}
                  onClick={() => setViewType('calendar')}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewType === 'history' ? 'bg-white shadow' : ''}
                  onClick={() => setViewType('history')}
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
                    Tous les RDV
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="data-[state=active]:text-primary">
                    À venir
                  </TabsTrigger>
                  <TabsTrigger value="today" className="data-[state=active]:text-primary">
                    Aujourd'hui
                  </TabsTrigger>
                  <TabsTrigger value="week" className="data-[state=active]:text-primary">
                    Cette semaine
                  </TabsTrigger>
                  <TabsTrigger value="month" className="data-[state=active]:text-primary">
                    Ce mois
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                {viewType === 'list' ? (
                  <AppointmentList appointments={filteredEvents} />
                ) : viewType === 'grid' ? (
                  <AppointmentGrid appointments={filteredEvents} />
                ) : viewType === 'calendar' ? (
                  <CalendarView date={date} setDate={setDate} events={filterCalendarEvents()} />
                ) : (
                  <HistoryView appointments={filterHistoricalAppointments()} />
                )}
              </TabsContent>

              <TabsContent value="upcoming" className="mt-0">
                {viewType === 'list' ? (
                  <AppointmentList appointments={filteredEvents} />
                ) : viewType === 'grid' ? (
                  <AppointmentGrid appointments={filteredEvents} />
                ) : viewType === 'calendar' ? (
                  <CalendarView date={date} setDate={setDate} events={filterCalendarEvents()} />
                ) : (
                  <HistoryView appointments={filterHistoricalAppointments()} />
                )}
              </TabsContent>

              <TabsContent value="today" className="mt-0">
                {viewType === 'list' ? (
                  <AppointmentList appointments={filteredEvents} />
                ) : viewType === 'grid' ? (
                  <AppointmentGrid appointments={filteredEvents} />
                ) : viewType === 'calendar' ? (
                  <CalendarView date={date} setDate={setDate} events={filterCalendarEvents()} />
                ) : (
                  <HistoryView appointments={filterHistoricalAppointments()} />
                )}
              </TabsContent>

              <TabsContent value="week" className="mt-0">
                {viewType === 'list' ? (
                  <AppointmentList appointments={filteredEvents} />
                ) : viewType === 'grid' ? (
                  <AppointmentGrid appointments={filteredEvents} />
                ) : viewType === 'calendar' ? (
                  <CalendarView date={date} setDate={setDate} events={filterCalendarEvents()} />
                ) : (
                  <HistoryView appointments={filterHistoricalAppointments()} />
                )}
              </TabsContent>

              <TabsContent value="month" className="mt-0">
                {viewType === 'list' ? (
                  <AppointmentList appointments={filteredEvents} />
                ) : viewType === 'grid' ? (
                  <AppointmentGrid appointments={filteredEvents} />
                ) : viewType === 'calendar' ? (
                  <CalendarView date={date} setDate={setDate} events={filterCalendarEvents()} />
                ) : (
                  <HistoryView appointments={filterHistoricalAppointments()} />
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
