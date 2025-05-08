import React from 'react';
import { Eye, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppointmentType, AppointmentStatus, HistoricalAppointment } from './AppointmentTypes';

interface HistoryViewProps {
  appointments: HistoricalAppointment[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ appointments }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rendez-vous complétés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annulations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(a => a.status === 'cancelled').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="completed">Complétés</TabsTrigger>
          <TabsTrigger value="cancelled">Annulés</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <AppointmentHistoryTable appointments={appointments} />
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <AppointmentHistoryTable
            appointments={appointments.filter(appointment => appointment.status === 'completed')}
          />
        </TabsContent>
        <TabsContent value="cancelled" className="mt-6">
          <AppointmentHistoryTable
            appointments={appointments.filter(appointment => appointment.status === 'cancelled')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AppointmentHistoryTableProps {
  appointments: HistoricalAppointment[];
}

const AppointmentHistoryTable: React.FC<AppointmentHistoryTableProps> = ({ appointments }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Horaire</TableHead>
          <TableHead>Conseiller</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map(appointment => (
          <TableRow key={appointment.id}>
            <TableCell className="font-medium">{appointment.client}</TableCell>
            <TableCell>{appointment.date}</TableCell>
            <TableCell>{appointment.time}</TableCell>
            <TableCell>{appointment.advisor}</TableCell>
            <TableCell>
              <div className="flex items-center">
                {appointment.type === 'video' ? (
                  <span>Visioconférence</span>
                ) : appointment.type === 'phone' ? (
                  <span>Téléphone</span>
                ) : (
                  <span>Présentiel</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  appointment.status === 'completed'
                    ? 'outline'
                    : appointment.status === 'rescheduled'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {appointment.status === 'completed'
                  ? 'Terminé'
                  : appointment.status === 'cancelled'
                    ? 'Annulé'
                    : appointment.status === 'rescheduled'
                      ? 'Reporté'
                      : 'À venir'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" /> Voir le détail
                  </DropdownMenuItem>
                  <DropdownMenuItem>Télécharger le compte-rendu</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
