// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xoxbpdkqvtulavbpfmgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGJwZGtxdnR1bGF2YnBmbWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0MjMsImV4cCI6MjA2MDMyNTQyM30.XVzmmTfjcMNDchCd7ed-jG3N8WoLuD3RyDZguyZh1EM';

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

export async function getInactiveClients() {
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, first_name, last_name, email');

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return [];
  }

  const clients = await Promise.all(
    users.map(async (user) => {
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('date')
        .eq('client', user.id)
        .order('date', { ascending: false })
        .limit(1);

      if (appointmentsError) {
        console.error(`Error fetching appointments for user ${user.id}:`, appointmentsError);
      }

      const { data: alerts, error: alertsError } = await supabase
        .from('alerts')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (alertsError) {
        console.error(`Error fetching alerts for user ${user.id}:`, alertsError);
      }

      const lastAppointmentDate = appointments?.[0]?.date ? new Date(appointments[0].date) : null;
      const lastAlertDate = alerts?.[0]?.created_at ? new Date(alerts[0].created_at) : null;

      let lastContactDate = null;
      if (lastAppointmentDate && lastAlertDate) {
        lastContactDate = lastAppointmentDate > lastAlertDate ? lastAppointmentDate : lastAlertDate;
      } else {
        lastContactDate = lastAppointmentDate || lastAlertDate;
      }

      const { data: personalinfo, error: personalinfoError } = await supabase
        .from('personalinfo')
        .select('phone')
        .eq('user_id', user.id)
        .single();

      if (personalinfoError) {
        console.error(`Error fetching personal info for user ${user.id}:`, personalinfoError);
      }

      const tablesToSum = [
        'assurancevie',
        'autrepatrimoine',
        'bienimmobilier',
        'comptebancaire',
        'contratcapitalisation',
        'entrepriseparticipation',
      ];

      let portfolio = 0;
      for (const table of tablesToSum) {
        const { data, error } = await supabase
          .from(table)
          .select('value')
          .eq('user_id', user.id);

        if (error) {
          console.error(`Error fetching portfolio from ${table} for user ${user.id}:`, error);
        } else if (data) {
          portfolio += data.reduce((acc, item) => acc + (item.value || 0), 0);
        }
      }

      const inactiveDays = lastContactDate
        ? Math.floor((new Date().getTime() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24))
        : Infinity;

      let status: 'critical' | 'warning' | 'notice' = 'notice';
      if (inactiveDays > 180) {
        status = 'critical';
      } else if (inactiveDays > 90) {
        status = 'warning';
      }

      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: personalinfo?.phone || 'N/A',
        lastContact: lastContactDate ? lastContactDate.toLocaleDateString('fr-FR') : 'N/A',
        inactiveDays,
        portfolio,
        status,
      };
    })
  );

  return clients.filter((client) => client.inactiveDays > 60);
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