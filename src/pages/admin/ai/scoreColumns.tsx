import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

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
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => (
      <Link
        to={`/admin/ia/scores/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue('client')}
      </Link>
    ),
  },
  {
    accessorKey: 'score',
    header: 'Score',
  },
  {
    accessorKey: 'lastUpdate',
    header: 'Dernière mise à jour',
  },
  {
    accessorKey: 'evolution',
    header: 'Évolution',
    cell: ({ row }) => {
      const evolution = row.getValue('evolution') as string;
      const value = parseInt(evolution);
      return (
        <div className="flex items-center">
          {value > 0 ? (
            <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
          ) : value < 0 ? (
            <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
          ) : (
            <Minus className="mr-2 h-4 w-4 text-gray-500" />
          )}
          {evolution}
        </div>
      );
    },
  },
  {
    accessorKey: 'riskProfile',
    header: 'Profil de risque',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'stable' ? 'outline' : status === 'declining' ? 'destructive' : 'default'
          }
        >
          {status === 'stable' ? 'Stable' : status === 'declining' ? 'En baisse' : 'En hausse'}
        </Badge>
      );
    },
  },
];
