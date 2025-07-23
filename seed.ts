import { createClient } from '@supabase/supabase-js';
import { events } from './src/lib/appointment_data';

const supabaseUrl = 'https://kjyylccscmatfsaxohnw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeXlsY2NzY21hdGZzYXhvaG53Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgwNDkyNSwiZXhwIjoyMDYyMzgwOTI1fQ.As03Mu5jkZu_iZvAv8KQ39hhN8t5CiNXDI6JBZaGhVQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const appointments = events.map(event => {
    const { id, time, ...rest } = event;
    const [day, month, year] = rest.date.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    return {
      ...rest,
      date: date.toISOString(),
      start_time: time.split(' - ')[0],
      end_time: time.split(' - ')[1],
    };
  });

  for (const appointment of appointments) {
    const { data, error } = await supabase.from('appointments').insert(appointment);

    if (error) {
      console.error('Error seeding data:', JSON.stringify(error, null, 2));
      return;
    }
  }

  console.log('Successfully seeded data.');
}

seed();
