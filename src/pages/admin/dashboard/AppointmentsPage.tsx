import React, { useState } from 'react';
import { 
  Calendar, 
  Video, 
  Users, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter,
  List,
  LayoutGrid, 
  MapPin,
  Clock,
  FileDown,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
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
type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';

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

type Appointment = {
  id: number;
  client: string;
  date: string;
  time: string;
  advisor: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
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

// Historical appointments
const appointments: Appointment[] = [
  { 
    id: 1, 
    client: "Jean Dupont", 
    date: "15/04/2025", 
    time: "14:00 - 15:00", 
    advisor: "Marie Lambert", 
    type: "video", 
    status: "completed", 
    notes: "Discussion sur la stratégie d'investissement" 
  },
  { 
    id: 2, 
    client: "Sophie Martin", 
    date: "14/04/2025", 
    time: "10:30 - 11:15", 
    advisor: "Paul Bernard", 
    type: "phone", 
    status: "completed", 
    notes: "Point sur l'assurance vie" 
  },
  { 
    id: 3, 
    client: "Michel Lefebvre", 
    date: "12/04/2025", 
    time: "09:00 - 10:00", 
    advisor: "Marie Lambert", 
    type: "in-person", 
    status: "cancelled", 
    notes: "Client indisponible" 
  }
];

const AppointmentsPage = (): React.ReactNode => {
  const [viewType, setViewType] = useState<"list" | "grid" | "calendar" | "history">("calendar");
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  
  const month = date.toLocaleString('fr', { month: 'long' });
  const year = date.getFullYear();

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

  // Render day appointments
  const renderDayAppointments = () => (
    <div className="space-y-2">
      {events
        .filter(event => event.status === "upcoming")
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
              day.toDateString() === new Date().toDateString() ? 
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
              {events.filter(e => true /* filter by date in real app */).length} évènements
            </div>
            <div className="space-y-1">
              {events.filter(e => e.status === "upcoming").slice(0, 2).map(event => (
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
  
  // Main component return with proper explicit JSX.Element return type
  return (
    <div className="space-y-6">
      {viewType === "calendar" && (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button onClick={handlePreviousDate} className="p-2 rounded-md hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-lg font-medium">{month} {year}</div>
              <button onClick={handleNextDate} className="p-2 rounded-md hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setViewType("list")} className="p-2 rounded-md hover:bg-gray-100">
                <List className="h-4 w-4" />
              </button>
              <button onClick={() => setViewType("grid")} className="p-2 rounded-md hover:bg-gray-100">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewType("history")} className="p-2 rounded-md hover:bg-gray-100">
                <Calendar className="h-4 w-4" />
              </button>
            </div>
          </div>
          {renderDayAppointments()}
        </div>
      )}
      {viewType === "list" && (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button onClick={handlePreviousDate} className="p-2 rounded-md hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-lg font-medium">{month} {year}</div>
              <button onClick={handleNextDate} className="p-2 rounded-md hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setViewType("calendar")} className="p-2 rounded-md hover:bg-gray-100">
                <Calendar className="h-4 w-4" />
              </button>
              <button onClick={() => setViewType("grid")} className="p-2 rounded-md hover:bg-gray-100">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewType("history")} className="p-2 rounded-md hover:bg-gray-100">
                <Calendar className="h-4 w-4" />
              </button>
            </div>
          </div>
          {renderDayAppointments()}
        </div>
      )}
      {viewType === "grid" && (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button onClick={handlePreviousDate} className="p-2 rounded-md hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-lg font-medium">{month} {year}</div>
              <button onClick={handleNextDate} className="p-2 rounded-md hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setViewType("calendar")} className="p-2 rounded-md hover:bg-gray-100">
                <Calendar className="h-4 w-4" />
              </button>
              <button onClick={() => setViewType("list")} className="p-2 rounded-md hover:bg-gray-100">
                <List className="h-4 w-4" />
              </button>
              <button onClick={() => setViewType("history")} className="p-2 rounded-md hover:bg-gray-100">
                <Calendar className="h-4 w-4" />
              </button>
            </div>
          </div>
          {renderWeekView()}
        </div>
      )}
      {viewType === "history" && renderHistoryView()}
    </div>
  );
};

export default AppointmentsPage;
