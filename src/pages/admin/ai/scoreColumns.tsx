
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export type ClientScore = {
  id: string;
  client: string;
  score: number;
  lastUpdate: string;
  evolution: string;
  riskProfile: string;
  variation: string;
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
  },
  {
    accessorKey: "lastUpdate",
    header: "Dernière mise à jour",
  },
  {
    accessorKey: "evolution",
    header: "Évolution",
  },
  {
    accessorKey: "riskProfile",
    header: "Profil de risque",
  },
];
