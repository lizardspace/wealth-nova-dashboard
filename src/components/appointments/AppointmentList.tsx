import React from 'react';
import { Eye, Video, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { Event } from './AppointmentTypes';

interface AppointmentListProps {
  appointments: Event[];
}

export function AppointmentList({ appointments = [] }: AppointmentListProps) {
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
          {appointments.length > 0 ? (
            appointments.map(appointment => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <Link
                    to={`/admin/clients/${appointment.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {appointment.client}
                  </Link>
                </TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {appointment.type === 'video' ? (
                      <>
                        <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                        <span>Visio</span>
                      </>
                    ) : appointment.type === 'phone' ? (
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
                    variant={
                      appointment.status === 'confirmed' || appointment.status === 'upcoming'
                        ? 'outline'
                        : appointment.status === 'cancelled'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {appointment.status === 'confirmed' || appointment.status === 'upcoming'
                      ? 'Confirmé'
                      : appointment.status === 'cancelled'
                        ? 'Annulé'
                        : appointment.status === 'completed'
                          ? 'Terminé'
                          : 'À confirmer'}
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                Aucun rendez-vous trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
