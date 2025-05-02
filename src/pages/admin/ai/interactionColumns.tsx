// src/pages/admin/ai/interactionColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export type Interaction = {
  id: string;
  client: string;
  type: string;
  date: string;
  duration: string;
  satisfaction: string;
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
    header: "Date et heure",
  },
  {
    accessorKey: "duration",
    header: "Durée",
  },
  {
    accessorKey: "satisfaction",
    header: "Satisfaction",
    cell: ({ row }) => {
      const satisfaction = row.getValue("satisfaction");
      const rating = parseInt(satisfaction.toString().split("/")[0]);
      
      return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
            />
          ))}
          <span className="ml-2">{satisfaction}</span>
        </div>
      );
    },
  },
];