
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DayAppointments } from './DayAppointments';

type AppointmentType = 'video' | 'phone' | 'in-person';

interface AppointmentEvent {
  id: number;
  title: string;
  client: string;
  time: string;
  type: AppointmentType;
  advisor: string;
}

interface CalendarViewProps {
  date: Date;
  setDate: (date: Date) => void;
  events: AppointmentEvent[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ date, setDate, events }) => {
  return (
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
  );
};
