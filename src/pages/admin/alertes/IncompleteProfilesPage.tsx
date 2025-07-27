
// src/pages/admin/alertes/IncompleteProfilesPage.tsx
import { useEffect, useState } from "react";
import { FileText, Search, CheckSquare, X, Filter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase, getUserPortfolio } from "@/lib/supabase";
import { User, PersonalInfo, IncompleteProfile } from "@/lib/database.types";
import { calculateCompletion, determinePriority } from "@/lib/profileUtils";

const columns: ColumnDef<IncompleteProfile>[] = [
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
          Mis à jour: {row.original.lastUpdate}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "completionRate",
    header: "Complétion",
    cell: ({ row }) => {
      const completion = row.getValue("completionRate") as number;
      return (
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs">{completion}%</span>
          </div>
          <Progress value={completion} className="h-2" />
        </div>
      );
    },
  },
  {
    accessorKey: "missingFields",
    header: "Champs manquants",
    cell: ({ row }) => {
      const missingFields = row.original.missingFields;
      return (
        <div className="flex flex-wrap gap-1">
          {missingFields.map((field, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {field}
            </Badge>
          ))}
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
    accessorKey: "priority",
    header: "Priorité",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as IncompleteProfile["priority"];
      return (
        <Badge
          variant={
            priority === "high"
              ? "destructive"
              : priority === "medium"
              ? "default"
              : "outline"
          }
        >
          {priority === "high"
            ? "Élevée"
            : priority === "medium"
            ? "Moyenne"
            : "Basse"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm">
          <Mail className="mr-2 h-4 w-4" />
          Relancer
        </Button>
        <Button variant="ghost" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Éditer
        </Button>
      </div>
    ),
  },
];

export default function IncompleteProfilesPage() {
  const [clients, setClients] = useState<IncompleteProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncompleteProfiles = async () => {
      try {
        setLoading(true);
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select(`
            *,
            personalinfo:personalinfo(*)
          `);

        if (usersError) throw usersError;

        const processedProfiles = await Promise.all(users.map(async (user) => {
          const personalInfo = Array.isArray(user.personalinfo) ? user.personalinfo[0] : user.personalinfo;
          const { completionRate, missingFields } = calculateCompletion(user, personalInfo);
          const portfolio = await getUserPortfolio(user.id);
          const priority = determinePriority(completionRate, portfolio);

          return {
            id: user.id,
            name: `${user.first_name || ''} ${user.last_name || ''}`,
            email: user.email || '',
            completionRate,
            missingFields,
            portfolio,
            priority,
            lastUpdate: new Date(user.created_at).toLocaleDateString(),
          };
        }));

        setClients(processedProfiles);

      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncompleteProfiles();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profils incomplets</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Campagne de complétion
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes priorités</SelectItem>
              <SelectItem value="high">Élevée</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Complétion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous niveaux</SelectItem>
              <SelectItem value="low">Moins de 60%</SelectItem>
              <SelectItem value="medium">60% à 80%</SelectItem>
              <SelectItem value="high">Plus de 80%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Critiques</CardTitle>
              <CheckSquare className="h-5 w-5 text-red-500" />
            </div>
            <CardDescription>Moins de 60% complétés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {clients.filter((c) => c.completionRate < 60).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">À améliorer</CardTitle>
              <CheckSquare className="h-5 w-5 text-amber-500" />
            </div>
            <CardDescription>60% à 80% complétés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">
              {clients.filter((c) => c.completionRate >= 60 && c.completionRate <= 80).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Presque terminés</CardTitle>
              <CheckSquare className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>Plus de 80% complétés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">
              {clients.filter((c) => c.completionRate > 80).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profils clients incomplets</CardTitle>
          <CardDescription>
            Clients avec des informations manquantes dans leur profil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement...</p>
          ) : error ? (
            <p>Erreur: {error}</p>
          ) : (
            <DataTable columns={columns} data={clients} />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Total: {clients.length} profils incomplets
          </p>
          <Button variant="outline">Exporter la liste</Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Champs les plus souvent manquants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Objectifs patrimoniaux</span>
                  <span className="text-sm text-muted-foreground">68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Horizon d'investissement</span>
                  <span className="text-sm text-muted-foreground">52%</span>
                </div>
                <Progress value={52} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Tolérance au risque</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Capacité d'épargne</span>
                  <span className="text-sm text-muted-foreground">40%</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Raisons de l'incomplétude</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <X className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium">Abandon du formulaire</h3>
                  <p className="text-sm text-muted-foreground">
                    45% des clients abandonnent le formulaire avant de l'avoir terminé.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-amber-100">
                  <X className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-medium">Questions complexes</h3>
                  <p className="text-sm text-muted-foreground">
                    30% des clients ne comprennent pas certaines questions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <X className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Manque de temps</h3>
                  <p className="text-sm text-muted-foreground">
                    25% des clients déclarent manquer de temps pour terminer.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
