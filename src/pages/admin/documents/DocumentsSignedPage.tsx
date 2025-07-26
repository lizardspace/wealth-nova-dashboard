
// src/pages/admin/documents/DocumentsSignedPage.tsx
import { FileCheck, Search, Download, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getSignedDocuments } from "@/lib/supabase";

type SignedDocument = {
  id: string;
  document_name: string;
  client_name: string;
  document_type: string;
  signature_date: string;
  signed_by: string;
  signature_method: "Électronique" | "Manuscrite" | "Certification";
};

const columns: ColumnDef<SignedDocument>[] = [
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
    accessorKey: "signature_date",
    header: "Date de signature",
  },
  {
    accessorKey: "signed_by",
    header: "Signataire",
  },
  {
    accessorKey: "signature_method",
    header: "Méthode",
    cell: ({ row }) => {
      const method = row.getValue("signature_method") as SignedDocument["signature_method"];
      return (
        <Badge
          variant={
            method === "Électronique"
              ? "default"
              : method === "Manuscrite"
              ? "outline"
              : "secondary"
          }
        >
          {method}
        </Badge>
      );
    },
  },
  {
    id: "actions",
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

export default function DocumentsSignedPage() {
  const [documents, setDocuments] = useState<SignedDocument[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const data = await getSignedDocuments();
      setDocuments(data);
    };

    fetchDocuments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Documents signés</h1>
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
            placeholder="Rechercher un document..."
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type de document" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="contract">Contrats</SelectItem>
              <SelectItem value="mandate">Mandats</SelectItem>
              <SelectItem value="amendment">Avenants</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Méthode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="electronic">Électronique</SelectItem>
              <SelectItem value="handwritten">Manuscrite</SelectItem>
              <SelectItem value="certified">Certification</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Documents signés</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={documents} />
        </CardContent>
      </Card>

      <div className="bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-start gap-4">
          <FileCheck className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="font-medium">Conservation légale</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Les documents signés sont conservés de manière sécurisée pendant une durée légale de 10 ans.
              Pour les contrats d'assurance vie, la durée est prolongée à 30 ans après la fin du contrat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
