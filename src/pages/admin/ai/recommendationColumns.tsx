// src/pages/admin/ai/recommendationColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export type Recommendation = {
  id: string;
  client: string;
  recommendation: string;
  date: string;
  status: "En attente" | "Acceptée" | "Rejetée";
};

export const columns: ColumnDef<Recommendation>[] = [
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <Link 
        to={`/admin/ia/recommandations/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("client")}
      </Link>
    ),
  },
  {
    accessorKey: "recommendation",
    header: "Recommandation",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const variant = 
        status === "Acceptée" ? "success" :
        status === "Rejetée" ? "destructive" : "secondary";
      
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];