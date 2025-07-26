
// src/pages/admin/alertes/InactiveClientsPage.tsx
import { UserX, Search, Clock, Calendar, Mail, Phone, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInactiveClients } from "@/lib/supabase";
import { useEffect, useState } from "react";

type InactiveClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastContact: string;
  inactiveDays: number;
  portfolio: number;
  status: "critical" | "warning" | "notice";
};


const columns: ColumnDef<InactiveClient>[] = [
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => (
      <div>
        <Link
          to={`/admin/clients/${row.original.id}`}
          className="font-medium hover:underline text-primary"
        >
          {row.getValue("name")}
        </Link>
        <p className="text-xs text-muted-foreground">
          ID: {row.original.id}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "lastContact",
    header: "Dernier contact",
  },
  {
    accessorKey: "inactiveDays",
    header: "Jours d'inactivité",
    cell: ({ row }) => {
      const days = row.getValue("inactiveDays") as number;
      return (
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{days} jours</span>
        </div>
      );
    },
  },
  {
    accessorKey: "portfolio",
    header: "Encours",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("portfolio"));
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as InactiveClient["status"];
      return (
        <Badge
          variant={
            status === "critical"
              ? "destructive"
              : status === "warning"
              ? "default"
              : "outline"
          }
        >
          {status === "critical"
            ? "Critique"
            : status === "warning"
            ? "Attention"
            : "À surveiller"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Mail className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Calendar className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function InactiveClientsPage() {
  const [clients, setClients] = useState<InactiveClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const inactiveClients = await getInactiveClients();
        setClients(inactiveClients);
        setError(null);
      } catch (err) {
        setError("Failed to fetch inactive clients.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients inactifs</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Campagne d'email
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client inactif..."
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
              <SelectItem value="warning">Attention</SelectItem>
              <SelectItem value="notice">À surveiller</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Inactivité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes durées</SelectItem>
              <SelectItem value="90">+90 jours</SelectItem>
              <SelectItem value="120">+120 jours</SelectItem>
              <SelectItem value="180">+180 jours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Clients critiques</CardTitle>
            <CardDescription>Inactifs +180 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {clients.filter((c) => c.status === "critical").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Clients à risque</CardTitle>
            <CardDescription>Inactifs 90-180 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">
              {clients.filter((c) => c.status === "warning").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">À surveiller</CardTitle>
            <CardDescription>Inactifs 60-90 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {clients.filter((c) => c.status === "notice").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des clients inactifs</CardTitle>
          <CardDescription>
            Clients n'ayant eu aucune interaction depuis plus de 60 jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={clients} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Total: {clients.length} clients inactifs
          </p>
          <Button variant="outline">Exporter la liste</Button>
        </CardFooter>
      </Card>

      <div className="bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-start gap-4">
          <UserX className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Suivi des clients inactifs</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Les clients sont considérés comme inactifs après 60 jours sans interaction (visite du portail, email, appel, rendez-vous).
              Des rappels automatiques peuvent être configurés pour les clients critiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
