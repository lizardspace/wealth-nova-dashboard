// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjyylccscmatfsaxohnw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeXlsY2NzY21hdGZzYXhvaG53Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgwNDkyNSwiZXhwIjoyMDYyMzgwOTI1fQ.As03Mu5jkZu_iZvAv8KQ39hhN8t5CiNXDI6JBZaGhVQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllTables() {
  const { data, error } = await supabase
    .from('pg_catalog.pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');

  if (error) {
    console.error('Error fetching tables:', error);
    return [];
  }

  return data.map(table => table.tablename);
}

export async function getTableColumns(tableName: string) {
  const { data, error } = await supabase
    .from('information_schema.columns')
    .select('column_name')
    .eq('table_name', tableName)
    .eq('table_schema', 'public');

  if (error) {
    console.error(`Error fetching columns for table ${tableName}:`, error);
    return [];
  }

  return data.map(column => column.column_name);
}

export async function getDocumentsToSign() {
  const { data, error } = await supabase
    .from('documents_to_sign')
    .select('*');

  if (error) {
    console.error('Error fetching documents to sign:', error);
    return [];
  }

  return data;
}

export async function getArchivedDocuments() {
  const { data, error } = await supabase
    .from('documents_archive')
    .select('*');

  if (error) {
    console.error('Error fetching archived documents:', error);
    return [];
  }

  return data;
}

export async function getSignedDocuments() {
  const { data, error } = await supabase
    .from('documents_signed')
    .select('*');

  if (error) {
    console.error('Error fetching signed documents:', error);
    return [];
  }

  return data;
}