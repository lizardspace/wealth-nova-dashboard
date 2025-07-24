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

        const encours = [
          { mois: 'Jan', assuranceVie: totalAssuranceVie * 0.9, per: totalContratCapitalisation * 0.85, immobilier: totalBienImmobilier * 0.95, scpi: totalEntrepriseParticipation * 0.92, autre: totalCompteBancaire * 0.88 },
          { mois: 'Fév', assuranceVie: totalAssuranceVie * 0.92, per: totalContratCapitalisation * 0.88, immobilier: totalBienImmobilier * 0.96, scpi: totalEntrepriseParticipation * 0.94, autre: totalCompteBancaire * 0.9 },
          { mois: 'Mars', assuranceVie: totalAssuranceVie * 0.95, per: totalContratCapitalisation * 0.9, immobilier: totalBienImmobilier * 0.97, scpi: totalEntrepriseParticipation * 0.96, autre: totalCompteBancaire * 0.92 },
          { mois: 'Avr', assuranceVie: totalAssuranceVie * 0.97, per: totalContratCapitalisation * 0.92, immobilier: totalBienImmobilier * 0.98, scpi: totalEntrepriseParticipation * 0.98, autre: totalCompteBancaire * 0.95 },
          { mois: 'Mai', assuranceVie: totalAssuranceVie * 0.98, per: totalContratCapitalisation * 0.95, immobilier: totalBienImmobilier * 0.99, scpi: totalEntrepriseParticipation * 1, autre: totalCompteBancaire * 0.98 },
          { mois: 'Juin', assuranceVie: totalAssuranceVie, per: totalContratCapitalisation, immobilier: totalBienImmobilier, scpi: totalEntrepriseParticipation, autre: totalCompteBancaire },
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
