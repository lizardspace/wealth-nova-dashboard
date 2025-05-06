
import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentType } from './AppointmentTypes';

interface AppointmentSidebarProps {
  date: Date;
  setDate: (date: Date) => void;
  selectedAdvisor: string;
  setSelectedAdvisor: (advisor: string) => void;
  selectedTypes: AppointmentType[];
  toggleTypeFilter: (type: AppointmentType) => void;
}

export const AppointmentSidebar: React.FC<AppointmentSidebarProps> = ({
  date,
  setDate,
  selectedAdvisor,
  setSelectedAdvisor,
  selectedTypes,
  toggleTypeFilter
}) => {
  const month = date.toLocaleString('fr', { month: 'long' });
  const year = date.getFullYear();
  
  const handleCalendarSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  return (
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
            onSelect={handleCalendarSelect}
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
              value={selectedAdvisor} 
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
  );
};
