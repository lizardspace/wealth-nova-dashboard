// src/pages/admin/settings/rolesColumns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Actif' | 'Inactif';
  lastLogin: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
    cell: ({ row }) => (
      <Link
        to={`/admin/parametres/roles/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue('name')}
      </Link>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Rôle',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      let variant: 'default' | 'destructive' | 'outline' | 'secondary';

      if (status === 'Actif') {
        variant = 'default';
      } else {
        variant = 'destructive';
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'lastLogin',
    header: 'Dernière connexion',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/admin/parametres/roles/${user.id}`}>Modifier</Link>
          </Button>
          <Button variant="ghost" size="sm">
            {user.status === 'Actif' ? 'Désactiver' : 'Activer'}
          </Button>
        </div>
      );
    },
  },
];
