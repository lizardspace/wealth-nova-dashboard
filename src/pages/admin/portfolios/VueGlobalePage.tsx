import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  Users, 
  TrendingUp, 
  Home, 
  Banknote, 
  Building2, 
  Shield, 
  PiggyBank,
  Eye,
  EyeOff,
  Filter,
  Download
} from 'lucide-react';

interface UserPatrimoine {
  user_id: string;
  user_name: string;
  user_email: string;
  total_immobilier: number;
  total_bancaire: number;
  total_assurance_vie: number;
  total_entreprise: number;
  total_autres: number;
  total_general: number;
  nb_biens_immobiliers: number;
  nb_comptes_bancaires: number;
  nb_contrats_assurance: number;
  derniere_maj: string;
}

interface GlobalStats {
  total_users: number;
  total_patrimoine: number;
  moyenne_patrimoine: number;
  total_immobilier: number;
  total_bancaire: number;
  total_assurance_vie: number;
  total_entreprise: number;
  total_autres: number;
}

const VueGlobalePage: React.FC = () => {
  const [patrimoines, setPatrimoines] = useState<UserPatrimoine[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showValues, setShowValues] = useState(false);
  const [sortBy, setSortBy] = useState<keyof UserPatrimoine>('total_general');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterMinPatrimoine, setFilterMinPatrimoine] = useState<number>(0);

  useEffect(() => {
    fetchPatrimoinesData();
  }, []);

  const fetchPatrimoinesData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les données des utilisateurs avec leur patrimoine
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, created_at');

      if (usersError) throw usersError;

      const patrimoineData: UserPatrimoine[] = [];
      let totalStats = {
        total_users: users?.length || 0,
        total_patrimoine: 0,
        total_immobilier: 0,
        total_bancaire: 0,
        total_assurance_vie: 0,
        total_entreprise: 0,
        total_autres: 0,
        moyenne_patrimoine: 0
      };

      for (const user of users || []) {
        // Patrimoine immobilier
        const { data: immobilier } = await supabase
          .from('bienimmobilier')
          .select('value')
          .eq('user_id', user.id);

        // Comptes bancaires
        const { data: bancaire } = await supabase
          .from('comptebancaire')
          .select('value')
          .eq('user_id', user.id);

        // Assurance vie
        const { data: assuranceVie } = await supabase
          .from('assurancevie')
          .select('value')
          .eq('user_id', user.id);

        // Entreprises
        const { data: entreprise } = await supabase
          .from('entrepriseparticipation')
          .select('value')
          .eq('user_id', user.id);

        // Autres patrimoines
        const { data: autres } = await supabase
          .from('autrepatrimoine')
          .select('value')
          .eq('user_id', user.id);

        const totalImmobilier = immobilier?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
        const totalBancaire = bancaire?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
        const totalAssuranceVie = assuranceVie?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
        const totalEntreprise = entreprise?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
        const totalAutres = autres?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
        const totalGeneral = totalImmobilier + totalBancaire + totalAssuranceVie + totalEntreprise + totalAutres;

        patrimoineData.push({
          user_id: user.id,
          user_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A',
          user_email: user.email || 'N/A',
          total_immobilier: totalImmobilier,
          total_bancaire: totalBancaire,
          total_assurance_vie: totalAssuranceVie,
          total_entreprise: totalEntreprise,
          total_autres: totalAutres,
          total_general: totalGeneral,
          nb_biens_immobiliers: immobilier?.length || 0,
          nb_comptes_bancaires: bancaire?.length || 0,
          nb_contrats_assurance: assuranceVie?.length || 0,
          derniere_maj: user.created_at || ''
        });

        // Mise à jour des statistiques globales
        totalStats.total_patrimoine += totalGeneral;
        totalStats.total_immobilier += totalImmobilier;
        totalStats.total_bancaire += totalBancaire;
        totalStats.total_assurance_vie += totalAssuranceVie;
        totalStats.total_entreprise += totalEntreprise;
        totalStats.total_autres += totalAutres;
      }

      totalStats.moyenne_patrimoine = totalStats.total_users > 0 
        ? totalStats.total_patrimoine / totalStats.total_users 
        : 0;

      setPatrimoines(patrimoineData);
      setGlobalStats(totalStats);

    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données patrimoniales');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    if (!showValues) return '••••••';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSort = (field: keyof UserPatrimoine) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedPatrimoines = patrimoines
    .filter(p => p.total_general >= filterMinPatrimoine)
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  const exportToCSV = () => {
    const headers = [
      'Nom',
      'Email', 
      'Patrimoine Total',
      'Immobilier',
      'Bancaire',
      'Assurance Vie',
      'Entreprise',
      'Autres'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedPatrimoines.map(p => [
        `"${p.user_name}"`,
        `"${p.user_email}"`,
        p.total_general,
        p.total_immobilier,
        p.total_bancaire,
        p.total_assurance_vie,
        p.total_entreprise,
        p.total_autres
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patrimoines_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données patrimoniales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPatrimoinesData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vue Globale des Patrimoines</h1>
          <p className="text-gray-600">Aperçu général des patrimoines de tous les utilisateurs</p>
        </div>

        {/* Statistiques globales */}
        {globalStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                  <p className="text-2xl font-semibold text-gray-900">{globalStats.total_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Patrimoine Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(globalStats.total_patrimoine)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <PiggyBank className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Patrimoine Moyen</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(globalStats.moyenne_patrimoine)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Home className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Immobilier Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(globalStats.total_immobilier)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Répartition par type de patrimoine */}
        {globalStats && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition du Patrimoine Global</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <Home className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Immobilier</p>
                <p className="font-semibold">{formatCurrency(globalStats.total_immobilier)}</p>
              </div>
              <div className="text-center">
                <Banknote className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Bancaire</p>
                <p className="font-semibold">{formatCurrency(globalStats.total_bancaire)}</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Assurance Vie</p>
                <p className="font-semibold">{formatCurrency(globalStats.total_assurance_vie)}</p>
              </div>
              <div className="text-center">
                <Building2 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Entreprise</p>
                <p className="font-semibold">{formatCurrency(globalStats.total_entreprise)}</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Autres</p>
                <p className="font-semibold">{formatCurrency(globalStats.total_autres)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contrôles et filtres */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowValues(!showValues)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showValues ? 'Masquer' : 'Afficher'} les montants
              </button>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <label className="text-sm text-gray-600">Patrimoine minimum:</label>
                <input
                  type="number"
                  value={filterMinPatrimoine}
                  onChange={(e) => setFilterMinPatrimoine(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 w-32 text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Tableau des patrimoines */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('user_name')}
                  >
                    Utilisateur {sortBy === 'user_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('total_general')}
                  >
                    Patrimoine Total {sortBy === 'total_general' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('total_immobilier')}
                  >
                    Immobilier {sortBy === 'total_immobilier' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('total_bancaire')}
                  >
                    Bancaire {sortBy === 'total_bancaire' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('total_assurance_vie')}
                  >
                    Assurance Vie {sortBy === 'total_assurance_vie' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nb Actifs
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedPatrimoines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Aucune donnée disponible
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedPatrimoines.map((patrimoine) => (
                    <tr key={patrimoine.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patrimoine.user_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patrimoine.user_email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(patrimoine.total_general)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(patrimoine.total_immobilier)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(patrimoine.total_bancaire)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(patrimoine.total_assurance_vie)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {patrimoine.nb_biens_immobiliers} biens, {patrimoine.nb_comptes_bancaires} comptes, {patrimoine.nb_contrats_assurance} contrats
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer avec informations */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')} • 
          {filteredAndSortedPatrimoines.length} utilisateur(s) affiché(s)
        </div>
      </div>
    </div>
  );
};

export default VueGlobalePage;