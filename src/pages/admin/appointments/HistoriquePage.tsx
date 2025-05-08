import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, MoreHorizontal, FileDown } from 'lucide-react';

type Appointment = {
  id: number;
  client: string;
  date: string;
  time: string;
  advisor: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
};

const appointments: Appointment[] = [
  {
    id: 1,
    client: 'Jean Dupont',
    date: '15/04/2025',
    time: '14:00 - 15:00',
    advisor: 'Marie Lambert',
    type: 'video',
    status: 'completed',
    notes: "Discussion sur la stratégie d'investissement",
  },
  {
    id: 2,
    client: 'Sophie Martin',
    date: '14/04/2025',
    time: '10:30 - 11:15',
    advisor: 'Paul Bernard',
    type: 'phone',
    status: 'completed',
    notes: "Point sur l'assurance vie",
  },
  {
    id: 3,
    client: 'Michel Lefebvre',
    date: '12/04/2025',
    time: '09:00 - 10:00',
    advisor: 'Marie Lambert',
    type: 'in-person',
    status: 'cancelled',
    notes: 'Client indisponible',
  },
  {
    id: 4,
    client: 'Camille Dubois',
    date: '10/04/2025',
    time: '16:00 - 17:00',
    advisor: 'Thomas Richard',
    type: 'video',
    status: 'completed',
    notes: 'Préparation retraite',
  },
  {
    id: 5,
    client: 'Philippe Moreau',
    date: '08/04/2025',
    time: '11:00 - 12:00',
    advisor: 'Paul Bernard',
    type: 'phone',
    status: 'rescheduled',
    notes: 'Reporté au 15/05/2025',
  },
  {
    id: 6,
    client: 'Isabelle Petit',
    date: '05/04/2025',
    time: '14:30 - 15:30',
    advisor: 'Marie Lambert',
    type: 'in-person',
    status: 'completed',
    notes: "Signature du contrat d'assurance",
  },
  {
    id: 7,
    client: 'Laurent Roux',
    date: '03/04/2025',
    time: '09:30 - 10:30',
    advisor: 'Thomas Richard',
    type: 'video',
    status: 'completed',
    notes: 'Explication des options de placement',
  },
  {
    id: 8,
    client: 'Nicole Blanc',
    date: '01/04/2025',
    time: '15:00 - 16:00',
    advisor: 'Paul Bernard',
    type: 'phone',
    status: 'cancelled',
    notes: 'Client malade',
  },
];

const HistoriquePage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historique des rendez-vous</h1>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

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
          <TabsTrigger value="rescheduled">Reportés</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
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
                          : 'Reporté'}
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
        </TabsContent>
        <TabsContent value="completed">
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
              {appointments
                .filter(appointment => appointment.status === 'completed')
                .map(appointment => (
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
                      <Badge variant="outline">Terminé</Badge>
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
        </TabsContent>
        <TabsContent value="cancelled">
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
              {appointments
                .filter(appointment => appointment.status === 'cancelled')
                .map(appointment => (
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
                      <Badge variant="destructive">Annulé</Badge>
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
        </TabsContent>
        <TabsContent value="rescheduled">
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
              {appointments
                .filter(appointment => appointment.status === 'rescheduled')
                .map(appointment => (
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
                      <Badge variant="secondary">Reporté</Badge>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoriquePage;
