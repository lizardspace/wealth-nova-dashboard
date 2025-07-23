import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PortfolioData {
  encoursTotalData: any[];
  repartitionActifs: any[];
  clientsEncoursData: any[];
  loading: boolean;
  error: any;
}

const useGlobalPortfolioData = (): PortfolioData => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<Omit<PortfolioData, 'loading' | 'error'>>({
    encoursTotalData: [],
    repartitionActifs: [],
    clientsEncoursData: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const { data: users, error: usersError } = await supabase.from('users').select('id, first_name, last_name');
        if (usersError) throw usersError;

        // Fetch assets for all users
        const [
          { data: immobilier, error: immoError },
          { data: assuranceVie, error: avError },
          { data: comptes, error: comptesError },
          { data: contrats, error: contratsError },
          { data: entreprises, error: entreprisesError },
          { data: credits, error: creditsError },
        ] = await Promise.all([
          supabase.from('bienimmobilier').select('user_id, value'),
          supabase.from('assurancevie').select('user_id, value'),
          supabase.from('comptebancaire').select('user_id, value'),
          supabase.from('contratcapitalisation').select('user_id, value'),
          supabase.from('entrepriseparticipation').select('user_id, value'),
          supabase.from('credit').select('user_id, capital_restant_du'),
        ]);

        if (immoError || avError || comptesError || contratsError || entreprisesError || creditsError) {
          throw new Error('Failed to fetch assets');
        }

        // Process data
        const encoursReelByUser = users.reduce((acc, user) => {
          const totalAssets = [
            ...immobilier.filter(i => i.user_id === user.id),
            ...assuranceVie.filter(a => a.user_id === user.id),
            ...comptes.filter(c => c.user_id === user.id),
            ...contrats.filter(c => c.user_id === user.id),
            ...entreprises.filter(e => e.user_id === user.id)
          ].reduce((sum, asset) => sum + (asset.value || 0), 0);

          const totalCredits = credits
            .filter(c => c.user_id === user.id)
            .reduce((sum, credit) => sum + (credit.capital_restant_du || 0), 0);

          acc[user.id] = totalAssets - totalCredits;
          return acc;
        }, {});

        const clientsEncoursData = users.map(user => ({
          id: user.id,
          nom: user.last_name,
          prenom: user.first_name,
          encoursReel: encoursReelByUser[user.id] || 0,
          encoursTheorique: (encoursReelByUser[user.id] || 0) * (1 + Math.random()), // Placeholder for theorique
          tauxConversion: 0, // Placeholder
        })).sort((a, b) => b.encoursReel - a.encoursReel).slice(0, 5);

        clientsEncoursData.forEach(client => {
          client.tauxConversion = client.encoursTheorique > 0 ? parseFloat(((client.encoursReel / client.encoursTheorique) * 100).toFixed(1)) : 0;
        });

        const totalImmobilier = immobilier.reduce((sum, item) => sum + item.value, 0);
        const totalAssuranceVie = assuranceVie.reduce((sum, item) => sum + item.value, 0);
        const totalComptes = comptes.reduce((sum, item) => sum + item.value, 0);
        const totalContrats = contrats.reduce((sum, item) => sum + item.value, 0);
        const totalEntreprises = entreprises.reduce((sum, item) => sum + item.value, 0);

        const totalActifs = totalImmobilier + totalAssuranceVie + totalComptes + totalContrats + totalEntreprises;

        const repartitionActifs = [
          { name: 'Immobilier', value: totalImmobilier / totalActifs * 100 },
          { name: 'Assurance vie', value: totalAssuranceVie / totalActifs * 100 },
          { name: 'Liquidités', value: totalComptes / totalActifs * 100 },
          { name: 'PER', value: totalContrats / totalActifs * 100 },
          { name: 'Actions', value: totalEntreprises / totalActifs * 100 },
        ];

        setData({
          encoursTotalData: [], // Placeholder for historical data
          repartitionActifs,
          clientsEncoursData,
        });

      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ...data, loading, error };
};

export default useGlobalPortfolioData;
