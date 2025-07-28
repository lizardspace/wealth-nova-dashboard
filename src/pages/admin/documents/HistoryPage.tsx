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
import { getTableData, getTableColumns } from "@/lib/supabase";
import { useParams } from "react-router-dom";

export default function HistoryPage() {
  const { tableName } = useParams<{ tableName: string }>();
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tableName) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const tableData = await getTableData(tableName);
        if (tableData) {
          setData(tableData);
        } else {
          setError(`Could not fetch data for table: ${tableName}`);
        }
      } catch (err) {
        setError(`Error fetching data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }

      setLoading(false);
    };

    const fetchColumns = async () => {
      if (!tableName) return;
      
      try {
        const columnNames = await getTableColumns(tableName);
        const generatedColumns: ColumnDef<any>[] = columnNames.map((colName) => ({
          accessorKey: colName,
          header: colName,
          cell: ({ getValue }) => {
            const value = getValue();
            // Gestion des différents types de données
            if (value === null || value === undefined) {
              return <span className="text-gray-400">-</span>;
            }
            if (typeof value === 'object') {
              return <span className="text-xs">{JSON.stringify(value)}</span>;
            }
            if (typeof value === 'boolean') {
              return <span className={value ? 'text-green-600' : 'text-red-600'}>
                {value ? 'Oui' : 'Non'}
              </span>;
            }
            return String(value);
          }
        }));
        setColumns(generatedColumns);
      } catch (err) {
        console.error('Error fetching columns:', err);
      }
    };

    fetchData();
    fetchColumns();
  }, [tableName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-red-800 font-semibold">Erreur</h2>
        <p className="text-red-600">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-2"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Historique - {tableName}</h1>
          <p className="text-gray-600 mt-1">
            {data.length} enregistrement{data.length > 1 ? 's' : ''} trouvé{data.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/documents">
              <Archive className="w-4 h-4 mr-2" />
              Retour aux documents
            </Link>
          </Button>
          
          {data.length > 0 && (
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
          )}
        </div>
      </div>

      {data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <File className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Aucune donnée trouvée</h3>
            <p className="text-gray-500">La table {tableName} ne contient aucun enregistrement.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="w-5 h-5" />
              Données de la table {tableName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={data} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}