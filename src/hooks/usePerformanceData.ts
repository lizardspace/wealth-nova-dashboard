import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PerformanceDataItem {
  month: string;
  global: number;
  immobilier: number;
  placements: number;
  entreprise: number;
  benchmark: number;
}

export const usePerformanceData = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const tables = [
          'comptebancaire',
          'assurancevie',
          'bienimmobilier',
          'entrepriseparticipation',
          'autrepatrimoine',
          'contratcapitalisation',
        ];

        const promises = tables.map(table => supabase.from(table).select('value, date_acquisition'));
        const results = await Promise.all(promises);

        const allData = results.flatMap((result, index) => {
          if (result.error) throw result.error;
          const type = tables[index];
          return result.data.map(item => ({ ...item, type }));
        });

        const performanceByMonth = allData.reduce((acc, item) => {
          const date = new Date(item.date_acquisition);
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const key = `${month} ${year}`;

          if (!acc[key]) {
            acc[key] = { month: key, global: 0, immobilier: 0, placements: 0, entreprise: 0, benchmark: 0 };
          }

          acc[key].global += item.value;
          if (item.type === 'bienimmobilier') {
            acc[key].immobilier += item.value;
          } else if (['comptebancaire', 'assurancevie', 'contratcapitalisation'].includes(item.type)) {
            acc[key].placements += item.value;
          } else if (item.type === 'entrepriseparticipation') {
            acc[key].entreprise += item.value;
          }

          return acc;
        }, {});

        const data = Object.values(performanceByMonth).map(item => ({
          ...item,
          benchmark: Math.random() * 10,
        }));

        setPerformanceData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { performanceData, loading, error };
};
