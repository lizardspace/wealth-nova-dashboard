import React from 'react';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Video, Clock, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type AppointmentType = 'video' | 'phone' | 'in-person';

interface AppointmentEvent {
  id: number;
  title: string;
  client: string;
  time: string;
  type: AppointmentType;
  advisor: string;
}

interface DayAppointmentsProps {
  date: Date;
  events: AppointmentEvent[];
}

export const DayAppointments: React.FC<DayAppointmentsProps> = ({ date, events }) => {
  const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8:00 to 17:00
  const filteredEvents = events.filter(event => {
    return true; // In a real app, filter by date
  });

  const getTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'in-person':
        return <Users className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: AppointmentType) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'phone':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'in-person':
        return 'bg-purple-100 border-purple-300 text-purple-800';
    }
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Only show current time line for today
    if (!isSameDay(now, date)) return null;

    // Position from top is based on time (8:00 = 0)
    const startHour = 8;
    const minutesSinceStart = totalMinutes - startHour * 60;
    const position = minutesSinceStart * (80 / 60); // Each hour is 80px height

    return position;
  };

  const currentTimePosition = getCurrentTimePosition();

  return (
    <div className="relative min-h-[800px]">
      {/* Time column */}
      <div className="absolute left-0 top-0 w-16 h-full text-center">
        {hours.map(hour => (
          <div key={hour} className="h-20 border-b border-dashed border-gray-200 relative">
            <span className="absolute -top-2.5 left-0 text-xs text-gray-500 w-full text-center">
              {`${hour}:00`}
            </span>
          </div>
        ))}
      </div>

      {/* Current time indicator */}
      {currentTimePosition !== null && (
        <div
          className="absolute left-16 right-0 border-t-2 border-red-500 z-10"
          style={{ top: `${currentTimePosition}px` }}
        >
          <div className="absolute -left-3 -top-1.5 w-3 h-3 rounded-full bg-red-500"></div>
        </div>
      )}

      {/* Events */}
      <div className="ml-16 relative">
        {filteredEvents.map(event => {
          // For demo, we'll position events statically
          // In a real app, calculate position based on time
          const [startHour, startMinute] = event.time.split(' - ')[0].split(':').map(Number);

          // Calculate top position based on start time
          const startTime = startHour * 60 + startMinute;
          const topPosition = ((startTime - 8 * 60) / 60) * 80; // 80px per hour

          // In a real app, calculate duration from actual event times
          // Here we'll use fixed height for demo
          const height = 80; // 1 hour event

          return (
            <Card
              key={event.id}
              className={`absolute p-2 rounded-md border shadow-sm w-[calc(100%-8px)] cursor-pointer ${getTypeColor(event.type)}`}
              style={{
                top: `${topPosition}px`,
                height: `${height}px`,
                left: '4px',
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between text-sm font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 opacity-70" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1">{getTypeIcon(event.type)}</div>
                </div>
                <div className="font-medium mt-1">{event.title}</div>
                <div className="text-xs mt-auto flex justify-between">
                  <span>{event.client}</span>
                  <span className="opacity-75">{event.advisor}</span>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Hour grid */}
        {hours.map(hour => (
          <div key={hour} className="h-20 border-b border-dashed border-gray-200"></div>
        ))}
      </div>
    </div>
  );
};
