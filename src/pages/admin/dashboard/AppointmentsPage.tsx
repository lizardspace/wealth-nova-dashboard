
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

// Mock data for events
const events = [
  { 
    id: 1, 
    title: "Bilan patrimonial", 
    client: "Jean Dupont", 
    time: "09:00 - 10:00", 
    type: "video" as const,
    advisor: "Marie Lambert",
    date: "15/04/2025",
    status: "upcoming" as const
  },
  { 
    id: 2, 
    title: "Point mensuel", 
    client: "Sophie Martin", 
    time: "11:30 - 12:15", 
    type: "phone" as const,
    advisor: "Paul Bernard",
    date: "14/04/2025",
    status: "upcoming" as const
  },
  { 
    id: 3, 
    title: "Signature contrat", 
    client: "Philippe Durand", 
    time: "14:00 - 15:00", 
    type: "in-person" as const,
    advisor: "Marie Lambert",
    date: "12/04/2025",
    status: "cancelled" as const
  },
  { 
    id: 4, 
    title: "Présentation stratégie", 
    client: "Amélie Petit", 
    time: "16:30 - 17:30", 
    type: "video" as const,
    advisor: "Thomas Richard",
    date: "10/04/2025",
    status: "completed" as const
  },
  { 
    id: 5, 
    title: "Conseil investissement", 
    client: "Philippe Moreau", 
    time: "11:00 - 12:00", 
    type: "phone" as const,
    advisor: "Paul Bernard",
    date: "08/04/2025",
    status: "rescheduled" as const
  },
  { 
    id: 6, 
    title: "Révision fiscale", 
    client: "Isabelle Petit", 
    time: "14:30 - 15:30", 
    type: "in-person" as const,
    advisor: "Marie Lambert",
    date: "05/04/2025",
    status: "completed" as const
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

export default function AppointmentsPage() {
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
                    'bg-purple-100 border-purple-300 text-purple-800'
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
  const renderHistoryView = () => (
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
                        : "Reporté"}
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Rendez-vous</h1>
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
      
      <Tabs value={viewType} onValueChange={(v) => setViewType(v as any)} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Calendrier</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-1">
            <List className="h-4 w-4" />
            <span>Planning</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Historique</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Calendar View */}
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
            {/* Left Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-primary" />
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
                  <CalendarComponent
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
                    <Select defaultValue="tous">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un conseiller" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les conseillers</SelectItem>
                        <SelectItem value="marie">Marie Lambert</SelectItem>
                        <SelectItem value="paul">Paul Bernard</SelectItem>
                        <SelectItem value="thomas">Thomas Richard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        Visio
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        Téléphone
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        Présentiel
                      </Badge>
                    </div>
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
                  <div>
                    <Tabs 
                      value={view} 
                      onValueChange={(v) => setView(v as 'day' | 'week')} 
                      className="mr-auto"
                    >
                      <TabsList>
                        <TabsTrigger value="day">Jour</TabsTrigger>
                        <TabsTrigger value="week">Semaine</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <CardTitle className="mt-4">
                      <span className="font-medium">
                        {view === 'day' ? 
                          format(date, 'EEEE d MMMM yyyy', { locale: fr }) : 
                          `${format(weekDays[0], 'd MMMM', { locale: fr })} - ${format(weekDays[6], 'd MMMM yyyy', { locale: fr })}`
                        }
                      </span>
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousDate}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Précédent
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setDate(new Date())}
                    >
                      Aujourd'hui
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleNextDate}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {view === 'day' ? renderDayAppointments() : renderWeekView()}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* List View */}
        <TabsContent value="list">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
            {/* Left Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Filtres</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Conseiller</label>
                    <Select defaultValue="tous">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un conseiller" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les conseillers</SelectItem>
                        <SelectItem value="dupont">Marie Dupont</SelectItem>
                        <SelectItem value="martin">Jean Martin</SelectItem>
                        <SelectItem value="bernard">Sophie Bernard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        Visio
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        Téléphone
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
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
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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

                  <TabsContent value="all" className="mt-0 p-4">
                    <div className="grid gap-4">
                      {events.map((event) => (
                        <Card key={event.id} className="overflow-hidden">
                          <div className={`h-1 ${
                            event.type === 'video' ? 'bg-blue-500' :
                            event.type === 'phone' ? 'bg-green-500' : 'bg-purple-500'
                          }`} />
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{event.title}</h3>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  {event.date}
                                  <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                                  {event.time}
                                </div>
                                <div className="flex items-center mt-2">
                                  <div className="flex items-center mr-4">
                                    {event.type === 'video' ? (
                                      <Video className="h-3.5 w-3.5 mr-1 text-blue-500" />
                                    ) : event.type === 'phone' ? (
                                      <Phone className="h-3.5 w-3.5 mr-1 text-green-500" />
                                    ) : (
                                      <MapPin className="h-3.5 w-3.5 mr-1 text-purple-500" />
                                    )}
                                    <span className="text-xs">
                                      {event.type === 'video' ? 'Visioconférence' :
                                        event.type === 'phone' ? 'Téléphone' : 'Présentiel'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-right">
                                <Badge variant={
                                  event.status === 'upcoming' ? 'default' :
                                  event.status === 'completed' ? 'outline' :
                                  event.status === 'cancelled' ? 'destructive' : 'secondary'
                                }>
                                  {event.status === 'upcoming' ? 'À venir' :
                                    event.status === 'completed' ? 'Terminé' :
                                    event.status === 'cancelled' ? 'Annulé' : 'Reporté'}
                                </Badge>
                                <div className="font-medium mt-2">{event.client}</div>
                                <div className="text-xs text-muted-foreground">{event.advisor}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upcoming" className="mt-0 p-4">
                    <div className="grid gap-4">
                      {events
                        .filter(event => event.status === "upcoming")
                        .map((event) => (
                          <Card key={event.id} className="overflow-hidden">
                            <div className={`h-1 ${
                              event.type === 'video' ? 'bg-blue-500' :
                              event.type === 'phone' ? 'bg-green-500' : 'bg-purple-500'
                            }`} />
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{event.title}</h3>
                                  <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    {event.date}
                                    <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
                                    {event.time}
                                  </div>
                                  <div className="flex items-center mt-2">
                                    <div className="flex items-center mr-4">
                                      {event.type === 'video' ? (
                                        <Video className="h-3.5 w-3.5 mr-1 text-blue-500" />
                                      ) : event.type === 'phone' ? (
                                        <Phone className="h-3.5 w-3.5 mr-1 text-green-500" />
                                      ) : (
                                        <MapPin className="h-3.5 w-3.5 mr-1 text-purple-500" />
                                      )}
                                      <span className="text-xs">
                                        {event.type === 'video' ? 'Visioconférence' :
                                          event.type === 'phone' ? 'Téléphone' : 'Présentiel'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm text-right">
                                  <Badge>À venir</Badge>
                                  <div className="font-medium mt-2">{event.client}</div>
                                  <div className="text-xs text-muted-foreground">{event.advisor}</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="today" className="mt-0 p-4">
                    <div className="text-center py-8 text-muted-foreground">
                      Pas de rendez-vous aujourd'hui
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* History View */}
        <TabsContent value="history">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
          {renderHistoryView()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
