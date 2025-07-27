import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface EncoursData {
  asset_type: string;
  asset_name: string;
  asset_value: number;
  user_id: string;
}

const EncoursPage: React.FC = () => {
  const [data, setData] = useState<EncoursData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: encoursData, error: encoursError } = await supabase
          .from('encours_view')
          .select('*');

        if (encoursError) {
          throw encoursError;
        }

        setData(encoursData || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Encours</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Type</TableHead>
            <TableHead>Asset Name</TableHead>
            <TableHead>Asset Value</TableHead>
            <TableHead>User ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.asset_type}</TableCell>
              <TableCell>{row.asset_name}</TableCell>
              <TableCell>{row.asset_value}</TableCell>
              <TableCell>{row.user_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EncoursPage;
