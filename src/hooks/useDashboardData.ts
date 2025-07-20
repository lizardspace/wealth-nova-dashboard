// src/hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface EncoursStat {
  month: string;
  encours_reels_banque: number;
  encours_reels_assurance_vie: number;
  encours_reels_capitalisation: number;
  encours_reels_entreprise: number;
  encours_reels_total: number;
  encours_theoriques: number;
  epargne_disponible: number;
}

export interface ClientStat {
  month: string;
  total_clients: number;
  nouveaux_clients: number;
}

export interface ActiviteRecente {
  client: string;
  action: string;
  date_action: string;
  montant: number;
  produit: string;
}

export interface AlerteOpportunite {
  type_alerte: string;
  nombre: number;
  couleur: string;
}

export interface RepartitionActif {
  classe_actif: string;
  valeur_totale: number;
}

export interface ProchainRdv {
  client: string;
  theme: string;
  date_rdv: string;
  heure: string;
}

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour chaque type de données
  const [encoursStats, setEncourStats] = useState<EncoursStat[]>([]);
  const [clientsStats, setClientsStats] = useState<ClientStat[]>([]);
  const [activitesRecentes, setActivitesRecentes] = useState<ActiviteRecente[]>([]);
  const [alertesOpportunites, setAlertesOpportunites] = useState<AlerteOpportunite[]>([]);
  const [repartitionActifs, setRepartitionActifs] = useState<RepartitionActif[]>([]);
  const [prochainsRdv, setProchainsRdv] = useState<ProchainRdv[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupération parallèle de toutes les données
      const [
        encoursResult,
        clientsResult,
        activitesResult,
        alertesResult,
        repartitionResult,
        rdvResult
      ] = await Promise.all([
        supabase.from('v_encours_stats').select('*'),
        supabase.from('v_clients_stats').select('*'),
        supabase.from('v_activites_recentes').select('*'),
        supabase.from('v_alertes_opportunites').select('*'),
        supabase.from('v_repartition_actifs').select('*'),
        supabase.from('v_prochains_rdv').select('*')
      ]);

      // Vérification des erreurs
      if (encoursResult.error) throw encoursResult.error;
      if (clientsResult.error) throw clientsResult.error;
      if (activitesResult.error) throw activitesResult.error;
      if (alertesResult.error) throw alertesResult.error;
      if (repartitionResult.error) throw repartitionResult.error;
      if (rdvResult.error) throw rdvResult.error;

      // Traitement des données d'encours
      const processedEncours = (encoursResult.data || []).map(row => {
        const totalReel = (row.encours_reels_banque || 0) +
                          (row.encours_reels_assurance_vie || 0) +
                          (row.encours_reels_capitalisation || 0) +
                          (row.encours_reels_entreprise || 0);
        return {
          month: new Date(row.month).toLocaleDateString('fr-FR', { month: 'short' }),
          encours_reels_banque: row.encours_reels_banque || 0,
          encours_reels_assurance_vie: row.encours_reels_assurance_vie || 0,
          encours_reels_capitalisation: row.encours_reels_capitalisation || 0,
          encours_reels_entreprise: row.encours_reels_entreprise || 0,
          encours_reels_total: totalReel,
          encours_theoriques: totalReel * 1.6, // Simulation théorique
          epargne_disponible: row.epargne_disponible || 0
        };
      });

      // Mise à jour des états
      setEncourStats(processedEncours);
      setClientsStats(clientsResult.data || []);
      setActivitesRecentes(activitesResult.data || []);
      setAlertesOpportunites(alertesResult.data || []);
      setRepartitionActifs(repartitionResult.data || []);
      setProchainsRdv(rdvResult.data || []);

    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    loading,
    error,
    refreshData,
    data: {
      encoursStats,
      clientsStats,
      activitesRecentes,
      alertesOpportunites,
      repartitionActifs,
      prochainsRdv
    }
  };
};

// Hook pour les statistiques en temps réel
export const useRealtimeStats = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    encoursTotal: 0,
    nouveauxClients: 0,
    tauxConversion: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupération du nombre total de clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('users')
          .select('id', { count: 'exact' });

        if (clientsError) throw clientsError;

        // Récupération des encours totaux
        const { data: encoursData, error: encoursError } = await supabase
          .from('v_encours_stats')
          .select('*')
          .order('month', { ascending: false })
          .limit(1);

        if (encoursError) throw encoursError;

        // Récupération des nouveaux clients du mois
        const { data: nouveauxData, error: nouveauxError } = await supabase
          .from('users')
          .select('id')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

        if (nouveauxError) throw nouveauxError;

        const latestEncours = encoursData?.[0];
        const encoursReel = latestEncours?.encours_reels_total || 0;
        const encoursTheorique = latestEncours?.encours_theoriques || 0;

        setStats({
          totalClients: clientsData?.length || 0,
          encoursTotal: encoursReel,
          nouveauxClients: nouveauxData?.length || 0,
          tauxConversion: encoursTheorique > 0 ? (encoursReel / encoursTheorique) * 100 : 0
        });

      } catch (error) {
        console.error('Erreur lors du calcul des statistiques:', error);
      }
    };

    fetchStats();

    // Actualisation toutes les 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return stats;
};

// Service pour gérer les données du dashboard
export class DashboardService {
  static async getEncoursByPeriod(periode: string) {
    let interval = '6 months';
    
    switch (periode) {
      case '1mois':
        interval = '1 month';
        break;
      case '3mois':
        interval = '3 months';
        break;
      case '1an':
        interval = '12 months';
        break;
      default:
        interval = '6 months';
    }

    const { data, error } = await supabase
      .from('v_encours_stats')
      .select('*')
      .gte('month', new Date(Date.now() - (interval === '1 month' ? 30 : interval === '3 months' ? 90 : interval === '6 months' ? 180 : 365) * 24 * 60 * 60 * 1000).toISOString())
      .order('month', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async exportDashboardData() {
    try {
      const { data: encoursData } = await supabase.from('v_encours_stats').select('*');
      const { data: clientsData } = await supabase.from('v_clients_stats').select('*');
      const { data: alertesData } = await supabase.from('v_alertes_opportunites').select('*');

      return {
        encours: encoursData,
        clients: clientsData,
        alertes: alertesData,
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      throw error;
    }
  }

  static async markOpportunityAsProcessed(type: string) {
    // Cette fonction pourrait être utilisée pour marquer une opportunité comme traitée
    // Pour l'instant, on simule juste un délai
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}