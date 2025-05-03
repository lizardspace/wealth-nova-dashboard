
// src/pages/admin/ai/scoreColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export type ClientScore = {
  id: string;
  client: string;
  score: number;
  variation: number;
  lastUpdate: string;
  status: string;
};

export const columns: ColumnDef<ClientScore>[] = [
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <Link
        to={`/admin/ia/scores/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("client")}
      </Link>
    ),
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const score = parseInt(row.getValue("score") as string);
      
      let color = "text-green-600";
      if (score < 50) {
        color = "text-red-600";
      } else if (score < 70) {
        color = "text-yellow-600";
      }
      
      return <span className={`font-bold ${color}`}>{score}/100</span>;
    },
  },
  {
    accessorKey: "variation",
    header: "Variation",
    cell: ({ row }) => {
      const variation = parseInt(row.getValue("variation") as string);
      
      const color = variation > 0 ? "text-green-600" : 
                    variation < 0 ? "text-red-600" : "text-gray-500";
      
      const prefix = variation > 0 ? "+" : "";
      
      return <span className={`${color}`}>{prefix}{variation}%</span>;
    },
  },
  {
    accessorKey: "lastUpdate",
    header: "Dernière mise à jour",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      let variant: "default" | "destructive" | "outline" | "secondary";
      
      if (status === "Bon") {
        variant = "default";
      } else if (status === "Critique") {
        variant = "destructive";
      } else if (status === "Moyen") {
        variant = "secondary";
      } else {
        variant = "outline";
      }
      
      return (
        <Badge variant={variant}>{status}</Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;
      
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link to={`/admin/ia/scores/${client.id}`}>
              Détails
            </Link>
          </Button>
        </div>
      );
    },
  },
];
