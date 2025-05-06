
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Sliders, Plus, Filter, List, LayoutGrid, ChevronLeft, ChevronRight, Video, Phone, Users, Clock, MapPin, Eye, MoreHorizontal, FileDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { AppointmentGrid } from '@/components/appointments/AppointmentGrid';
import { DayAppointments } from '@/components/appointments/DayAppointments';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define types for our events
type AppointmentType = 'video' | 'phone' | 'in-person';
type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'rescheduled' | 'confirmed' | 'pending';

type Event = {
  id: number;
  title: string;
  client: string;
  time: string;
  type: AppointmentType;
  advisor: string;
  date: string;
  status: AppointmentStatus;
};

// Mock data for events
const events: Event[] = [
  { 
    id: 1, 
    title: "Bilan patrimonial", 
    client: "Jean Dupont", 
    time: "09:00 - 10:00", 
    type: "video",
    advisor: "Marie Lambert",
    date: "15/04/2025",
    status: "upcoming"
  },
  { 
    id: 2, 
    title: "Point mensuel", 
    client: "Sophie Martin", 
    time: "11:30 - 12:15", 
    type: "phone",
    advisor: "Paul Bernard",
    date: "14/04/2025",
    status: "upcoming"
  },
  { 
    id: 3, 
    title: "Signature contrat", 
    client: "Philippe Durand", 
    time: "14:00 - 15:00", 
    type: "in-person",
    advisor: "Marie Lambert",
    date: "12/04/2025",
    status: "cancelled"
  },
  { 
    id: 4, 
    title: "Présentation stratégie", 
    client: "Amélie Petit", 
    time: "16:30 - 17:30", 
    type: "video",
    advisor: "Thomas Richard",
    date: "10/04/2025",
    status: "completed"
  },
  { 
    id: 5, 
    title: "Conseil investissement", 
    client: "Philippe Moreau", 
    time: "11:00 - 12:00", 
    type: "phone",
    advisor: "Paul Bernard",
    date: "08/04/2025",
    status: "rescheduled"
  },
  { 
    id: 6, 
    title: "Révision fiscale", 
    client: "Isabelle Petit", 
    time: "14:30 - 15:30", 
    type: "in-person",
    advisor: "Marie Lambert",
    date: "05/04/2025",
    status: "completed"
  }
];

// Calendar events - similar structure but with different format needs
const calendarEvents = [
  { 
    id: 1, 
    title: "Bilan patrimonial", 
    client: "Jean Dupont", 
    time: "09:00 - 10:00", 
    type: "video" as const,
    advisor: "Marie Lambert"
  },
  { 
    id: 2, 
    title: "Point mensuel", 
    client: "Sophie Martin", 
    time: "11:30 - 12:15", 
    type: "phone" as const,
    advisor: "Paul Bernard"
  },
  { 
    id: 3, 
    title: "Signature contrat", 
    client: "Philippe Durand", 
    time: "14:00 - 15:00", 
    type: "in-person" as const,
    advisor: "Marie Lambert"
  },
  { 
    id: 4, 
    title: "Présentation stratégie", 
    client: "Amélie Petit", 
    time: "16:30 - 17:30", 
    type: "video" as const,
    advisor: "Thomas Richard"
  }
];

// Historical appointments
const appointments = [
  { 
    id: 1, 
    client: "Jean Dupont", 
    date: "15/04/2025", 
    time: "14:00 - 15:00", 
    advisor: "Marie Lambert", 
    type: "video" as const, 
    status: "completed" as const, 
    notes: "Discussion sur la stratégie d'investissement" 
  },
  { 
    id: 2, 
    client: "Sophie Martin", 
    date: "14/04/2025", 
    time: "10:30 - 11:15", 
    advisor: "Paul Bernard", 
    type: "phone" as const, 
    status: "completed" as const, 
    notes: "Point sur l'assurance vie" 
  },
  { 
    id: 3, 
    client: "Michel Lefebvre", 
    date: "12/04/2025", 
    time: "09:00 - 10:00", 
    advisor: "Marie Lambert", 
    type: "in-person" as const, 
    status: "cancelled" as const, 
    notes: "Client indisponible" 
  }
];

export default function PlanningPage(): React.ReactNode {
  const [viewType, setViewType] = useState<"list" | "grid" | "calendar" | "history">("calendar");
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>("tous");
  const [selectedTypes, setSelectedTypes] = useState<AppointmentType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  
  const month = date.toLocaleString('fr', { month: 'long' });
  const year = date.getFullYear();

  // Filtering logic
  React.useEffect(() => {
    let filtered = [...events];
    
    // Filter by date
    filtered = filtered.filter(event => {
      // In a real app, convert date strings to Date objects and compare
      return true; // Placeholder for real date filtering
    });
    
    // Filter by advisor
    if (selectedAdvisor !== "tous") {
      filtered = filtered.filter(event => 
        event.advisor.toLowerCase().includes(selectedAdvisor.toLowerCase())
      );
    }
    
    // Filter by type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(event => 
        selectedTypes.includes(event.type)
      );
    }
    
    setFilteredEvents(filtered);
  }, [date, selectedAdvisor, selectedTypes]);

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

  const weekDays = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 })
  });

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

  // Render day appointments
  const renderDayAppointments = () => (
    <div className="space-y-2">
      {filteredEvents
        .filter(event => event.status === "upcoming" || event.status === "confirmed" || event.status === "pending")
        .map((event) => (
        <div 
          key={event.id} 
          className={`p-4 rounded-md border flex items-center justify-between ${
            event.type === 'video' ? 'hover:bg-blue-50 hover:border-blue-200' : 
            event.type === 'phone' ? 'hover:bg-green-50 hover:border-green-200' : 
            'hover:bg-purple-50 hover:border-purple-200'
          } transition-colors`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              event.type === 'video' ? 'bg-blue-100' : 
              event.type === 'phone' ? 'bg-green-100' : 
              'bg-purple-100'
            }`}>
              {event.type === 'video' ? (
                <Video className={`h-4 w-4 ${event.type === 'video' ? 'text-blue-600' : ''}`} />
              ) : event.type === 'phone' ? (
                <Phone className="h-4 w-4 text-green-600" />
              ) : (
                <Users className="h-4 w-4 text-purple-600" />
              )}
            </div>
            <div>
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-muted-foreground">{event.client}</div>
            </div>
          </div>
          <div className="text-sm text-right">
            <div className="font-medium">{event.time}</div>
            <div className="text-muted-foreground">{event.advisor}</div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render week view
  const renderWeekView = () => (
    <div className="overflow-auto">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day.toString()} className="text-center">
            <div className="text-xs text-muted-foreground mb-1">
              {format(day, 'EEE', { locale: fr })}
            </div>
            <div className={`text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
              isSameDay(day, new Date()) ? 
              'bg-primary text-primary-foreground' : ''
            }`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 min-h-[500px]">
        {weekDays.map((day) => (
          <div key={day.toString()} className="border rounded-md h-full p-1">
            <div className="text-xs font-medium mb-2 text-center">
              {filteredEvents.filter(e => true /* filter by date in real app */).length} évènements
            </div>
            <div className="space-y-1">
              {filteredEvents.filter(e => e.status === "upcoming" || e.status === "confirmed").slice(0, 2).map(event => (
                <div 
                  key={event.id}
                  className={`p-1 rounded-sm text-xs truncate cursor-pointer ${
                    event.type === 'video' ? 'bg-blue-100 border-blue-300 text-blue-800' :
                    event.type === 'phone' ? 'bg-green-100 border-green-300 text-green-800' :
                    event.type === 'in-person' ? 'bg-purple-100 border-purple-300 text-purple-800' : ''
                  }`}
                >
                  <div className="font-medium">{event.time}</div>
                  <div className="truncate">{event.title}</div>
                </div>
              ))}
              {events.length > 2 && (
                <div className="text-xs text-center text-muted-foreground mt-1">
                  +{events.length - 2} autres
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render history view
  const renderHistoryView = (): JSX.Element => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rendez-vous complétés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.filter(a => a.status === "completed").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annulations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.filter(a => a.status === "cancelled").length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="completed">Complétés</TabsTrigger>
          <TabsTrigger value="cancelled">Annulés</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Horaire</TableHead>
                <TableHead>Conseiller</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.client}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.advisor}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {appointment.type === "video" ? (
                        <span>Visioconférence</span>
                      ) : appointment.type === "phone" ? (
                        <span>Téléphone</span>
                      ) : (
                        <span>Présentiel</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        appointment.status === "completed"
                          ? "outline"
                          : appointment.status === "rescheduled"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {appointment.status === "completed"
                        ? "Terminé"
                        : appointment.status === "cancelled"
                        ? "Annulé"
                        : appointment.status === "rescheduled" 
                        ? "Reporté"
                        : "À venir"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> Voir le détail
                        </DropdownMenuItem>
                        <DropdownMenuItem>Télécharger le compte-rendu</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="completed">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Horaire</TableHead>
                <TableHead>Conseiller</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments
                .filter((appointment) => appointment.status === "completed")
                .map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.client}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.advisor}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {appointment.type === "video" ? (
                          <span>Visioconférence</span>
                        ) : appointment.type === "phone" ? (
                          <span>Téléphone</span>
                        ) : (
                          <span>Présentiel</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Terminé</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> Voir le détail
                          </DropdownMenuItem>
                          <DropdownMenuItem>Télécharger le compte-rendu</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="cancelled">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Horaire</TableHead>
                <TableHead>Conseiller</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments
                .filter((appointment) => appointment.status === "cancelled")
                .map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.client}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.advisor}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {appointment.type === "video" ? (
                          <span>Visioconférence</span>
                        ) : appointment.type === "phone" ? (
                          <span>Téléphone</span>
                        ) : (
                          <span>Présentiel</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">Annulé</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> Voir le détail
                          </DropdownMenuItem>
                          <DropdownMenuItem>Télécharger le compte-rendu</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Render calendar day view
  const renderCalendarView = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
        <CardTitle className="flex items-center">
          <span className="font-medium">
            {date.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(date);
              newDate.setDate(date.getDate() - 1);
              setDate(newDate);
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(date);
              newDate.setDate(date.getDate() + 1);
              setDate(newDate);
            }}
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DayAppointments date={date} events={calendarEvents} />
      </CardContent>
    </Card>
  );

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
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-medium capitalize">{month} {year}</span>
                </div>
                <div className="flex">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      const newDate = new Date(date);
                      newDate.setMonth(date.getMonth() - 1);
                      setDate(newDate);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const newDate = new Date(date);
                      newDate.setMonth(date.getMonth() + 1);
                      setDate(newDate);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border pointer-events-auto"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => setDate(new Date())}
              >
                Aujourd'hui
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Conseiller</label>
                <Select 
                  defaultValue="tous" 
                  onValueChange={(value) => setSelectedAdvisor(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un conseiller" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les conseillers</SelectItem>
                    <SelectItem value="Marie Lambert">Marie Lambert</SelectItem>
                    <SelectItem value="Paul Bernard">Paul Bernard</SelectItem>
                    <SelectItem value="Thomas Richard">Thomas Richard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={selectedTypes.includes("video") ? "default" : "outline"} 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => toggleTypeFilter("video")}
                  >
                    Visio
                  </Badge>
                  <Badge 
                    variant={selectedTypes.includes("phone") ? "default" : "outline"} 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => toggleTypeFilter("phone")}
                  >
                    Téléphone
                  </Badge>
                  <Badge 
                    variant={selectedTypes.includes("in-person") ? "default" : "outline"} 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => toggleTypeFilter("in-person")}
                  >
                    Présentiel
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    À venir
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Confirmé
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    Annulé
                  </Badge>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Appliquer les filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Légende</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Visioconférence</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Téléphone</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm">Présentiel</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <span className="text-sm">À confirmer</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Rechercher un RDV ou un client..."
                className="pl-10"
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
            <Tabs defaultValue="all" className="w-full">
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
                {viewType === "list" ? <AppointmentList /> : 
                 viewType === "grid" ? <AppointmentGrid /> : 
                 viewType === "calendar" ? renderCalendarView() :
                 renderHistoryView()}
              </TabsContent>
              <TabsContent value="upcoming" className="mt-0">
                {viewType === "list" ? <AppointmentList /> : 
                 viewType === "grid" ? <AppointmentGrid /> : 
                 viewType === "calendar" ? renderCalendarView() :
                 renderHistoryView()}
              </TabsContent>
              <TabsContent value="today" className="mt-0">
                {viewType === "list" ? <AppointmentList /> : 
                 viewType === "grid" ? <AppointmentGrid /> : 
                 viewType === "calendar" ? renderCalendarView() :
                 renderHistoryView()}
              </TabsContent>
              <TabsContent value="week" className="mt-0">
                {viewType === "list" ? <AppointmentList /> : 
                 viewType === "grid" ? <AppointmentGrid /> : 
                 viewType === "calendar" ? renderCalendarView() :
                 renderHistoryView()}
              </TabsContent>
              <TabsContent value="month" className="mt-0">
                {viewType === "list" ? <AppointmentList /> : 
                 viewType === "grid" ? <AppointmentGrid /> : 
                 viewType === "calendar" ? renderCalendarView() :
                 renderHistoryView()}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
