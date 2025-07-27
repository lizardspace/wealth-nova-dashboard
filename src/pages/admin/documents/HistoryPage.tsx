
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
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

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

      const tableData = await getTableData(tableName);
      if (tableData) {
        setData(tableData);
      } else {
        setError(`Could not fetch data for table: ${tableName}`);
      }

      setLoading(false);
    };

    const fetchColumns = async () => {
      if (!tableName) return;
      const columnNames = await getTableColumns(tableName);
      const generatedColumns = columnNames.map((colName) => ({
        accessorKey: colName,
        header: colName,
      }));
      setColumns(generatedColumns);
    };

    fetchData();
    fetchColumns();
  }, [tableName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">History for {tableName}</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
