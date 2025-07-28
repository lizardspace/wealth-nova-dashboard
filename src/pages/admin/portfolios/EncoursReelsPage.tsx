import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Search, Filter, Download, Eye, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

const AdminPortfoliosReels = () => {
  const [data, setData] = useState({
    assuranceVie: [],
    compteBancaire: [],
    bienImmobilier: [],
    entrepriseParticipation: [],
    autrePatrimoine: [],
    contratCapitalisation: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [users, setUsers] = useState({});
  const [stats, setStats] = useState({
    totalValue: 0,
    totalAssets: 0,
    categories: {}
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Récupération des utilisateurs
      const { data: usersData } = await supabase
        .from('users')
        .select('id, first_name, last_name, email');
      
      const usersMap = {};
      usersData?.forEach(user => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);

      // Récupération des données patrimoniales
      const promises = [
        supabase.from('assurancevie').select('*'),
        supabase.from('comptebancaire').select('*'),
        supabase.from('bienimmobilier').select('*'),
        supabase.from('entrepriseparticipation').select('*'),
        supabase.from('autrepatrimoine').select('*'),
        supabase.from('contratcapitalisation').select('*')
      ];

      const results = await Promise.all(promises);
      
      const newData = {
        assuranceVie: results[0].data || [],
        compteBancaire: results[1].data || [],
        bienImmobilier: results[2].data || [],
        entrepriseParticipation: results[3].data || [],
        autrePatrimoine: results[4].data || [],
        contratCapitalisation: results[5].data || []
      };

      setData(newData);
      calculateStats(newData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    let totalValue = 0;
    let totalAssets = 0;
    const categories = {};

    Object.entries(data).forEach(([category, items]) => {
      const categoryValue = items.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
      categories[category] = {
        count: items.length,
        value: categoryValue
      };
      totalValue += categoryValue;
      totalAssets += items.length;
    });

    setStats({ totalValue, totalAssets, categories });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
  };

  const getCategoryLabel = (category) => {
    const labels = {
      assuranceVie: 'Assurance Vie',
      compteBancaire: 'Comptes Bancaires',
      bienImmobilier: 'Biens Immobiliers',
      entrepriseParticipation: 'Participations',
      autrePatrimoine: 'Autres Patrimoines',
      contratCapitalisation: 'Contrats Capitalisation'
    };
    return labels[category] || category;
  };

  const getAllAssets = () => {
    const allAssets = [];
    
    Object.entries(data).forEach(([category, items]) => {
      items.forEach(item => {
        allAssets.push({
          ...item,
          category,
          categoryLabel: getCategoryLabel(category),
          userName: users[item.user_id] ? 
            `${users[item.user_id].first_name} ${users[item.user_id].last_name}` : 
            'Utilisateur inconnu'
        });
      });
    });

    return allAssets.filter(asset => {
      const matchesSearch = !searchTerm || 
        asset.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.compagnie?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const exportData = () => {
    const assets = getAllAssets();
    const csvContent = [
      ['Utilisateur', 'Catégorie', 'Libellé', 'Valeur', 'Date acquisition', 'Propriétaire'],
      ...assets.map(asset => [
        asset.userName,
        asset.categoryLabel,
        asset.libelle || '-',
        asset.value || 0,
        formatDate(asset.date_acquisition),
        asset.proprietaire || '-'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encours-reels-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredAssets = getAllAssets();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Encours Réels</h1>
          <p className="text-gray-600">Vue d'ensemble des patrimoines clients</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <PieChart className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assurance Vie</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.categories.assuranceVie?.value || 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Immobilier</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.categories.bienImmobilier?.value || 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par libellé, utilisateur ou compagnie..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Toutes catégories</option>
                  <option value="assuranceVie">Assurance Vie</option>
                  <option value="compteBancaire">Comptes Bancaires</option>
                  <option value="bienImmobilier">Biens Immobiliers</option>
                  <option value="entrepriseParticipation">Participations</option>
                  <option value="autrePatrimoine">Autres Patrimoines</option>
                  <option value="contratCapitalisation">Contrats Capitalisation</option>
                </select>
                
                <button
                  onClick={exportData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Libellé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date acquisition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriétaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset, index) => (
                  <tr key={`${asset.category}-${asset.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{asset.userName}</div>
                      <div className="text-sm text-gray-500">{users[asset.user_id]?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {asset.categoryLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{asset.libelle || '-'}</div>
                      {asset.compagnie && (
                        <div className="text-sm text-gray-500">{asset.compagnie}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(asset.value)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(asset.date_acquisition)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.proprietaire || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun actif trouvé avec les critères de recherche actuels.</p>
            </div>
          )}
        </div>

        {/* Summary by Category */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(stats.categories).map(([category, categoryStats]) => (
            <div key={category} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {getCategoryLabel(category)}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nombre d'actifs:</span>
                  <span className="text-sm font-medium">{categoryStats.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valeur totale:</span>
                  <span className="text-sm font-medium">{formatCurrency(categoryStats.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valeur moyenne:</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(categoryStats.count > 0 ? categoryStats.value / categoryStats.count : 0)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPortfoliosReels;