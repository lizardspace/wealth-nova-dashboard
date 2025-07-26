// src/pages/admin/ai/recommendationColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Database } from "@/lib/database.types";

export type Recommendation = Database['public']['Tables']['ia_recommendations']['Row'];

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
    accessorKey: "description",
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
      const status = row.getValue("status") as string;
      
      let variant: "default" | "destructive" | "outline" | "secondary";
      
      if (status === "Acceptée") {
        variant = "default";
      } else if (status === "Rejetée") {
        variant = "destructive";
      } else {
        variant = "secondary";
      }
      
      return (
        <Badge variant={variant}>{status}</Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const recommendation = row.original;
      
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link to={`/admin/ia/recommandations/${recommendation.id}`}>
              Détails
            </Link>
          </Button>
        </div>
      );
    },
  },
];
