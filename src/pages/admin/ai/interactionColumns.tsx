
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export type Interaction = {
  id: string;
  client: string;
  type: string;
  date: string;
  status: "Complétée" | "En cours" | "Abandonnée";
  duration: string;
  topics: string[];
  satisfaction?: string; // Optional since we're adding it
};

export const columns: ColumnDef<Interaction>[] = [
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <Link
        to={`/admin/ia/suivi-interactions/${row.original.id}`}
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
    header: "Date",
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
      
      let variant: "default" | "destructive" | "outline" | "secondary";
      
      if (status === "Complétée") {
        variant = "default";
      } else if (status === "Abandonnée") {
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
    accessorKey: "topics",
    header: "Sujets abordés",
    cell: ({ row }) => {
      const topics = row.getValue("topics") as string[];
      
      return (
        <div className="flex flex-wrap gap-1">
          {topics && topics.map((topic, index) => (
            <Badge key={index} variant="outline">{topic}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const interaction = row.original;
      
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link to={`/admin/ia/suivi-interactions/${interaction.id}`}>
              Détails
            </Link>
          </Button>
        </div>
      );
    },
  },
];
