import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';
import { supabase } from '../../../lib/supabase';
import DatabaseTablePage from './DatabaseTablePage';

const DatabaseExplorerPage: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.rpc('get_all_tables');

        if (error) throw error;
        setTables(data.map((t: any) => t.table_name));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  const filteredTables = tables.filter(table =>
    table.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  if (selectedTable) {
    return <DatabaseTablePage tableName={selectedTable} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Database Explorer
      </Typography>
      <TextField
        fullWidth
        label="Search Tables"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Paper>
        <List>
          {filteredTables.map((table) => (
            <ListItem button key={table} onClick={() => setSelectedTable(table)}>
              <ListItemText primary={table} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default DatabaseExplorerPage;
