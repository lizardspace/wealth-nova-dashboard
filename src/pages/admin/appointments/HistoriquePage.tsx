
import React from 'react';
import { Search, Filter, Calendar, Download, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

interface AppointmentHistory {
  id: string;
  client: string;
  date: string;
  type: string;
  advisor: string;
  status: string;
  duration: string;
  summary: string;
}

const appointments: AppointmentHistory[] = [
  {
    id: "1",
    client: "Jean Dupont",
    date: "15/04/2024",
    type: "Visioconférence",
    advisor: "Marie Lambert",
    status: "Effectué",
    duration: "45 min",
    summary: "Oui",
  },
  {
    id: "2",
    client: "Sophie Martin",
    date: "10/04/2024",
    type: "Téléphone",
    advisor: "Paul Bernard",
    status: "Annulé",
    duration: "30 min",
    summary: "Non",
  },
  {
    id: "3",
    client: "Philippe Durand",
    date: "05/04/2024",
    type: "Présentiel",
    advisor: "Marie Lambert",
    status: "Effectué",
    duration: "60 min",
    summary: "Oui",
  },
  {
    id: "4",
    client: "Amélie Petit",
    date: "01/04/2024",
    type: "Visioconférence",
    advisor: "Thomas Richard",
    status: "Reporté",
    duration: "45 min",
    summary: "Non",
  },
  {
    id: "5",
    client: "Michel Leroy",
    date: "25/03/2024",
    type: "Téléphone",
    advisor: "Paul Bernard",
    status: "Effectué",
    duration: "30 min",
    summary: "Oui",
  },
  {
    id: "6",
    client: "Émilie Dubois",
    date: "20/03/2024",
    type: "Présentiel",
    advisor: "Thomas Richard",
    status: "Effectué",
    duration: "60 min",
    summary: "Oui",
  },
];

const columns: ColumnDef<AppointmentHistory>[] = [
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <div>
        <Link
          to={`/admin/clients/${row.original.id}`}
          className="font-medium hover:underline text-primary"
        >
          {row.getValue("client")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge
          variant="outline"
          className={
            type === "Visioconférence" ? "border-blue-500 text-blue-500" :
            type === "Téléphone" ? "border-green-500 text-green-500" :
            "border-purple-500 text-purple-500"
          }
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "advisor",
    header: "Conseiller",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "Effectué" ? "success" :
            status === "Annulé" ? "destructive" :
            "outline"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Durée",
  },
  {
    accessorKey: "summary",
    header: "Compte-rendu",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/admin/rendez-vous/historique/${row.original.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function HistoriquePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Historique des rendez-vous</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Filtre par date
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un rendez-vous..."
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="recent">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="oldest">Plus anciens</SelectItem>
              <SelectItem value="client">Client (A-Z)</SelectItem>
              <SelectItem value="advisor">Conseiller (A-Z)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tous les rendez-vous passés</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={appointments} />
        </CardContent>
      </Card>

      <div className="bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-start gap-4">
          <Calendar className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Gestion des archives</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Les rendez-vous de plus de 24 mois sont automatiquement archivés et peuvent être consultés dans ce tableau.
              Pour des requêtes spécifiques sur d'anciennes données, contactez le support technique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
