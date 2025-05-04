
import React from 'react';
import { Eye, Video, Users, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
];

export function AppointmentList() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Horaire</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Conseiller</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <Link to={`/admin/clients/${appointment.id}`} className="font-medium text-primary hover:underline">
                  {appointment.client}
                </Link>
              </TableCell>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {appointment.type === "video" ? (
                    <>
                      <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                      <span>Visio</span>
                    </>
                  ) : appointment.type === "phone" ? (
                    <>
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                      <span>Téléphone</span>
                    </>
                  ) : (
                    <>
                      <div className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
                      <span>Présentiel</span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell>{appointment.advisor}</TableCell>
              <TableCell>
                <Badge
                  variant={appointment.status === "confirmed" ? "outline" : "secondary"}
                >
                  {appointment.status === "confirmed" ? "Confirmé" : "À confirmer"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/admin/rendez-vous/${appointment.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
