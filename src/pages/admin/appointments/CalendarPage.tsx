
import React, { useState } from 'react';
import { Calendar, Video, Users, Phone, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DayAppointments } from '@/components/appointments/DayAppointments';

const events = [
  { 
    id: 1, 
    title: "Bilan patrimonial", 
    client: "Jean Dupont", 
    time: "09:00 - 10:00", 
    type: "video",
    advisor: "Marie Lambert"
  },
  { 
    id: 2, 
    title: "Point mensuel", 
    client: "Sophie Martin", 
    time: "11:30 - 12:15", 
    type: "phone",
    advisor: "Paul Bernard"
  },
  { 
    id: 3, 
    title: "Signature contrat", 
    client: "Philippe Durand", 
    time: "14:00 - 15:00", 
    type: "in-person",
    advisor: "Marie Lambert"
  },
  { 
    id: 4, 
    title: "Présentation stratégie", 
    client: "Amélie Petit", 
    time: "16:30 - 17:30", 
    type: "video",
    advisor: "Thomas Richard"
  }
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const month = date.toLocaleString('fr', { month: 'long' });
  const year = date.getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Calendrier des rendez-vous</h1>
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
              <DayAppointments date={date} events={events} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
