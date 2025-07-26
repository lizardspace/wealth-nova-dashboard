
// src/pages/admin/documents/DocumentsArchivePage.tsx
import { Archive, Search, Download, File, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { getArchivedDocuments } from "@/lib/supabase";

type ArchivedDocument = {
  id: string;
  document_name: string;
  client_name: string;
  document_type: string;
  archiving_date: string;
  creation_date: string;
  category: "contrats" | "mandats" | "avenants" | "resiliations";
};

const columns: ColumnDef<ArchivedDocument>[] = [
  {
    accessorKey: "document_name",
    header: "Document",
    cell: ({ row }) => (
      <div>
        <Link
          to={`/admin/documents/detail/${row.original.id}`}
          className="font-medium hover:underline text-primary"
        >
          {row.getValue("document_name")}
        </Link>
        <p className="text-xs text-muted-foreground">
          {row.original.document_type}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "client_name",
    header: "Client",
  },
  {
    accessorKey: "creation_date",
    header: "Date de création",
  },
  {
    accessorKey: "archiving_date",
    header: "Date d'archivage",
  },
  {
    id: "actions",
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
  const [documents, setDocuments] = useState<ArchivedDocument[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const data = await getArchivedDocuments();
      setDocuments(data);
    };

    fetchDocuments();
  }, []);

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
          <Input
            placeholder="Rechercher dans les archives..."
            className="pl-8"
          />
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
                data={documents.filter(doc => doc.category === "contrats")} 
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
                data={documents.filter(doc => doc.category === "mandats")} 
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
                data={documents.filter(doc => doc.category === "avenants")} 
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
                data={documents.filter(doc => doc.category === "resiliations")} 
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
              Les documents sont automatiquement archivés après leur expiration ou leur remplacement.
              Ils restent accessibles pendant 10 ans après leur archivage pour des raisons légales et de conformité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
