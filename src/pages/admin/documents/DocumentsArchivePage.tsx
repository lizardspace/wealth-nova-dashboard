// src/pages/admin/documents/DocumentsArchivePage.tsx
import { Archive, Search, Download, File, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ArchivedDocument = {
  id: string;
  title: string;
  client: string;
  type: string;
  archiveDate: string;
  originalDate: string;
  category: 'contrats' | 'mandats' | 'avenants' | 'resiliations';
};

const documents: ArchivedDocument[] = [
  {
    id: '1',
    title: 'Contrat Assurance Vie - XYZ',
    client: 'Dupont Jean',
    type: 'Contrat',
    archiveDate: '15/12/2023',
    originalDate: '15/03/2020',
    category: 'contrats',
  },
  {
    id: '2',
    title: 'Mandat de gestion - Anciennes dispositions',
    client: 'Martin Sophie',
    type: 'Mandat',
    archiveDate: '10/11/2023',
    originalDate: '10/05/2019',
    category: 'mandats',
  },
  {
    id: '3',
    title: 'Avenant contrat PER - Version initiale',
    client: 'Bernard Pierre',
    type: 'Avenant',
    archiveDate: '20/10/2023',
    originalDate: '20/07/2021',
    category: 'avenants',
  },
  {
    id: '4',
    title: 'Résiliation assurance habitation',
    client: 'Petit Marie',
    type: 'Résiliation',
    archiveDate: '05/01/2024',
    originalDate: '05/01/2023',
    category: 'resiliations',
  },
];

const columns: ColumnDef<ArchivedDocument>[] = [
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
    accessorKey: 'originalDate',
    header: 'Date de création',
  },
  {
    accessorKey: 'archiveDate',
    header: "Date d'archivage",
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <File className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function DocumentsArchivePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Archives documentaires</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button>Exporter</Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher dans les archives..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="contract">Contrats</SelectItem>
              <SelectItem value="mandate">Mandats</SelectItem>
              <SelectItem value="amendment">Avenants</SelectItem>
              <SelectItem value="termination">Résiliations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="contrats">
        <TabsList>
          <TabsTrigger value="contrats">Contrats</TabsTrigger>
          <TabsTrigger value="mandats">Mandats</TabsTrigger>
          <TabsTrigger value="avenants">Avenants</TabsTrigger>
          <TabsTrigger value="resiliations">Résiliations</TabsTrigger>
        </TabsList>

        <TabsContent value="contrats" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Contrats archivés</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={documents.filter(doc => doc.category === 'contrats')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mandats" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Mandats archivés</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={documents.filter(doc => doc.category === 'mandats')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avenants" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Avenants archivés</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={documents.filter(doc => doc.category === 'avenants')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resiliations" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Résiliations archivées</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={documents.filter(doc => doc.category === 'resiliations')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-start gap-4">
          <Archive className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Politique d'archivage</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Les documents sont automatiquement archivés après leur expiration ou leur
              remplacement. Ils restent accessibles pendant 10 ans après leur archivage pour des
              raisons légales et de conformité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
