import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  AssuranceVie,
  ContratCapitalisation,
  BienImmobilier,
  EntrepriseParticipation,
  CompteBancaire,
} from '../types/types';

// This is a new User type that matches the structure of the auth.users table.
export type User = {
  id: string;
  email?: string;
  user_metadata: {
    [key: string]: any;
    first_name?: string;
    last_name?: string;
  };
  [key: string]: any;
};


export const useEncoursReelsData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [encoursData, setEncoursData] = useState<any[]>([]);
  const [repartitionData, setRepartitionData] = useState<any[]>([]);
  const [clientsData, setClientsData] = useState<any[]>([]);
  const [totalEncours, setTotalEncours] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) throw new Error(usersError.message);

        const { data: assuranceVie, error: assuranceVieError } = await supabase.from('assurancevie').select('*');
        if (assuranceVieError) throw new Error(assuranceVieError.message);

        const { data: contratCapitalisation, error: contratCapitalisationError } = await supabase.from('contratcapitalisation').select('*');
        if (contratCapitalisationError) throw new Error(contratCapitalisationError.message);

        const { data: bienImmobilier, error: bienImmobilierError } = await supabase.from('bienimmobilier').select('*');
        if (bienImmobilierError) throw new Error(bienImmobilierError.message);

        const { data: entrepriseParticipation, error: entrepriseParticipationError } = await supabase.from('entrepriseparticipation').select('*');
        if (entrepriseParticipationError) throw new Error(entrepriseParticipationError.message);

        const { data: compteBancaire, error: compteBancaireError } = await supabase.from('comptebancaire').select('*');
        if (compteBancaireError) throw new Error(compteBancaireError.message);

        // Process data for charts and tables
        const totalAssuranceVie = (assuranceVie as unknown as AssuranceVie[]).reduce((sum, item) => sum + item.value, 0);
        const totalContratCapitalisation = (contratCapitalisation as unknown as ContratCapitalisation[]).reduce((sum, item) => sum + item.value, 0);
        const totalBienImmobilier = (bienImmobilier as unknown as BienImmobilier[]).reduce((sum, item) => sum + item.value, 0);
        const totalEntrepriseParticipation = (entrepriseParticipation as unknown as EntrepriseParticipation[]).reduce((sum, item) => sum + item.value, 0);
        const totalCompteBancaire = (compteBancaire as unknown as CompteBancaire[]).reduce((sum, item) => sum + item.value, 0);

        const total = totalAssuranceVie + totalContratCapitalisation + totalBienImmobilier + totalEntrepriseParticipation + totalCompteBancaire;
        setTotalEncours(total);

        const repartition = [
          { name: 'Assurance Vie', value: totalAssuranceVie },
          { name: 'PER', value: totalContratCapitalisation },
          { name: 'Immobilier', value: totalBienImmobilier },
          { name: 'SCPI', value: totalEntrepriseParticipation },
          { name: 'Autre', value: totalCompteBancaire },
        ];
        setRepartitionData(repartition);

        const clients = (users as User[]).map(user => {
          const userAssuranceVie = (assuranceVie as unknown as AssuranceVie[]).filter(item => item.user_id === user.id).reduce((sum, item) => sum + item.value, 0);
          const userContratCapitalisation = (contratCapitalisation as unknown as ContratCapitalisation[]).filter(item => item.user_id === user.id).reduce((sum, item) => sum + item.value, 0);
          const userBienImmobilier = (bienImmobilier as unknown as BienImmobilier[]).filter(item => item.user_id === user.id).reduce((sum, item) => sum + item.value, 0);
          const userEntrepriseParticipation = (entrepriseParticipation as unknown as EntrepriseParticipation[]).filter(item => item.user_id === user.id).reduce((sum, item) => sum + item.value, 0);
          const userCompteBancaire = (compteBancaire as unknown as CompteBancaire[]).filter(item => item.user_id === user.id).reduce((sum, item) => sum + item.value, 0);
          const total = userAssuranceVie + userContratCapitalisation + userBienImmobilier + userEntrepriseParticipation + userCompteBancaire;
          return {
            id: user.id,
            nom: user.user_metadata.last_name || '',
            prenom: user.user_metadata.first_name || '',
            assuranceVie: userAssuranceVie,
            per: userContratCapitalisation,
            scpi: userEntrepriseParticipation,
            autre: userCompteBancaire + userBienImmobilier,
            total: total,
          };
        });
        setClientsData(clients);

        const allAssets = [
          ...(assuranceVie as unknown as AssuranceVie[]),
          ...(contratCapitalisation as unknown as ContratCapitalisation[]),
          ...(bienImmobilier as unknown as BienImmobilier[]),
          ...(entrepriseParticipation as unknown as EntrepriseParticipation[]),
          ...(compteBancaire as unknown as CompteBancaire[]),
        ];

        const monthlyData: { [key: string]: { [key: string]: number } } = {};

        allAssets.forEach(asset => {
          const date = new Date(asset.date_acquisition);
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const key = `${month} ${year}`;

          if (!monthlyData[key]) {
            monthlyData[key] = {
              assuranceVie: 0,
              per: 0,
              immobilier: 0,
              scpi: 0,
              autre: 0,
            };
          }
          if ('type_assurance' in asset) {
            monthlyData[key].assuranceVie += asset.value;
          } else if ('regime' in asset) {
            monthlyData[key].per += asset.value;
          } else if ('type_immobilier' in asset) {
            monthlyData[key].immobilier += asset.value;
          } else if ('type_entreprise' in asset) {
            monthlyData[key].scpi += asset.value;
          } else {
            monthlyData[key].autre += asset.value;
          }
        });

        const encours = Object.keys(monthlyData).map(key => ({
          mois: key,
          ...monthlyData[key],
        })).sort((a, b) => {
          const aDate = new Date(a.mois);
          const bDate = new Date(b.mois);
          return aDate.getTime() - bDate.getTime();
        });

        setEncoursData(encours);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, error, encoursData, repartitionData, clientsData, totalEncours };
};
