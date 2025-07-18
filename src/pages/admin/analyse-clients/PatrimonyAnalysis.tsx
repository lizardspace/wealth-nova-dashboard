import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Euro,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Building,
  CreditCard,
  Shield,
  MapPin,
  Settings,
  ChevronDown,
  ChevronUp,
  Maximize2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

// Types
interface PatrimonySummary {
  user_id: string;
  last_name: string;
  first_name: string;
  email: string;
  date_naissance: string;
  civilite: string;
  total_bank_assets: number;
  total_life_insurance: number;
  total_real_estate: number;
  total_business_assets: number;
  total_other_assets: number;
  total_assets: number;
  total_loans: number;
  net_worth: number;
}

interface AssetDistribution {
  user_id: string;
  last_name: string;
  first_name: string;
  bank_assets: number;
  life_insurance: number;
  real_estate: number;
  business_assets: number;
  other_assets: number;
  bank_percentage: number | null;
  life_insurance_percentage: number | null;
  real_estate_percentage: number | null;
  business_assets_percentage: number | null;
  other_assets_percentage: number | null;
}

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  description: string;
}

// Fonctions utilitaires
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

const getNetWorthCategory = (netWorth: number) => {
  if (netWorth < 100000) return { label: 'Modeste', color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50' };
  if (netWorth < 500000) return { label: 'Moyen', color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' };
  if (netWorth < 1000000) return { label: 'Confortable', color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' };
  return { label: 'Élevé', color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' };
};

const getRiskLevel = (netWorth: number) => {
  if (netWorth < 0) return { level: 'Élevé', color: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" /> };
  if (netWorth < 50000) return { level: 'Modéré', color: 'text-yellow-600', icon: <AlertTriangle className="w-4 h-4" /> };
  return { level: 'Faible', color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> };
};

// Composants
const MetricCard: React.FC<{ metric: MetricCard }> = ({ metric }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
        {metric.icon}
      </div>
      <div className={`flex items-center text-sm font-medium ${
        metric.changeType === 'increase' ? 'text-green-600' : 
        metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
      }`}>
        {metric.changeType === 'increase' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : 
         metric.changeType === 'decrease' ? <ArrowDownRight className="w-4 h-4 mr-1" /> : null}
        {Math.abs(metric.change)}%
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
      <p className="text-sm text-gray-600 mb-2">{metric.title}</p>
      <p className="text-xs text-gray-500">{metric.description}</p>
    </div>
  </div>
);

const ClientCard: React.FC<{ client: PatrimonySummary; onSelect: (id: string) => void; isSelected: boolean }> = ({ 
  client, onSelect, isSelected 
}) => {
  const category = getNetWorthCategory(client.net_worth);
  const risk = getRiskLevel(client.net_worth);
  
  return (
    <div 
      className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(client.user_id)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {client.civilite} {client.first_name} {client.last_name}
          </h3>
          <p className="text-sm text-gray-600">{client.email}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
            {category.label}
          </span>
          <div className={`flex items-center ${risk.color}`}>
            {risk.icon}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Actifs</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(client.total_assets)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Patrimoine Net</p>
          <p className={`text-lg font-bold ${client.net_worth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(client.net_worth)}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Liquidités</span>
          <span className="font-medium">{formatCurrency(client.total_bank_assets)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Immobilier</span>
          <span className="font-medium">{formatCurrency(client.total_real_estate)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Assurance Vie</span>
          <span className="font-medium">{formatCurrency(client.total_life_insurance)}</span>
        </div>
      </div>
      
      {client.total_loans > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center">
              <CreditCard className="w-4 h-4 mr-1" />
              Crédits
            </span>
            <span className="text-sm font-medium text-red-600">{formatCurrency(client.total_loans)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const AssetBreakdownChart: React.FC<{ client: PatrimonySummary }> = ({ client }) => {
  const total = client.total_assets;
  const assets = [
    { name: 'Liquidités', value: client.total_bank_assets, color: 'bg-blue-500', lightColor: 'bg-blue-100' },
    { name: 'Immobilier', value: client.total_real_estate, color: 'bg-green-500', lightColor: 'bg-green-100' },
    { name: 'Assurance Vie', value: client.total_life_insurance, color: 'bg-purple-500', lightColor: 'bg-purple-100' },
    { name: 'Entreprise', value: client.total_business_assets, color: 'bg-orange-500', lightColor: 'bg-orange-100' },
    { name: 'Autres', value: client.total_other_assets, color: 'bg-gray-500', lightColor: 'bg-gray-100' }
  ].filter(asset => asset.value > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Répartition du patrimoine - {client.first_name} {client.last_name}
      </h3>
      
      <div className="space-y-4">
        {assets.map((asset, index) => {
          const percentage = total > 0 ? (asset.value / total) * 100 : 0;
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${asset.color} mr-2`}></div>
                  <span className="text-sm font-medium text-gray-700">{asset.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(asset.value)}</span>
                  <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${asset.color} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total des actifs</span>
          <span className="text-lg font-bold text-gray-900">{formatCurrency(total)}</span>
        </div>
        {client.total_loans > 0 && (
          <>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Moins: Crédits</span>
              <span className="text-sm text-red-600">-{formatCurrency(client.total_loans)}</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-900">Patrimoine net</span>
              <span className={`text-lg font-bold ${client.net_worth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(client.net_worth)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PatrimonyAnalysis: React.FC = () => {
  const [patrimonySummaries, setPatrimonySummaries] = useState<PatrimonySummary[]>([]);
  const [assetDistributions, setAssetDistributions] = useState<AssetDistribution[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'clients' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'assets' | 'networth'>('assets');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [loading, setLoading] = useState({
    summaries: true,
    distributions: true
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      setLoading({ summaries: true, distributions: true });
      setError(null);

      // Fetch patrimony summaries
      const { data: summariesData, error: summariesError } = await supabase
        .from('user_patrimony_summary')
        .select('*')
        .order('total_assets', { ascending: false });

      if (summariesError) throw summariesError;

      // Fetch asset distributions
      const { data: distributionsData, error: distributionsError } = await supabase
        .from('asset_distribution')
        .select('*')
        .order('bank_assets', { ascending: false });

      if (distributionsError) throw distributionsError;

      setPatrimonySummaries(summariesData || []);
      setAssetDistributions(distributionsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
    } finally {
      setLoading({ summaries: false, distributions: false });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculs des métriques
  const metrics = useMemo(() => {
    const totalPatrimony = patrimonySummaries.reduce((sum, s) => sum + s.total_assets, 0);
    const averageNetWorth = patrimonySummaries.length > 0 ? 
      patrimonySummaries.reduce((sum, s) => sum + s.net_worth, 0) / patrimonySummaries.length : 0;
    const clientsWithPositiveNetWorth = patrimonySummaries.filter(s => s.net_worth > 0).length;
    const totalLoans = patrimonySummaries.reduce((sum, s) => sum + s.total_loans, 0);

    return [
      {
        title: 'Clients Totaux',
        value: patrimonySummaries.length.toString(),
        change: 8.2,
        changeType: 'increase' as const,
        icon: <Users className="w-6 h-6 text-blue-600" />,
        description: 'Évolution ce mois'
      },
      {
        title: 'Patrimoine Total',
        value: formatCurrency(totalPatrimony),
        change: 12.5,
        changeType: 'increase' as const,
        icon: <Euro className="w-6 h-6 text-green-600" />,
        description: 'Croissance annuelle'
      },
      {
        title: 'Patrimoine Net Moyen',
        value: formatCurrency(averageNetWorth),
        change: 5.3,
        changeType: 'increase' as const,
        icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
        description: 'Par client'
      },
      {
        title: 'Endettement Total',
        value: formatCurrency(totalLoans),
        change: -2.1,
        changeType: 'decrease' as const,
        icon: <CreditCard className="w-6 h-6 text-orange-600" />,
        description: 'Réduction ce trimestre'
      }
    ];
  }, [patrimonySummaries]);

  // Filtrage et tri
  const filteredAndSortedClients = useMemo(() => {
    let filtered = patrimonySummaries.filter(client => 
      `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
          break;
        case 'assets':
          comparison = a.total_assets - b.total_assets;
          break;
        case 'networth':
          comparison = a.net_worth - b.net_worth;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [patrimonySummaries, searchTerm, sortBy, sortOrder]);

  const selectedClientData = patrimonySummaries.find(c => c.user_id === selectedClient);

  const handleRefresh = () => {
    fetchData();
  };

  const handleExportData = () => {
    // Implémentation de l'export des données
    console.log('Exporting data...');
  };

  if (loading.summaries && loading.distributions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données patrimoniales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analyse Patrimoniale</h1>
            <p className="text-sm text-gray-600 mt-1">Vue d'ensemble et gestion du patrimoine client</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleRefresh}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
            <button 
              onClick={handleExportData}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 mt-4">
          {[
            { key: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'clients', label: 'Clients', icon: <Users className="w-4 h-4" /> },
            { key: 'analytics', label: 'Analyses', icon: <PieChart className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedTab === tab.key
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>

        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Graphiques de synthèse */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par catégorie de patrimoine</h3>
                <div className="space-y-4">
                  {['Modeste', 'Moyen', 'Confortable', 'Élevé'].map((category, index) => {
                    const count = patrimonySummaries.filter(c => {
                      const cat = getNetWorthCategory(c.net_worth);
                      return cat.label === category;
                    }).length;
                    const percentage = patrimonySummaries.length > 0 ? (count / patrimonySummaries.length) * 100 : 0;
                    const colors = ['bg-gray-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'];
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${colors[index]} mr-3`}></div>
                          <span className="text-sm font-medium text-gray-700">{category}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className={`h-2 rounded-full ${colors[index]} transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Patrimoines</h3>
                <div className="space-y-3">
                  {patrimonySummaries
                    .sort((a, b) => b.net_worth - a.net_worth)
                    .slice(0, 5)
                    .map((client, index) => (
                      <div key={client.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-semibold text-blue-700">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {client.first_name} {client.last_name}
                            </p>
                            <p className="text-xs text-gray-500">{client.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">{formatCurrency(client.net_worth)}</p>
                          <p className="text-xs text-gray-500">Patrimoine net</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'clients' && (
          <div className="space-y-6">
            {/* Contrôles de recherche et tri */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Nom</option>
                    <option value="assets">Total actifs</option>
                    <option value="networth">Patrimoine net</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                      </div>
                    </button>
                    <button
                      onClick={() => setViewMode('table')}
                      className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <div className="w-4 h-4 flex flex-col gap-0.5">
                        <div className="bg-current h-0.5 rounded-sm"></div>
                        <div className="bg-current h-0.5 rounded-sm"></div>
                        <div className="bg-current h-0.5 rounded-sm"></div>
                        <div className="bg-current h-0.5 rounded-sm"></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des clients */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedClients.map((client) => (
                  <ClientCard
                    key={client.user_id}
                    client={client}
                    onSelect={setSelectedClient}
                    isSelected={selectedClient === client.user_id}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Actifs</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Crédits</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Patrimoine Net</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risque</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAndSortedClients.map((client) => {
                        const category = getNetWorthCategory(client.net_worth);
                        const risk = getRiskLevel(client.net_worth);
                        
                        return (
                          <tr 
                            key={client.user_id} 
                            className={`hover:bg-gray-50 cursor-pointer ${selectedClient === client.user_id ? 'bg-blue-50' : ''}`}
                            onClick={() => setSelectedClient(client.user_id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 font-medium">
                                    {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {client.civilite} {client.first_name} {client.last_name}
                                  </div>
                                  <div className="text-sm text-gray-500">{client.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                              {formatCurrency(client.total_assets)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
                              {client.total_loans > 0 ? formatCurrency(client.total_loans) : '-'}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                              client.net_worth >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatCurrency(client.net_worth)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                                {category.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`mr-2 ${risk.color}`}>{risk.icon}</span>
                                <span className="text-sm text-gray-600">{risk.level}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Détails du client sélectionné */}
            {selectedClientData && (
              <div className="mt-6">
                <AssetBreakdownChart client={selectedClientData} />
              </div>
            )}
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des types d'actifs</h3>
              <div className="h-64">
                {/* Ici vous pourriez intégrer un graphique Pie ou Doughnut avec une librairie comme Chart.js */}
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Graphique des actifs à implémenter</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution du patrimoine</h3>
              <div className="h-64">
                {/* Ici vous pourriez intégrer un graphique Line ou Bar avec une librairie comme Chart.js */}
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Graphique d'évolution à implémenter</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatrimonyAnalysis;
