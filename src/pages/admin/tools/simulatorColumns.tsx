// src/pages/admin/tools/simulatorColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export type Simulator = {
  id: string;
  name: string;
  category: string;
  lastUpdated: string;
  active: boolean;
};

export const columns: ColumnDef<Simulator>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <Link 
        to={`/admin/outils/simulateurs/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "category",
    header: "Catégorie",
  },
  {
    accessorKey: "lastUpdated",
    header: "Dernière mise à jour",
  },
  {
    accessorKey: "active",
    header: "Statut",
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.getValue("active") ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
        <span className="ml-2">
          {row.getValue("active") ? "Actif" : "Inactif"}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button asChild variant="outline" size="sm">
        <Link to={`/admin/outils/simulateurs/${row.original.id}`}>
          Détails
        </Link>
      </Button>
    ),
  },
];