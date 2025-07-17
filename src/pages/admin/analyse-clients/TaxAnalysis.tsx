import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Search, Filter, RefreshCw, Download, Users, Euro, Receipt, TrendingUp, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface TaxAnalysis {
  user_id: string;
  last_name: string;
  first_name: string;
  taxable_income: number;
  tax_option: string;
  wealth_tax: number;
  total_tax_deductions: number;
  fiscal_knowledge: string;
  uses_tax_devices: boolean;
  income_category: string;
  impot_revenu_status?: string;
  ifi_status?: string;
  fiscalite_status?: string;
}

interface DebugInfo {
  totalUsers: number;
  usersWithIncomeData: number;
  usersWithIfiData: number;
  usersWithFiscalData: number;
  dataQualityStats: any[];
}

const TaxAnalysisDashboard: React.FC = () => {
  const [taxAnalyses, setTaxAnalyses] = useState<TaxAnalysis[]>([]);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTaxOption, setFilterTaxOption] = useState<string>('');
  const [filterIncomeCategory, setFilterIncomeCategory] = useState<string>('');
  const [filterFiscalKnowledge, setFilterFiscalKnowledge] = useState<string>('');
  const [showDebugMode, setShowDebugMode] = useState(false);
  const [alert, setAlert] = useState<{type: 'success' | 'warning' | 'error' | 'info', message: string} | null>(null);

  // Couleurs pour les graphiques
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Simulation des données avec plus d'exemples réalistes
  const mockSupabase = {
    from: (table: string) => ({
      select: (columns: string) => ({
        order: (column: string, options?: any) => Promise.resolve({
          data: [
            {
              user_id: '8547ec9f-2d61-44ee-856f-3ec204d6718e',
              last_name: 'RECIPON',
              first_name: 'Vianney',
              taxable_income: 45000,
              tax_option: 'Barème IR',
              wealth_tax: 0,
              total_tax_deductions: 2500,
              fiscal_knowledge: 'Bonne',
              uses_tax_devices: false,
              income_category: 'Moyen',
              impot_revenu_status: 'OK',
              ifi_status: 'MISSING',
              fiscalite_status: 'OK'
            },
            {
              user_id: '9da798fe-d202-4e71-a197-c2fa86822e7e',
              last_name: 'Bard de Coutance',
              first_name: 'Paul',
              taxable_income: 85000,
              tax_option: 'PFU',
              wealth_tax: 3200,
              total_tax_deductions: 1800,
              fiscal_knowledge: 'Expert',
              uses_tax_devices: true,
              income_category: 'Élevé',
              impot_revenu_status: 'OK',
              ifi_status: 'OK',
              fiscalite_status: 'OK'
            },
            {
              user_id: 'abbeef9b-8cd0-4536-9cca-70b6156166ab',
              last_name: 'Bard de Coutance',
              first_name: 'Axel',
              taxable_income: 32000,
              tax_option: 'Barème IR',
              wealth_tax: 0,
              total_tax_deductions: 1200,
              fiscal_knowledge: 'Bonne',
              uses_tax_devices: false,
              income_category: 'Moyen',
              impot_revenu_status: 'OK',
              ifi_status: 'MISSING',
              fiscalite_status: 'OK'
            },
            {
              user_id: 'b995759f-8a03-46eb-b6d8-8e0ebbd6626d',
              last_name: 'Eparnova',
              first_name: 'Admin',
              taxable_income: 0,
              tax_option: 'Non défini',
              wealth_tax: 0,
              total_tax_deductions: 0,
              fiscal_knowledge: 'Non défini',
              uses_tax_devices: false,
              income_category: 'Non défini',
              impot_revenu_status: 'MISSING',
              ifi_status: 'MISSING',
              fiscalite_status: 'MISSING'
            },
            {
              user_id: 'c8d960c1-2ba2-40f9-b40d-fc62bf1018a9',
              last_name: 'Durand',
              first_name: 'Marie',
              taxable_income: 58000,
              tax_option: 'PFU',
              wealth_tax: 0,
              total_tax_deductions: 3100,
              fiscal_knowledge: 'Moyenne',
              uses_tax_devices: true,
              income_category: 'Moyen',
              impot_revenu_status: 'OK',
              ifi_status: 'MISSING',
              fiscalite_status: 'OK'
            },
            {
              user_id: 'd123456a-1234-5678-9abc-def123456789',
              last_name: 'Martin',
              first_name: 'Jean',
              taxable_income: 120000,
              tax_option: 'Barème IR',
              wealth_tax: 8500,
              total_tax_deductions: 5200,
              fiscal_knowledge: 'Expert',
              uses_tax_devices: true,
              income_category: 'Élevé',
              impot_revenu_status: 'OK',
              ifi_status: 'OK',
              fiscalite_status: 'OK'
            },
            {
              user_id: 'e987654b-9876-5432-1abc-def987654321',
              last_name: 'Lefebvre',
              first_name: 'Sophie',
              taxable_income: 28000,
              tax_option: 'Barème IR',
              wealth_tax: 0,
              total_tax_deductions: 800,
              fiscal_knowledge: 'Faible',
              uses_tax_devices: false,
              income_category: 'Faible',
              impot_revenu_status: 'OK',
              ifi_status: 'MISSING',
              fiscalite_status: 'OK'
            }
          ],
          error: null
        })
      })
    })
  };

  // Fetch des données avec diagnostic
  const fetchTaxAnalyses = async () => {
    setLoading(true);
    try {
      const { data, error } = await mockSupabase.from('tax_analysis').select('*').order('taxable_income', { ascending: false });

      if (error) throw error;

      const processedData = (data || []).map(item => ({
        ...item,
        taxable_income: Number(item.taxable_income) || 0,
        wealth_tax: Number(item.wealth_tax) || 0,
        total_tax_deductions: Number(item.total_tax_deductions) || 0,
        uses_tax_devices: Boolean(item.uses_tax_devices),
        tax_option: item.tax_option || 'Non défini',
        fiscal_knowledge: item.fiscal_knowledge || 'Non défini',
        income_category: item.income_category || 'Non défini'
      }));

      setTaxAnalyses(processedData);

      // Calcul des statistiques de debug
      const totalUsers = processedData.length;
      const usersWithIncomeData = processedData.filter(u => u.impot_revenu_status === 'OK').length;
      const usersWithIfiData = processedData.filter(u => u.ifi_status === 'OK').length;
      const usersWithFiscalData = processedData.filter(u => u.fiscalite_status === 'OK').length;

      const dataQualityStats = [
        { name: 'Total', value: totalUsers, percentage: 100 },
        { name: 'Revenus', value: usersWithIncomeData, percentage: Math.round((usersWithIncomeData / totalUsers) * 100) },
        { name: 'IFI', value: usersWithIfiData, percentage: Math.round((usersWithIfiData / totalUsers) * 100) },
        { name: 'Préférences', value: usersWithFiscalData, percentage: Math.round((usersWithFiscalData / totalUsers) * 100) }
      ];

      setDebugInfo({
        totalUsers,
        usersWithIncomeData,
        usersWithIfiData,
        usersWithFiscalData,
        dataQualityStats
      });

      // Alerte si données manquantes
      if (usersWithIncomeData < totalUsers * 0.7) {
        setAlert({
          type: 'warning',
          message: `Attention: ${totalUsers - usersWithIncomeData} utilisateurs n'ont pas de données fiscales complètes`
        });
      } else {
        setAlert({
          type: 'success',
          message: `Données chargées avec succès. ${usersWithIncomeData}/${totalUsers} utilisateurs avec données complètes`
        });
      }

    } catch (error: any) {
      console.error('Error fetching tax analyses:', error);
      setAlert({
        type: 'error',
        message: 'Échec du chargement des analyses fiscales'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxAnalyses();
  }, []);

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBadgeColor = (category: string, value: string) => {
    const colorMaps = {
      tax_option: {
        'PFU': 'bg-blue-100 text-blue-800',
        'Barème IR': 'bg-purple-100 text-purple-800',
        'Non défini': 'bg-gray-100 text-gray-800'
      },
      fiscal_knowledge: {
        'Expert': 'bg-green-100 text-green-800',
        'Bonne': 'bg-lime-100 text-lime-800',
        'Moyenne': 'bg-yellow-100 text-yellow-800',
        'Faible': 'bg-red-100 text-red-800',
        'Non défini': 'bg-gray-100 text-gray-800'
      },
      income_category: {
        'Faible': 'bg-blue-100 text-blue-800',
        'Moyen': 'bg-orange-100 text-orange-800',
        'Élevé': 'bg-red-100 text-red-800',
        'Non défini': 'bg-gray-100 text-gray-800'
      }
    };
    return colorMaps[category]?.[value] || 'bg-gray-100 text-gray-800';
  };

  // Filtrage des données
  const filteredAnalyses = taxAnalyses.filter(analysis => {
    const nameMatch = `${analysis.first_name} ${analysis.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const optionMatch = !filterTaxOption || analysis.tax_option === filterTaxOption;
    const incomeMatch = !filterIncomeCategory || analysis.income_category === filterIncomeCategory;
    const knowledgeMatch = !filterFiscalKnowledge || analysis.fiscal_knowledge === filterFiscalKnowledge;
    return nameMatch && optionMatch && incomeMatch && knowledgeMatch;
  });

  // Statistiques
  const validAnalyses = taxAnalyses.filter(a => a.taxable_income > 0);
  const totalTaxableIncome = taxAnalyses.reduce((sum, analysis) => sum + (Number(analysis.taxable_income) || 0), 0);
  const totalWealthTax = taxAnalyses.reduce((sum, analysis) => sum + (Number(analysis.wealth_tax) || 0), 0);
  const totalDeductions = taxAnalyses.reduce((sum, analysis) => sum + (Number(analysis.total_tax_deductions) || 0), 0);
  const averageIncome = validAnalyses.length > 0 ? totalTaxableIncome / validAnalyses.length : 0;

  // Données pour les graphiques
  const taxOptionStats = taxAnalyses.reduce((acc, analysis) => {
    const option = analysis.tax_option || 'Non défini';
    acc[option] = (acc[option] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const incomeCategories = taxAnalyses.reduce((acc, analysis) => {
    const category = analysis.income_category || 'Non défini';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const fiscalKnowledgeStats = taxAnalyses.reduce((acc, analysis) => {
    const knowledge = analysis.fiscal_knowledge || 'Non défini';
    acc[knowledge] = (acc[knowledge] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(taxOptionStats).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(incomeCategories).map(([name, value]) => ({ name, value }));
  const knowledgeData = Object.entries(fiscalKnowledgeStats).map(([name, value]) => ({ name, value }));

  // Données pour le graphique des revenus par tranche
  const incomeRanges = [
    { range: '0-30k', min: 0, max: 30000 },
    { range: '30-50k', min: 30000, max: 50000 },
    { range: '50-80k', min: 50000, max: 80000 },
    { range: '80k+', min: 80000, max: Infinity }
  ];

  const incomeDistribution = incomeRanges.map(range => ({
    name: range.range,
    count: taxAnalyses.filter(a => a.taxable_income >= range.min && a.taxable_income < range.max).length
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des analyses fiscales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analyse Fiscale des Clients</h1>
            <p className="text-gray-600 mt-1">Dashboard de suivi et d'analyse des profils fiscaux</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDebugMode(!showDebugMode)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                showDebugMode 
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showDebugMode ? <EyeOff size={16} /> : <Eye size={16} />}
              {showDebugMode ? 'Masquer Debug' : 'Mode Debug'}
            </button>
            <button
              onClick={fetchTaxAnalyses}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
            alert.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
            alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
            alert.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            <AlertCircle size={20} />
            <span className="flex-1">{alert.message}</span>
            <button
              onClick={() => setAlert(null)}
              className="text-xl leading-none hover:opacity-70"
            >
              ×
            </button>
          </div>
        )}

        {/* Debug Panel */}
        {showDebugMode && debugInfo && (
          <div className="mb-6 bg-gray-800 text-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={20} />
              Diagnostic des Données
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Qualité des Données</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={debugInfo.dataQualityStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-300">Utilisateurs totaux</p>
                  <p className="text-2xl font-bold">{debugInfo.totalUsers}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-300">Avec données de revenus</p>
                  <p className="text-2xl font-bold">{debugInfo.usersWithIncomeData} 
                    <span className="text-sm text-gray-400 ml-2">
                      ({Math.round((debugInfo.usersWithIncomeData / debugInfo.totalUsers) * 100)}%)
                    </span>
                  </p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-300">Avec données IFI</p>
                  <p className="text-2xl font-bold">{debugInfo.usersWithIfiData}
                    <span className="text-sm text-gray-400 ml-2">
                      ({Math.round((debugInfo.usersWithIfiData / debugInfo.totalUsers) * 100)}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clients Analysés</p>
                <p className="text-2xl font-bold text-gray-900">{taxAnalyses.length}</p>
                <p className="text-xs text-gray-500">{validAnalyses.length} avec données complètes</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenu Fiscal Moyen</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageIncome)}</p>
                <p className="text-xs text-gray-500">Total: {formatCurrency(totalTaxableIncome)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Euro className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">IFI Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalWealthTax)}</p>
                <p className="text-xs text-gray-500">{taxAnalyses.filter(a => (a.wealth_tax || 0) > 0).length} clients concernés</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Receipt className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Déductions Totales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeductions)}</p>
                <p className="text-xs text-gray-500">{taxAnalyses.filter(a => a.uses_tax_devices).length} utilisent des dispositifs</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Répartition par Option Fiscale</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Distribution des Revenus</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Répartition par Catégorie de Revenu</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Niveau de Connaissance Fiscale</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={knowledgeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {knowledgeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Filter size={20} />
            Filtres et Recherche
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Nom ou prénom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Option Fiscale</label>
              <select
                value={filterTaxOption}
                onChange={(e) => setFilterTaxOption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les options</option>
                {Object.keys(taxOptionStats).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie de Revenu</label>
              <select
                value={filterIncomeCategory}
                onChange={(e) => setFilterIncomeCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les catégories</option>
                <option value="Faible">Faible</option>
                <option value="Moyen">Moyen</option>
                <option value="Élevé">Élevé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Connaissance Fiscale</label>
              <select
                value={filterFiscalKnowledge}
                onChange={(e) => setFilterFiscalKnowledge(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les niveaux</option>
                <option value="Expert">Expert</option>
                <option value="Bonne">Bonne</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Faible">Faible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Liste des Clients</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center gap-1">
                <Download size={16} />
                Exporter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenu Fiscal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Option Fiscale
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IFI
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Déductions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Connaissance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispositifs
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAnalyses.length > 0 ? (
                  filteredAnalyses.map((analysis) => (
                    <tr key={analysis.user_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {analysis.first_name} {analysis.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(analysis.taxable_income)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor('tax_option', analysis.tax_option)}`}>
                          {analysis.tax_option}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(analysis.wealth_tax)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(analysis.total_tax_deductions)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor('fiscal_knowledge', analysis.fiscal_knowledge)}`}>
                          {analysis.fiscal_knowledge}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          analysis.uses_tax_devices ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {analysis.uses_tax_devices ? 'Oui' : 'Non'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor('income_category', analysis.income_category)}`}>
                          {analysis.income_category}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucun résultat trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxAnalysisDashboard;
