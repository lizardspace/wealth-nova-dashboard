import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PerformanceDataItem {
  month: string;
  global: number;
  immobilier: number;
  placements: number;
  entreprise: number;
}

export const usePerformanceData = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: compteBancaireData, error: compteBancaireError } = await supabase.from('comptebancaire').select('value, date_acquisition');
        if (compteBancaireError) throw compteBancaireError;

        const { data: assuranceVieData, error: assuranceVieError } = await supabase.from('assurancevie').select('value, date_acquisition');
        if (assuranceVieError) throw assuranceVieError;

        const { data: bienImmobilierData, error: bienImmobilierError } = await supabase.from('bienimmobilier').select('value, date_acquisition');
        if (bienImmobilierError) throw bienImmobilierError;

        const { data: entrepriseData, error: entrepriseError } = await supabase.from('entrepriseparticipation').select('value, date_acquisition');
        if (entrepriseError) throw entrepriseError;

        const processData = (data: {value: number, date_acquisition: string}[], type: string) => {
            return data.map(item => ({ ...item, type }));
        };

        const allData = [
            ...processData(compteBancaireData, 'Placements'),
            ...processData(assuranceVieData, 'Placements'),
            ...processData(bienImmobilierData, 'Immobilier'),
            ...processData(entrepriseData, 'Entreprise')
        ];

        const performanceByMonth = allData.reduce((acc, item) => {
            const date = new Date(item.date_acquisition);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const key = `${month} ${year}`;

            if (!acc[key]) {
                acc[key] = { month: key, global: 0, immobilier: 0, placements: 0, entreprise: 0 };
            }

            acc[key].global += item.value;
            if (item.type === 'Immobilier') {
                acc[key].immobilier += item.value;
            } else if (item.type === 'Placements') {
                acc[key].placements += item.value;
            } else if (item.type === 'Entreprise') {
                acc[key].entreprise += item.value;
            }

            return acc;
        }, {});

        setPerformanceData(Object.values(performanceByMonth));
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
