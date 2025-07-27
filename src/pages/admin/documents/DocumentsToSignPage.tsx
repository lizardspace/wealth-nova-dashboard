
// src/pages/admin/documents/DocumentsToSignPage.tsx
import { FileSignature, Download, Eye, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDocumentsToSign } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { Skeleton } from "@/components/ui/skeleton";

type Document = Database['public']['Views']['documents_to_sign']['Row'];


const columns: ColumnDef<User>[] = [
  {
    accessorKey: "last_name",
    header: "Nom",
  },
  {
    accessorKey: "first_name",
    header: "Prénom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "power",
    header: "Power",
  },
  {
    accessorKey: "civilite",
    header: "Civilité",
  },
  {
    accessorKey: "sending_date",
    header: "Date d'envoi",
    cell: ({ row }) => new Date(row.getValue("sending_date")).toLocaleDateString(),
  },
  {
    accessorKey: "expiration_date",
    header: "Expire le",
    cell: ({ row }) => new Date(row.getValue("expiration_date")).toLocaleDateString(),

  },
  {
    accessorKey: "created_at",
    header: "Créé le",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function DocumentsToSignPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const data = await getDocumentsToSign();
        setDocuments(data);
      } catch (err) {
        setError("Impossible de charger les documents.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Utilisateurs</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button>
            <FileSignature className="mr-2 h-4 w-4" />
            Nouvel utilisateur
          </Button>
        </div>
      </div>

      <div className="max-w-md mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <DataTable columns={columns} data={documents} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
