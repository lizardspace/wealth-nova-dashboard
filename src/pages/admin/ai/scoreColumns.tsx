
// src/pages/admin/ai/scoreColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export type ClientScore = {
  id: string;
  client: string;
  score: number;
  lastUpdate: string;
  evolution: string;
  riskProfile: string;
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
    header: "Score IA",
    cell: ({ row }) => {
      const score = Number(row.getValue("score"));
      let color = "bg-amber-500";
      
      if (score >= 80) color = "bg-emerald-500";
      else if (score >= 60) color = "bg-blue-500";
      else if (score < 40) color = "bg-red-500";
      
      return (
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${color}`}></div>
          <span className="font-medium">{score}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastUpdate",
    header: "Mise à jour",
  },
  {
    accessorKey: "evolution",
    header: "Évolution",
    cell: ({ row }) => {
      const evolution = row.getValue("evolution") as string;
      const isPositive = evolution.startsWith("+");
      
      return (
        <span className={`font-medium ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
          {evolution}
        </span>
      );
    },
  },
  {
    accessorKey: "riskProfile",
    header: "Profil de risque",
    cell: ({ row }) => {
      const profile = row.getValue("riskProfile") as string;
      const variant = 
        profile === "Dynamique" ? "default" :
        profile === "Équilibré" ? "secondary" :
        profile === "Prudent" ? "outline" : "secondary";
      
      return <Badge variant={variant}>{profile}</Badge>;
    },
  },
];
