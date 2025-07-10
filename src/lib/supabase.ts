// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjyylccscmatfsaxohnw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeXlsY2NzY21hdGZzYXhvaG53Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgwNDkyNSwiZXhwIjoyMDYyMzgwOTI1fQ.As03Mu5jkZu_iZvAv8KQ39hhN8t5CiNXDI6JBZaGhVQ';

export const supabase = createClient(supabaseUrl, supabaseKey);