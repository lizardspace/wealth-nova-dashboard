
import React from 'react';
import { Video, Users, Phone, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Event {
  id: number;
  title: string;
  client: string;
  time: string;
  type: string;
  advisor: string;
}

interface DayAppointmentsProps {
  date: Date;
  events: Event[];
}

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export function DayAppointments({ date, events }: DayAppointmentsProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Function to get events for a specific time slot
  const getEventsForTimeSlot = (timeSlot: string) => {
    return events.filter(event => {
      const startTime = event.time.split(' - ')[0];
      return startTime === timeSlot;
    });
  };

  return (
    <div className="space-y-1">
      {timeSlots.map((timeSlot) => {
        const slotEvents = getEventsForTimeSlot(timeSlot);
        
        return (
          <div key={timeSlot} className="grid grid-cols-[80px_1fr] gap-2">
            <div className="text-sm font-medium text-muted-foreground py-4 text-right pr-4 border-r">
              {timeSlot}
            </div>
            <div className="py-2 pl-2">
              {slotEvents.length > 0 ? (
                <div className="space-y-2">
                  {slotEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={`rounded-md p-3 border ${
                        event.type === "video" ? "border-l-4 border-l-blue-500" : 
                        event.type === "phone" ? "border-l-4 border-l-green-500" : 
                        "border-l-4 border-l-purple-500"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <Link 
                            to={`/admin/clients/${event.id}`}
                            className="text-primary text-sm hover:underline"
                          >
                            {event.client}
                          </Link>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {event.type === "video" ? (
                            <Video className="h-4 w-4 text-blue-500" />
                          ) : event.type === "phone" ? (
                            <Phone className="h-4 w-4 text-green-500" />
                          ) : (
                            <Users className="h-4 w-4 text-purple-500" />
                          )}
                          <div className="ml-2 text-xs text-muted-foreground">
                            {event.advisor}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/rendez-vous/${event.id}`}>
                            Détails
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-12 border border-dashed rounded-md flex items-center justify-center text-sm text-muted-foreground">
                  Aucun rendez-vous
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
