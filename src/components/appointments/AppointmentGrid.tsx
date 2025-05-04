
import React from 'react';
import { Video, Users, Phone, Eye, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const appointments = [
  { 
    id: 1, 
    client: "Jean Dupont", 
    date: "20/05/2025", 
    time: "09:00 - 10:00", 
    type: "video", 
    status: "confirmed", 
    advisor: "Marie Lambert"
  },
  { 
    id: 2, 
    client: "Sophie Martin", 
    date: "20/05/2025", 
    time: "11:30 - 12:15", 
    type: "phone", 
    status: "pending", 
    advisor: "Paul Bernard"
  },
  { 
    id: 3, 
    client: "Philippe Durand", 
    date: "21/05/2025", 
    time: "14:00 - 15:00", 
    type: "in-person", 
    status: "confirmed", 
    advisor: "Marie Lambert"
  },
  { 
    id: 4, 
    client: "Amélie Petit", 
    date: "22/05/2025", 
    time: "16:30 - 17:30", 
    type: "video", 
    status: "confirmed", 
    advisor: "Thomas Richard"
  },
  { 
    id: 5, 
    client: "Michel Leroy", 
    date: "23/05/2025", 
    time: "10:00 - 11:00", 
    type: "phone", 
    status: "pending", 
    advisor: "Paul Bernard"
  },
  { 
    id: 6, 
    client: "Émilie Dubois", 
    date: "24/05/2025", 
    time: "14:00 - 15:30", 
    type: "in-person", 
    status: "confirmed", 
    advisor: "Thomas Richard"
  },
];

export function AppointmentGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`h-1 w-full ${
              appointment.type === "video" ? "bg-blue-500" : 
              appointment.type === "phone" ? "bg-green-500" : "bg-purple-500"
            }`}></div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Link 
                  to={`/admin/clients/${appointment.id}`}
                  className="font-medium text-lg hover:underline text-primary"
                >
                  {appointment.client}
                </Link>
                <Badge variant={appointment.status === "confirmed" ? "outline" : "secondary"}>
                  {appointment.status === "confirmed" ? "Confirmé" : "À confirmer"}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{appointment.date} • {appointment.time}</span>
                </div>
                <div className="flex items-center text-sm">
                  {appointment.type === "video" ? (
                    <Video className="h-4 w-4 mr-2 text-blue-500" />
                  ) : appointment.type === "phone" ? (
                    <Phone className="h-4 w-4 mr-2 text-green-500" />
                  ) : (
                    <Users className="h-4 w-4 mr-2 text-purple-500" />
                  )}
                  <span>
                    {appointment.type === "video" ? "Visioconférence" : 
                     appointment.type === "phone" ? "Téléphone" : "Présentiel"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Conseiller: {appointment.advisor}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/admin/rendez-vous/${appointment.id}`}>
                    <Eye className="mr-1 h-4 w-4" />
                    Détails
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
