import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Video,
  Users,
  Phone,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
} from 'lucide-react';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { DayAppointments } from '@/components/appointments/DayAppointments';
import AppointmentModal from '@/components/appointments/AppointmentModal';

const events = [
  {
    id: 1,
    title: 'Bilan patrimonial',
    client: 'Jean Dupont',
    time: '09:00 - 10:00',
    type: 'video' as const,
    advisor: 'Marie Lambert',
  },
  {
    id: 2,
    title: 'Point mensuel',
    client: 'Sophie Martin',
    time: '11:30 - 12:15',
    type: 'phone' as const,
    advisor: 'Paul Bernard',
  },
  {
    id: 3,
    title: 'Signature contrat',
    client: 'Philippe Durand',
    time: '14:00 - 15:00',
    type: 'in-person' as const,
    advisor: 'Marie Lambert',
  },
  {
    id: 4,
    title: 'Présentation stratégie',
    client: 'Amélie Petit',
    time: '16:30 - 17:30',
    type: 'video' as const,
    advisor: 'Thomas Richard',
  },
];

export default function AgendaPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const month = date.toLocaleString('fr', { month: 'long' });
  const year = date.getFullYear();

  const handlePreviousDate = () => {
    if (view === 'day') {
      setDate(subDays(date, 1));
    } else if (view === 'week') {
      setDate(subDays(date, 7));
    } else {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() - 1);
      setDate(newDate);
    }
  };

  const handleNextDate = () => {
    if (view === 'day') {
      setDate(addDays(date, 1));
    } else if (view === 'week') {
      setDate(addDays(date, 7));
    } else {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + 1);
      setDate(newDate);
    }
  };

  const handleSaveAppointment = (data: any) => {
    console.log('Nouveau rendez-vous:', data);
    // In a real app, this would save to database and update the UI
  };

  const weekDays = eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agenda des rendez-vous</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button onClick={() => setIsAppointmentModalOpen(true)}>
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
                  <span className="font-medium capitalize">
                    {month} {year}
                  </span>
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
                onSelect={newDate => newDate && setDate(newDate)}
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
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    Visio
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    Téléphone
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    Présentiel
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-300 cursor-pointer">
                    Validé
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 cursor-pointer">
                    En attente
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 border-red-300 cursor-pointer">
                    Relance
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
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2 pt-6">
              <div className="flex flex-wrap items-center justify-between">
                <Tabs
                  value={view}
                  onValueChange={v => setView(v as 'day' | 'week' | 'month')}
                  className="mr-auto"
                >
                  <TabsList>
                    <TabsTrigger value="day">Jour</TabsTrigger>
                    <TabsTrigger value="week">Semaine</TabsTrigger>
                    <TabsTrigger value="month">Mois</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center space-x-4 mt-2 lg:mt-0">
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" onClick={handlePreviousDate}>
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mx-2"
                      onClick={() => setDate(new Date())}
                    >
                      Aujourd'hui
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleNextDate}>
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>

              <h2 className="font-medium text-lg mt-4">
                {view === 'day' && format(date, 'EEEE d MMMM yyyy', { locale: fr })}
                {view === 'week' &&
                  `${format(weekDays[0], 'd MMMM', { locale: fr })} - ${format(weekDays[6], 'd MMMM yyyy', { locale: fr })}`}
                {view === 'month' && format(date, 'MMMM yyyy', { locale: fr })}
              </h2>
            </CardHeader>

            <CardContent>
              {view === 'day' && <DayAppointments date={date} events={events} />}

              {view === 'week' && (
                <div className="overflow-auto">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(day => (
                      <div key={day.toString()} className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">
                          {format(day, 'EEE', { locale: fr })}
                        </div>
                        <div
                          className={`text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center mx-auto ${
                            day.toDateString() === new Date().toDateString()
                              ? 'bg-primary text-primary-foreground'
                              : ''
                          }`}
                        >
                          {format(day, 'd')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 min-h-[500px]">
                    {weekDays.map(day => (
                      <div key={day.toString()} className="border rounded-md h-full p-1">
                        <div className="text-xs font-medium mb-2 text-center">
                          {events.filter(e => true /* filter by date in real app */).length}{' '}
                          évènements
                        </div>
                        <div className="space-y-1">
                          {events
                            .filter(e => true /* filter by date in real app */)
                            .slice(0, 2)
                            .map(event => (
                              <div
                                key={event.id}
                                className={`p-1 rounded-sm text-xs truncate cursor-pointer ${
                                  event.type === 'video'
                                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                                    : event.type === 'phone'
                                      ? 'bg-green-100 border-green-300 text-green-800'
                                      : 'bg-purple-100 border-purple-300 text-purple-800'
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
              )}

              {view === 'month' && (
                <div className="min-h-[500px]">
                  <AppointmentList />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSave={handleSaveAppointment}
      />
    </div>
  );
}
