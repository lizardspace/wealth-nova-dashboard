import { supabase } from './src/lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

const executeSql = async () => {
  const sql = fs.readFileSync(path.resolve(__dirname, 'performance_view.sql')).toString();

  const { error } = await supabase.rpc('sql', { sql });

  if (error) {
    console.error('Error executing SQL:', error);
    return;
  }

  console.log('SQL executed successfully');
};

executeSql();
