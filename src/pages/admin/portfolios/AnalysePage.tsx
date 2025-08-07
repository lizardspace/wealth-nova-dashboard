import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  Users, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Euro,
  Home,
  Building2,
  Briefcase,
  CreditCard,
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  Calendar
} from 'lucide-react';

interface UserPortfolio {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  last_login: string;
  totalPatrimoine: number;
  immobilier: number;
  bancaire: number;
  assuranceVie: number;
  entreprise: number;
  autres: number;
  credits: number;
  revenu_annuel: number;
  age: number;
  situation_matrimoniale: string;
}

interface PortfolioStats {
  totalUsers: number;
  totalPatrimoine: number;
  averageAge: number;
  averagePatrimoine: number;
  repartitionTypes: {
    immobilier: number;
    bancaire: number;
    assuranceVie: number;
    entreprise: number;
    autres: number;
  };
}

const AnalysePage: React.FC = () => {
  const [portfolios, setPortfolios] = useState<UserPortfolio[]>([]);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'patrimoine' | 'age' | 'last_login'>('patrimoine');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<UserPortfolio | null>(null);

  useEffect(() => {
    fetchPortfoliosData();
  }, []);

  const fetchPortfoliosData = async () => {
    try {
      setLoading(true);

      // Récupération optimisée - toutes les données en parallèle
      const [
        { data: users, error: usersError },
        { data: immobilierData, error: immobilierError },
        { data: bancaireData, error: bancaireError },
        { data: assuranceVieData, error: assuranceVieError },
        { data: entrepriseData, error: entrepriseError },
        { data: autresData, error: autresError },
        { data: creditsData, error: creditsError }
      ] = await Promise.all([
        supabase.from('users').select(`
          id,
          first_name,
          last_name,
          email,
          created_at,
          last_login,
          personalinfo (
            age,
            revenu_annuel,
            situation_matrimoniale
          )
        `),
        supabase.from('bienimmobilier').select('user_id, value'),
        supabase.from('comptebancaire').select('user_id, value'),
        supabase.from('assurancevie').select('user_id, value'),
        supabase.from('entrepriseparticipation').select('user_id, value'),
        supabase.from('autrepatrimoine').select('user_id, value'),
        supabase.from('credit').select('user_id, capital_restant_du')
      ]);

      // Gestion des erreurs
      const errors = [usersError, immobilierError, bancaireError, assuranceVieError, entrepriseError, autresError, creditsError].filter(Boolean);
      if (errors.length > 0) {
        console.error('Erreurs lors de la récupération des données:', errors);
        throw new Error('Erreur lors du chargement des données patrimoniales');
      }

      // Création des maps pour un accès O(1)
      const userAssetsMap = new Map();
      
      // Initialisation des utilisateurs
      users?.forEach(user => {
        userAssetsMap.set(user.id, {
          user,
          immobilier: 0,
          bancaire: 0,
          assuranceVie: 0,
          entreprise: 0,
          autres: 0,
          credits: 0
        });
      });

      // Agrégation des données par type d'actif
      immobilierData?.forEach(item => {
        const userAssets = userAssetsMap.get(item.user_id);
        if (userAssets) {
          userAssets.immobilier += item.value || 0;
        }
      });

      bancaireData?.forEach(item => {
        const userAssets = userAssetsMap.get(item.user_id);
        if (userAssets) {
          userAssets.bancaire += item.value || 0;
        }
      });

      assuranceVieData?.forEach(item => {
        const userAssets = userAssetsMap.get(item.user_id);
        if (userAssets) {
          userAssets.assuranceVie += item.value || 0;
        }
      });

      entrepriseData?.forEach(item => {
        const userAssets = userAssetsMap.get(item.user_id);
        if (userAssets) {
          userAssets.entreprise += item.value || 0;
        }
      });

      autresData?.forEach(item => {
        const userAssets = userAssetsMap.get(item.user_id);
        if (userAssets) {
          userAssets.autres += item.value || 0;
        }
      });

      creditsData?.forEach(item => {
        const userAssets = userAssetsMap.get(item.user_id);
        if (userAssets) {
          userAssets.credits += item.capital_restant_du || 0;
        }
      });

      // Calcul des statistiques et création des données finales
      const portfoliosData: UserPortfolio[] = [];
      let totalPatrimoineGlobal = 0;
      let totalUsers = 0;
      let totalAge = 0;
      const repartitionTypes = {
        immobilier: 0,
        bancaire: 0,
        assuranceVie: 0,
        entreprise: 0,
        autres: 0
      };

      userAssetsMap.forEach(({ user, immobilier, bancaire, assuranceVie, entreprise, autres, credits }) => {
        const totalPatrimoine = immobilier + bancaire + assuranceVie + entreprise + autres - credits;

        portfoliosData.push({
          id: user.id,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          created_at: user.created_at,
          last_login: user.last_login || '',
          totalPatrimoine,
          immobilier,
          bancaire,
          assuranceVie,
          entreprise,
          autres,
          credits,
          revenu_annuel: user.personalinfo?.[0]?.revenu_annuel || 0,
          age: user.personalinfo?.[0]?.age || 0,
          situation_matrimoniale: user.personalinfo?.[0]?.situation_matrimoniale || ''
        });

        // Calculs pour les statistiques globales
        totalPatrimoineGlobal += totalPatrimoine;
        totalUsers++;
        if (user.personalinfo?.[0]?.age) {
          totalAge += user.personalinfo[0].age;
        }

        repartitionTypes.immobilier += immobilier;
        repartitionTypes.bancaire += bancaire;
        repartitionTypes.assuranceVie += assuranceVie;
        repartitionTypes.entreprise += entreprise;
        repartitionTypes.autres += autres;
      });

      setPortfolios(portfoliosData);
      setStats({
        totalUsers,
        totalPatrimoine: totalPatrimoineGlobal,
        averageAge: totalUsers > 0 ? Math.round(totalAge / totalUsers) : 0,
        averagePatrimoine: totalUsers > 0 ? Math.round(totalPatrimoineGlobal / totalUsers) : 0,
        repartitionTypes
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const filteredAndSortedPortfolios = portfolios
    .filter(portfolio => 
      `${portfolio.first_name} ${portfolio.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'name':
          valueA = `${a.first_name} ${a.last_name}`;
          valueB = `${b.first_name} ${b.last_name}`;
          break;
        case 'patrimoine':
          valueA = a.totalPatrimoine;
          valueB = b.totalPatrimoine;
          break;
        case 'age':
          valueA = a.age;
          valueB = b.age;
          break;
        case 'last_login':
          valueA = new Date(a.last_login || 0).getTime();
          valueB = new Date(b.last_login || 0).getTime();
          break;
        default:
          return 0;
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
      
      return sortOrder === 'asc' ? 
        (valueA as number) - (valueB as number) : 
        (valueB as number) - (valueA as number);
    });

  const exportToCSV = () => {
    const headers = [
      'Nom', 'Prénom', 'Email', 'Âge', 'Situation matrimoniale', 
      'Revenus annuels', 'Patrimoine total', 'Immobilier', 'Bancaire', 
      'Assurance vie', 'Entreprise', 'Autres', 'Crédits', 'Dernière connexion'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedPortfolios.map(p => [
        p.last_name, p.first_name, p.email, p.age, p.situation_matrimoniale,
        p.revenu_annuel, p.totalPatrimoine, p.immobilier, p.bancaire,
        p.assuranceVie, p.entreprise, p.autres, p.credits, formatDate(p.last_login)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `portfolios_analyse_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analyse des Portefeuilles Clients
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble et analyse détaillée des patrimoines clients
          </p>
        </div>

        {/* Statistiques globales */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Euro className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Patrimoine Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalPatrimoine)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Patrimoine Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.averagePatrimoine)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Âge Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageAge} ans</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Répartition par type d'actifs */}
        {stats && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <PieChart className="h-6 w-6 mr-2" />
              Répartition du Patrimoine par Type d'Actifs
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <Home className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Immobilier</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(stats.repartitionTypes.immobilier)}
                </p>
                <p className="text-xs text-gray-500">
                  {((stats.repartitionTypes.immobilier / stats.totalPatrimoine) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Bancaire</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(stats.repartitionTypes.bancaire)}
                </p>
                <p className="text-xs text-gray-500">
                  {((stats.repartitionTypes.bancaire / stats.totalPatrimoine) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Assurance Vie</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(stats.repartitionTypes.assuranceVie)}
                </p>
                <p className="text-xs text-gray-500">
                  {((stats.repartitionTypes.assuranceVie / stats.totalPatrimoine) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <Building2 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Entreprise</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(stats.repartitionTypes.entreprise)}
                </p>
                <p className="text-xs text-gray-500">
                  {((stats.repartitionTypes.entreprise / stats.totalPatrimoine) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <Briefcase className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Autres</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(stats.repartitionTypes.autres)}
                </p>
                <p className="text-xs text-gray-500">
                  {((stats.repartitionTypes.autres / stats.totalPatrimoine) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contrôles de recherche et tri */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="patrimoine">Patrimoine</option>
                  <option value="name">Nom</option>
                  <option value="age">Âge</option>
                  <option value="last_login">Dernière connexion</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Liste des portfolios */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Âge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patrimoine Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Répartition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedPortfolios.map((portfolio) => (
                  <tr key={portfolio.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {portfolio.first_name} {portfolio.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{portfolio.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {portfolio.age || 'N/A'} ans
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(portfolio.revenu_annuel)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        portfolio.totalPatrimoine >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(portfolio.totalPatrimoine)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-1">
                        {portfolio.totalPatrimoine > 0 && (
                          <>
                            <div 
                              className="h-2 bg-blue-500 rounded" 
                              style={{width: `${(portfolio.immobilier / portfolio.totalPatrimoine) * 60}px`}}
                              title={`Immobilier: ${formatCurrency(portfolio.immobilier)}`}
                            />
                            <div 
                              className="h-2 bg-green-500 rounded" 
                              style={{width: `${(portfolio.bancaire / portfolio.totalPatrimoine) * 60}px`}}
                              title={`Bancaire: ${formatCurrency(portfolio.bancaire)}`}
                            />
                            <div 
                              className="h-2 bg-purple-500 rounded" 
                              style={{width: `${(portfolio.assuranceVie / portfolio.totalPatrimoine) * 60}px`}}
                              title={`Assurance vie: ${formatCurrency(portfolio.assuranceVie)}`}
                            />
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(portfolio.last_login)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedUser(portfolio)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de détail utilisateur */}
        {selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Détail du portfolio - {selectedUser.first_name} {selectedUser.last_name}
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Âge</p>
                  <p className="text-sm text-gray-900">{selectedUser.age} ans</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Situation matrimoniale</p>
                  <p className="text-sm text-gray-900">{selectedUser.situation_matrimoniale || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus annuels</p>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedUser.revenu_annuel)}</p>
                </div>
              </div>

              <h4 className="text-md font-semibold text-gray-900 mb-3">Répartition du patrimoine</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Immobilier</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedUser.immobilier)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bancaire</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedUser.bancaire)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Assurance vie</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedUser.assuranceVie)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Entreprise</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedUser.entreprise)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Autres</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedUser.autres)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600">Crédits</span>
                  <span className="text-sm font-medium text-red-600">-{formatCurrency(selectedUser.credits)}</span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="text-md font-semibold text-gray-900">Total</span>
                  <span className={`text-md font-bold ${
                    selectedUser.totalPatrimoine >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(selectedUser.totalPatrimoine)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysePage;