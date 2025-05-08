// src/pages/admin/documents/DocumentsToSignPage.tsx
import { FileSignature, Download, Eye, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

type Document = {
  id: string;
  title: string;
  client: string;
  date: string;
  type: string;
  expiryDate: string;
  status: 'waiting' | 'expired' | 'reminded';
};

const documents: Document[] = [
  {
    id: '1',
    title: 'Contrat Assurance Vie',
    client: 'Dupont Jean',
    date: '15/04/2024',
    type: 'Contrat',
    expiryDate: '29/04/2024',
    status: 'waiting',
  },
  {
    id: '2',
    title: 'Mandat de gestion',
    client: 'Martin Sophie',
    date: '10/04/2024',
    type: 'Mandat',
    expiryDate: '24/04/2024',
    status: 'waiting',
  },
  {
    id: '3',
    title: 'Avenant contrat PER',
    client: 'Bernard Pierre',
    date: '01/04/2024',
    type: 'Avenant',
    expiryDate: '15/04/2024',
    status: 'expired',
  },
  {
    id: '4',
    title: 'Souscription SCPI',
    client: 'Petit Marie',
    date: '12/04/2024',
    type: 'Contrat',
    expiryDate: '26/04/2024',
    status: 'reminded',
  },
];

const columns: ColumnDef<Document>[] = [
  {
    accessorKey: 'title',
    header: 'Document',
    cell: ({ row }) => (
      <div>
        <Link
          to={`/admin/documents/detail/${row.original.id}`}
          className="font-medium hover:underline text-primary"
        >
          {row.getValue('title')}
        </Link>
        <p className="text-xs text-muted-foreground">{row.original.type}</p>
      </div>
    ),
  },
  {
    accessorKey: 'client',
    header: 'Client',
  },
  {
    accessorKey: 'date',
    header: "Date d'envoi",
  },
  {
    accessorKey: 'expiryDate',
    header: 'Expire le',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ row }) => {
      const status = row.getValue('status') as Document['status'];
      return (
        <Badge
          variant={
            status === 'waiting' ? 'outline' : status === 'expired' ? 'destructive' : 'secondary'
          }
        >
          {status === 'waiting' ? 'En attente' : status === 'expired' ? 'Expiré' : 'Rappel envoyé'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function DocumentsToSignPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Documents à signer</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button>
            <FileSignature className="mr-2 h-4 w-4" />
            Nouveau document
          </Button>
        </div>
      </div>

      <div className="max-w-md mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un document..." className="pl-8" />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Documents en attente de signature</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={documents} />
        </CardContent>
      </Card>

      <div className="bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-start gap-4">
          <FileSignature className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Rappels automatiques</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Les rappels sont envoyés automatiquement 5 jours avant l'expiration du document puis
              tous les 3 jours. Les documents sont considérés comme expirés après 15 jours sans
              signature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
