import { useState, useEffect } from 'react';
import { getEncoursData } from '../lib/dataFetcher';
import {
  AssuranceVie,
  ContratCapitalisation,
  BienImmobilier,
  EntrepriseParticipation,
  CompteBancaire,
  User
} from '../types/types';

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
        const {
          users,
          assuranceVie,
          contratCapitalisation,
          bienImmobilier,
          entrepriseParticipation,
          compteBancaire
        } = await getEncoursData();

        // Process data for charts and tables
        const totalAssuranceVie = (assuranceVie as AssuranceVie[]).reduce((sum, item) => sum + item.value, 0);
        const totalContratCapitalisation = (contratCapitalisation as ContratCapitalisation[]).reduce((sum, item) => sum + item.value, 0);
        const totalBienImmobilier = (bienImmobilier as BienImmobilier[]).reduce((sum, item) => sum + item.value, 0);
        const totalEntrepriseParticipation = (entrepriseParticipation as EntrepriseParticipation[]).reduce((sum, item) => sum + item.value, 0);
        const totalCompteBancaire = (compteBancaire as CompteBancaire[]).reduce((sum, item) => sum + item.value, 0);

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
          const userAssuranceVie = (assuranceVie as AssuranceVie[]).filter(item => item.user_id === user.id).reduce((sum, item) => sum + item.value, 0);
          const userContratCapitalisation = (contratCapitalisation as ContratCapitalisation[]).filter(item => item.user_id === user.id).reduce((sum, item) => sum + item.value, 0);
          const userBienImmobilier = (bienImmobilier as BienImmobilier[]).filter(item => item.user_id === user.id).reduce((sum, item) => sum + item.value, 0);
          const userEntrepriseParticipation = (entrepriseParticipation as EntrepriseParticipation[]).filter(item => item.user_id === user.id).reduce((sum, item) => sum + item.value, 0);
          const userCompteBancaire = (compteBancaire as CompteBancaire[]).filter(item => item.user_id === user.id).reduce((sum, item) => sum + item.value, 0);
          const total = userAssuranceVie + userContratCapitalisation + userBienImmobilier + userEntrepriseParticipation + userCompteBancaire;
          return {
            id: user.id,
            nom: user.last_name,
            prenom: user.first_name,
            assuranceVie: userAssuranceVie,
            per: userContratCapitalisation,
            scpi: userEntrepriseParticipation,
            autre: userCompteBancaire + userBienImmobilier,
            total: total,
          };
        });
        setClientsData(clients);

        // Mocked for now, as we don't have historical data
        const encours = [
            { mois: 'Jan', assuranceVie: 580000, per: 320000, immobilier: 120000, scpi: 180000, autre: 50000 },
            { mois: 'Fév', assuranceVie: 610000, per: 340000, immobilier: 120000, scpi: 185000, autre: 55000 },
            { mois: 'Mars', assuranceVie: 650000, per: 370000, immobilier: 120000, scpi: 195000, autre: 65000 },
            { mois: 'Avr', assuranceVie: 680000, per: 390000, immobilier: 120000, scpi: 210000, autre: 80000 },
            { mois: 'Mai', assuranceVie: 720000, per: 420000, immobilier: 120000, scpi: 225000, autre: 95000 },
            { mois: 'Juin', assuranceVie: 750000, per: 460000, immobilier: 120000, scpi: 240000, autre: 120000 },
        ];
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
