import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { supabase } from '../../../lib/supabase';

// Enregistrer les composants ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

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

// Fonctions de formatage
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

// Composant principal
const PatrimonyAnalysis: React.FC = () => {
  const theme = useTheme();
  const [patrimonySummaries, setPatrimonySummaries] = useState<PatrimonySummary[]>([]);
  const [assetDistributions, setAssetDistributions] = useState<AssetDistribution[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState({
    summaries: true,
    distributions: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Fetch patrimony summaries from view
  const fetchPatrimonySummaries = async () => {
    setLoading(prev => ({ ...prev, summaries: true }));
    try {
      const { data, error } = await supabase
        .from('user_patrimony_summary')
        .select('*')
        .order('total_assets', { ascending: false });

      if (error) throw error;
      setPatrimonySummaries(data || []);
    } catch (error) {
      console.error('Error fetching patrimony summaries:', error);
      setSnackbar({
        open: true,
        message: 'Échec du chargement des données patrimoniales',
        severity: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, summaries: false }));
    }
  };

  // Fetch asset distributions from view
  const fetchAssetDistributions = async () => {
    setLoading(prev => ({ ...prev, distributions: true }));
    try {
      const { data, error } = await supabase
        .from('asset_distribution')
        .select('*')
        .order('bank_assets', { ascending: false });

      if (error) throw error;
      setAssetDistributions(data || []);
    } catch (error) {
      console.error('Error fetching asset distributions:', error);
      setSnackbar({
        open: true,
        message: 'Échec du chargement des répartitions d\'actifs',
        severity: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, distributions: false }));
    }
  };

  useEffect(() => {
    fetchPatrimonySummaries();
    fetchAssetDistributions();
  }, []);

  const getNetWorthCategory = (netWorth: number) => {
    if (netWorth < 100000) return { label: 'Modeste', color: 'default' };
    if (netWorth < 500000) return { label: 'Moyen', color: 'primary' };
    if (netWorth < 1000000) return { label: 'Confortable', color: 'secondary' };
    return { label: 'Élevé', color: 'success' };
  };

  const filteredPatrimonySummaries = patrimonySummaries.filter(summary => {
    const nameMatch = `${summary.first_name} ${summary.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = summary.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return nameMatch || emailMatch;
    if (filter === 'positive') return (nameMatch || emailMatch) && summary.net_worth > 0;
    if (filter === 'negative') return (nameMatch || emailMatch) && summary.net_worth < 0;
    return nameMatch || emailMatch;
  });

  const filteredAssetDistributions = assetDistributions.filter(distribution =>
    `${distribution.first_name} ${distribution.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPatrimony = patrimonySummaries.reduce((sum, summary) => sum + summary.total_assets, 0);
  const averageNetWorth = patrimonySummaries.length > 0 ? 
    patrimonySummaries.reduce((sum, summary) => sum + summary.net_worth, 0) / patrimonySummaries.length : 0;
  const clientsWithPositiveNetWorth = patrimonySummaries.filter(s => s.net_worth > 0).length;

  const selectedClientData = patrimonySummaries.find(c => c.user_id === selectedClient) || 
    assetDistributions.find(c => c.user_id === selectedClient);

  const handleRefresh = () => {
    fetchPatrimonySummaries();
    fetchAssetDistributions();
    setSnackbar({
      open: true,
      message: 'Données actualisées avec succès',
      severity: 'success'
    });
  };

  const handleExportData = () => {
    // Implement export functionality
    setSnackbar({
      open: true,
      message: 'Fonctionnalité d\'export à implémenter',
      severity: 'info'
    });
  };

  // Données pour le graphique de patrimoine
  const patrimonyChartData = {
    labels: patrimonySummaries.map(item => `${item.first_name} ${item.last_name}`),
    datasets: [
      {
        label: 'Actifs Bancaires',
        data: patrimonySummaries.map(item => item.total_bank_assets),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: 'Assurance Vie',
        data: patrimonySummaries.map(item => item.total_life_insurance),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Immobilier',
        data: patrimonySummaries.map(item => item.total_real_estate),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
      },
      {
        label: 'Entreprise',
        data: patrimonySummaries.map(item => item.total_business_assets),
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
      },
      {
        label: 'Autres Actifs',
        data: patrimonySummaries.map(item => item.total_other_assets),
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
      },
    ],
  };

  const patrimonyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Répartition du patrimoine par client',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      }
    }
  };

  // Données pour le graphique de répartition des actifs
  const assetDistributionChartData = selectedClientData ? {
    labels: ['Actifs Bancaires', 'Assurance Vie', 'Immobilier', 'Entreprise', 'Autres Actifs'],
    datasets: [
      {
        data: [
          'bank_percentage' in selectedClientData ? 
            (selectedClientData as AssetDistribution).bank_assets : 
            (selectedClientData as PatrimonySummary).total_bank_assets,
          'bank_percentage' in selectedClientData ? 
            (selectedClientData as AssetDistribution).life_insurance : 
            (selectedClientData as PatrimonySummary).total_life_insurance,
          'bank_percentage' in selectedClientData ? 
            (selectedClientData as AssetDistribution).real_estate : 
            (selectedClientData as PatrimonySummary).total_real_estate,
          'bank_percentage' in selectedClientData ? 
            (selectedClientData as AssetDistribution).business_assets : 
            (selectedClientData as PatrimonySummary).total_business_assets,
          'bank_percentage' in selectedClientData ? 
            (selectedClientData as AssetDistribution).other_assets : 
            (selectedClientData as PatrimonySummary).total_other_assets,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  const assetDistributionChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(value)} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analyse Patrimoniale
        </Typography>
        <Box>
          <Tooltip title="Actualiser les données">
            <IconButton onClick={handleRefresh} color="primary" sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exporter les données">
            <IconButton onClick={handleExportData} color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Clients Totaux
                  </Typography>
                  <Typography variant="h5" component="div">
                    {patrimonySummaries.length}
                  </Typography>
                </Box>
                <TrendingUpIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Patrimoine Total
                  </Typography>
                  <Typography variant="h5" component="div">
                    {formatCurrency(totalPatrimony)}
                  </Typography>
                </Box>
                <PieChartIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Patrimoine Net Moyen
                  </Typography>
                  <Typography variant="h5" component="div">
                    {formatCurrency(averageNetWorth)}
                  </Typography>
                </Box>
                <BarChartIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Clients avec Patrimoine Positif
                  </Typography>
                  <Typography variant="h5" component="div">
                    {clientsWithPositiveNetWorth}
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      ({patrimonySummaries.length > 0 ? Math.round((clientsWithPositiveNetWorth / patrimonySummaries.length) * 100) : 0}%)
                    </Typography>
                  </Typography>
                </Box>
                <TrendingUpIcon color="success" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="filter-label">Filtrer</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={(e) => setFilter(e.target.value as string)}
            label="Filtrer"
            startAdornment={<FilterIcon color="action" />}
          >
            <MenuItem value="all">Tous les clients</MenuItem>
            <MenuItem value="positive">Patrimoine positif</MenuItem>
            <MenuItem value="negative">Patrimoine négatif</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label="Synthèse Patrimoniale" icon={<BarChartIcon />} iconPosition="start" />
          <Tab label="Répartition des Actifs" icon={<PieChartIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {loading.summaries && loading.distributions ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {selectedTab === 0 && (
            <Box>
              <Paper sx={{ mb: 3, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Vue d'ensemble du patrimoine
                </Typography>
                <Bar options={patrimonyChartOptions} data={patrimonyChartData} />
              </Paper>

              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Client</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Actifs Bancaires</TableCell>
                        <TableCell align="right">Assurance Vie</TableCell>
                        <TableCell align="right">Immobilier</TableCell>
                        <TableCell align="right">Entreprise</TableCell>
                        <TableCell align="right">Autres Actifs</TableCell>
                        <TableCell align="right">Total Actifs</TableCell>
                        <TableCell align="right">Crédits</TableCell>
                        <TableCell align="right">Patrimoine Net</TableCell>
                        <TableCell>Catégorie</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPatrimonySummaries.length > 0 ? (
                        filteredPatrimonySummaries.map((summary) => {
                          const category = getNetWorthCategory(summary.net_worth);
                          return (
                            <TableRow 
                              key={summary.user_id} 
                              hover 
                              selected={selectedClient === summary.user_id}
                              onClick={() => setSelectedClient(summary.user_id)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {summary.civilite} {summary.first_name} {summary.last_name}
                                  {summary.net_worth < 0 && (
                                    <Tooltip title="Patrimoine net négatif">
                                      <InfoIcon color="error" fontSize="small" sx={{ ml: 1 }} />
                                    </Tooltip>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>{summary.email}</TableCell>
                              <TableCell align="right">{formatCurrency(summary.total_bank_assets)}</TableCell>
                              <TableCell align="right">{formatCurrency(summary.total_life_insurance)}</TableCell>
                              <TableCell align="right">{formatCurrency(summary.total_real_estate)}</TableCell>
                              <TableCell align="right">{formatCurrency(summary.total_business_assets)}</TableCell>
                              <TableCell align="right">{formatCurrency(summary.total_other_assets)}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                {formatCurrency(summary.total_assets)}
                              </TableCell>
                              <TableCell align="right" sx={{ color: 'error.main' }}>
                                {formatCurrency(summary.total_loans)}
                              </TableCell>
                              <TableCell align="right" sx={{ 
                                fontWeight: 'bold',
                                color: summary.net_worth >= 0 ? 'success.main' : 'error.main'
                              }}>
                                {formatCurrency(summary.net_worth)}
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={category.label} 
                                  color={category.color as any}
                                  size="small"
                                  variant="outlined"
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} align="center">
                            Aucun client trouvé
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          )}

          {selectedTab === 1 && (
            <Box>
              {selectedClientData && assetDistributionChartData && (
                <Paper sx={{ mb: 3, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Répartition des actifs pour {selectedClientData.first_name} {selectedClientData.last_name}
                  </Typography>
                  <Pie options={assetDistributionChartOptions} data={assetDistributionChartData} />
                </Paper>
              )}

              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Client</TableCell>
                        <TableCell align="right">Actifs Bancaires</TableCell>
                        <TableCell align="right">%</TableCell>
                        <TableCell align="right">Assurance Vie</TableCell>
                        <TableCell align="right">%</TableCell>
                        <TableCell align="right">Immobilier</TableCell>
                        <TableCell align="right">%</TableCell>
                        <TableCell align="right">Entreprise</TableCell>
                        <TableCell align="right">%</TableCell>
                        <TableCell align="right">Autres</TableCell>
                        <TableCell align="right">%</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAssetDistributions.length > 0 ? (
                        filteredAssetDistributions.map((distribution) => (
                          <TableRow 
                            key={distribution.user_id} 
                            hover 
                            selected={selectedClient === distribution.user_id}
                            onClick={() => setSelectedClient(distribution.user_id)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell>
                              {distribution.first_name} {distribution.last_name}
                            </TableCell>
                            <TableCell align="right">{formatCurrency(distribution.bank_assets)}</TableCell>
                            <TableCell align="right">
                              {distribution.bank_percentage !== null ? formatPercentage(distribution.bank_percentage) : 'N/A'}
                            </TableCell>
                            <TableCell align="right">{formatCurrency(distribution.life_insurance)}</TableCell>
                            <TableCell align="right">
                              {distribution.life_insurance_percentage !== null ? formatPercentage(distribution.life_insurance_percentage) : 'N/A'}
                            </TableCell>
                            <TableCell align="right">{formatCurrency(distribution.real_estate)}</TableCell>
                            <TableCell align="right">
                              {distribution.real_estate_percentage !== null ? formatPercentage(distribution.real_estate_percentage) : 'N/A'}
                            </TableCell>
                            <TableCell align="right">{formatCurrency(distribution.business_assets)}</TableCell>
                            <TableCell align="right">
                              {distribution.business_assets_percentage !== null ? formatPercentage(distribution.business_assets_percentage) : 'N/A'}
                            </TableCell>
                            <TableCell align="right">{formatCurrency(distribution.other_assets)}</TableCell>
                            <TableCell align="right">
                              {distribution.other_assets_percentage !== null ? formatPercentage(distribution.other_assets_percentage) : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={11} align="center">
                            Aucun client trouvé
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatrimonyAnalysis;