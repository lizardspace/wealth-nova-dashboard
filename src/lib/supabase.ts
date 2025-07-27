// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjyylccscmatfsaxohnw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeXlsY2NzY21hdGZzYXhvaG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDQ5MjUsImV4cCI6MjA2MjM4MDkyNX0.lvg4xofslDZHuSANjN4gHWW4BQPjqripZln8mHxom44';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllTables() {
  const { data, error } = await supabase.rpc('get_all_tables');

  if (error) {
    console.error('Error fetching tables:', error);
    return [];
  }

  return data.map(table => table.table_name);
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

export async function getTableData(tableName: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*');

  if (error) {
    console.error(`Error fetching data from table ${tableName}:`, error);
    return null;
  }

  return data;
}

export async function createAllContactsView() {
  const { error } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE OR REPLACE VIEW all_contacts AS
      SELECT
        id,
        name,
        email,
        message,
        created_at,
        is_processed
      FROM
        public.contacts;
    `,
  });

  if (error) {
    console.error('Error creating view:', error);
  }
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

export async function getUserPortfolio(userId: string): Promise<number> {
  const assetTables = [
    'assurancevie',
    'autrepatrimoine',
    'bienimmobilier',
    'comptebancaire',
    'contratcapitalisation',
    'entrepriseparticipation',
  ];

  let totalPortfolio = 0;

  for (const table of assetTables) {
    const { data, error } = await supabase
      .from(table)
      .select('value')
      .eq('user_id', userId);

    if (error) {
      console.error(`Error fetching portfolio from ${table}:`, error);
      continue;
    }

    if (data) {
      const sum = data.reduce((acc, item) => acc + (item.value || 0), 0);
      totalPortfolio += sum;
    }
  }

  return totalPortfolio;
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
