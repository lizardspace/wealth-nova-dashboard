// src/pages/admin/tools/productColumns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export type Product = {
  id: string;
  name: string;
  category: string;
  provider: string;
  status: string;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
    cell: ({ row }) => (
      <Link
        to={`/admin/outils/produits/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue('name')}
      </Link>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Catégorie',
  },
  {
    accessorKey: 'provider',
    header: 'Fournisseur',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => (
      <div className="flex items-center">
        {row.getValue('status') === 'active' ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
        <span className="ml-2">{row.getValue('status') === 'active' ? 'Actif' : 'Inactif'}</span>
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button asChild variant="outline" size="sm">
        <Link to={`/admin/outils/produits/${row.original.id}`}>Détails</Link>
      </Button>
    ),
  },
];
