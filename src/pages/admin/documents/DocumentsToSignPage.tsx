
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
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  last_name: string;
  first_name: string;
  power: number;
  email: string;
  created_at: string;
  civilite: "M." | "Mme" | "Mlle";
  date_naissance: string;
  part_fiscale: number;
};

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
    accessorKey: "date_naissance",
    header: "Date de naissance",
  },
  {
    accessorKey: "part_fiscale",
    header: "Part fiscale",
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
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
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
          <DataTable columns={columns} data={users} />
        </CardContent>
      </Card>
    </div>
  );
}
