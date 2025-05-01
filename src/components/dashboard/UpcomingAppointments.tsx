
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Video, Phone, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const appointments = [
  {
    id: 1,
    title: 'Bilan patrimonial',
    date: '15 mai 2025',
    time: '14:30',
    type: 'video',
    advisor: 'Marc Dupont'
  },
  {
    id: 2,
    title: 'Consultation investissement',
    date: '28 mai 2025',
    time: '10:00',
    type: 'phone',
    advisor: 'Julie Martin'
  }
];

const UpcomingAppointments = () => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-eparnova-blue" />
          Prochains rendez-vous
        </CardTitle>
        <CardDescription>
          Vos consultations à venir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground text-sm">
                Aucun rendez-vous programmé
              </p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="p-3 border rounded-md hover:bg-muted/40 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{appointment.title}</h4>
                    <div className="text-sm text-muted-foreground mt-1">
                      {appointment.date} à {appointment.time}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      avec {appointment.advisor}
                    </div>
                  </div>
                  <div className={`p-2 rounded-full ${
                    appointment.type === 'video' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {appointment.type === 'video' ? (
                      <Video className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Phone className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-eparnova-blue hover:bg-eparnova-blue-light/90" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Prendre rendez-vous
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingAppointments;
