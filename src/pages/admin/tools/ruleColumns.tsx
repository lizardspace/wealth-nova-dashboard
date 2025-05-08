// src/pages/admin/tools/ruleColumns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

export type Rule = {
  id: string;
  name: string;
  condition: string;
  target: string;
};

export const columns: ColumnDef<Rule>[] = [
  {
    accessorKey: 'name',
    header: 'Nom de la règle',
  },
  {
    accessorKey: 'condition',
    header: 'Condition',
    cell: ({ row }) => (
      <code className="bg-muted px-2 py-1 rounded-md text-sm">{row.getValue('condition')}</code>
    ),
  },
  {
    accessorKey: 'target',
    header: 'Cible',
    cell: ({ row }) => (
      <code className="bg-muted px-2 py-1 rounded-md text-sm">{row.getValue('target')}</code>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="space-x-2">
        <Button variant="outline" size="sm">
          Modifier
        </Button>
        <Button variant="destructive" size="sm">
          Supprimer
        </Button>
      </div>
    ),
  },
];
