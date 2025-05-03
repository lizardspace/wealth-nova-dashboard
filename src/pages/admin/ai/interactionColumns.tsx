
// src/pages/admin/ai/interactionColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, Download } from "lucide-react";

export type Interaction = {
  id: string;
  client: string;
  type: string;
  date: string;
  duration: string;
  status: string;
  topics: string[];
  satisfaction: string;
};

export const columns: ColumnDef<Interaction>[] = [
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <Link
        to={`/admin/clients/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("client")}
      </Link>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "date",
    header: "Date et heure",
  },
  {
    accessorKey: "duration",
    header: "Durée",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge 
          variant={status === "Complétée" ? "success" : 
                 status === "Abandonnée" ? "destructive" : "outline"}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "topics",
    header: "Sujets abordés",
    cell: ({ row }) => {
      const topics = row.getValue("topics") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {topics.map((topic, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "satisfaction",
    header: "Satisfaction",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/admin/ia/suivi-interactions/${row.original.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
