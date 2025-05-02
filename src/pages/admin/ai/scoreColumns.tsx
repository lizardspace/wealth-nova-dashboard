// src/pages/admin/ai/scoreColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

export type Score = {
  id: string;
  client: string;
  score: number;
  lastUpdate: string;
  evolution: string;
  riskProfile: string;
};

export const columns: ColumnDef<Score>[] = [
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
    cell: ({ row }) => (
      <div className="flex items-center">
        <span className="font-bold">{row.getValue("score")}/100</span>
      </div>
    ),
  },
  {
    accessorKey: "evolution",
    header: "Évolution",
    cell: ({ row }) => {
      const evolution = row.getValue("evolution");
      const isPositive = evolution.toString().startsWith("+");
      
      return (
        <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? (
            <ArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" />
          )}
          {evolution}
        </div>
      );
    },
  },
  {
    accessorKey: "riskProfile",
    header: "Profil de risque",
  },
  {
    accessorKey: "lastUpdate",
    header: "Dernière mise à jour",
  },
];