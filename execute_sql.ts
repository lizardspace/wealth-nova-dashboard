import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const executeSql = async (filePath: string) => {
  const sql = fs.readFileSync(path.resolve(__dirname, filePath)).toString();
  const client = new Client({
    connectionString: 'postgresql://postgres.kjyylccscmatfsaxohnw:nabryP-5vukji-qemrys@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
  });

  try {
    await client.connect();
    await client.query(sql);
    console.log('SQL executed successfully');
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await client.end();
  }
};

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a path to the SQL file.');
  process.exit(1);
}

executeSql(filePath);
