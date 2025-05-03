
// src/pages/admin/settings/accessLogColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type AccessLog = {
  id: string;
  userName: string;
  ipAddress: string;
  timestamp: string;
  action: "Connexion" | "Déconnexion" | "Modification" | "Export";
  status: "Réussi" | "Échec";
  device: string;
};

export const accessLogColumns: ColumnDef<AccessLog>[] = [
  {
    accessorKey: "userName",
    header: "Utilisateur",
  },
  {
    accessorKey: "ipAddress",
    header: "Adresse IP",
  },
  {
    accessorKey: "timestamp",
    header: "Date & Heure",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      
      let variant: "default" | "destructive";
      
      if (status === "Réussi") {
        variant = "default";
      } else {
        variant = "destructive";
      }
      
      return (
        <Badge variant={variant}>{status}</Badge>
      );
    },
  },
  {
    accessorKey: "device",
    header: "Appareil",
  },
];
