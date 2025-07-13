import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  AccountCircle as AccountIcon,
  MonetizationOn as IncomeIcon,
  Receipt as TaxIcon,
  Savings as DeductionIcon,
  School as KnowledgeIcon,
  TrendingUp as TrendIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { supabase } from '../../../lib/supabase';

// Enregistrer les composants ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

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
}

const TaxAnalysis: React.FC = () => {
  const theme = useTheme();
  const [taxAnalyses, setTaxAnalyses] = useState<TaxAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTaxOption, setFilterTaxOption] = useState<string>('');
  const [filterFiscalKnowledge, setFilterFiscalKnowledge] = useState<string>('');
  const [filterIncomeCategory, setFilterIncomeCategory] = useState<string>('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // Fetch tax analyses from view
  const fetchTaxAnalyses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tax_analysis')
        .select('*')
        .order('taxable_income', { ascending: false });

      if (error) throw error;
      setTaxAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching tax analyses:', error);
      setSnackbar({
        open: true,
        message: 'Échec du chargement des analyses fiscales',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxAnalyses();
  }, []);

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTaxOptionColor = (option: string) => {
    switch (option) {
      case 'PFU':
        return 'primary';
      case 'Barème IR':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getFiscalKnowledgeColor = (knowledge: string) => {
    switch (knowledge?.toLowerCase()) {
      case 'expert':
      case 'très bonne':
        return 'success';
      case 'bonne':
      case 'moyenne':
        return 'warning';
      case 'faible':
      case 'débutant':
        return 'error';
      default:
        return 'default';
    }
  };

  const getIncomeCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'faible':
        return 'info';
      case 'moyen':
        return 'primary';
      case 'élevé':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredAnalyses = taxAnalyses.filter(analysis => {
    const nameMatch = `${analysis.first_name} ${analysis.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const optionMatch = !filterTaxOption || analysis.tax_option === filterTaxOption;
    const knowledgeMatch = !filterFiscalKnowledge || analysis.fiscal_knowledge === filterFiscalKnowledge;
    const incomeMatch = !filterIncomeCategory || analysis.income_category === filterIncomeCategory;
    
    return nameMatch && optionMatch && knowledgeMatch && incomeMatch;
  });

  // Statistics calculations
  const totalTaxableIncome = taxAnalyses.reduce((sum, analysis) => sum + (analysis.taxable_income || 0), 0);
  const totalWealthTax = taxAnalyses.reduce((sum, analysis) => sum + (analysis.wealth_tax || 0), 0);
  const totalDeductions = taxAnalyses.reduce((sum, analysis) => sum + (analysis.total_tax_deductions || 0), 0);
  const averageIncome = taxAnalyses.length > 0 ? totalTaxableIncome / taxAnalyses.length : 0;

  const taxOptionStats = taxAnalyses.reduce((acc, analysis) => {
    const option = analysis.tax_option || 'Non défini';
    acc[option] = (acc[option] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const fiscalKnowledgeStats = taxAnalyses.reduce((acc, analysis) => {
    const knowledge = analysis.fiscal_knowledge || 'Non défini';
    acc[knowledge] = (acc[knowledge] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const incomeCategoryStats = taxAnalyses.reduce((acc, analysis) => {
    const category = analysis.income_category || 'Non défini';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const usersWithTaxDevices = taxAnalyses.filter(analysis => analysis.uses_tax_devices).length;
  const usersWithHighIncome = taxAnalyses.filter(analysis => analysis.income_category === 'Élevé').length;

  // Chart data for tax option distribution
  const taxOptionChartData = {
    labels: Object.keys(taxOptionStats),
    datasets: [
      {
        data: Object.values(taxOptionStats),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.grey[500],
        ],
        borderColor: [
          theme.palette.primary.dark,
          theme.palette.secondary.dark,
          theme.palette.grey[700],
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for income category distribution
  const incomeCategoryChartData = {
    labels: Object.keys(incomeCategoryStats),
    datasets: [
      {
        data: Object.values(incomeCategoryStats),
        backgroundColor: [
          theme.palette.info.main,
          theme.palette.primary.main,
          theme.palette.warning.main,
          theme.palette.grey[500],
        ],
        borderColor: [
          theme.palette.info.dark,
          theme.palette.primary.dark,
          theme.palette.warning.dark,
          theme.palette.grey[700],
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleRefresh = () => {
    fetchTaxAnalyses();
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analyse Fiscale des Clients
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
                    Clients Analysés
                  </Typography>
                  <Typography variant="h5" component="div">
                    {taxAnalyses.length}
                  </Typography>
                </Box>
                <AccountIcon color="primary" fontSize="large" />
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
                    Revenu Fiscal Moyen
                  </Typography>
                  <Typography variant="h5" component="div">
                    {formatCurrency(averageIncome)}
                  </Typography>
                </Box>
                <IncomeIcon color="primary" fontSize="large" />
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
                    IFI Total
                  </Typography>
                  <Typography variant="h5" component="div">
                    {formatCurrency(totalWealthTax)}
                  </Typography>
                </Box>
                <TaxIcon color="error" fontSize="large" />
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
                    Déductions Totales
                  </Typography>
                  <Typography variant="h5" component="div">
                    {formatCurrency(totalDeductions)}
                  </Typography>
                </Box>
                <DeductionIcon color="success" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Répartition par Option Fiscale
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={taxOptionChartData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Répartition par Catégorie de Revenu
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={incomeCategoryChartData} />
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
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="tax-option-filter">Option Fiscale</InputLabel>
          <Select
            labelId="tax-option-filter"
            value={filterTaxOption}
            onChange={(e) => setFilterTaxOption(e.target.value as string)}
            label="Option Fiscale"
          >
            <MenuItem value="">Toutes les options</MenuItem>
            {Object.keys(taxOptionStats).map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="knowledge-filter">Connaissance Fiscale</InputLabel>
          <Select
            labelId="knowledge-filter"
            value={filterFiscalKnowledge}
            onChange={(e) => setFilterFiscalKnowledge(e.target.value as string)}
            label="Connaissance Fiscale"
          >
            <MenuItem value="">Tous les niveaux</MenuItem>
            {Object.keys(fiscalKnowledgeStats).map(knowledge => (
              <MenuItem key={knowledge} value={knowledge}>{knowledge}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="income-filter">Catégorie Revenu</InputLabel>
          <Select
            labelId="income-filter"
            value={filterIncomeCategory}
            onChange={(e) => setFilterIncomeCategory(e.target.value as string)}
            label="Catégorie Revenu"
          >
            <MenuItem value="">Toutes catégories</MenuItem>
            <MenuItem value="Faible">Faible</MenuItem>
            <MenuItem value="Moyen">Moyen</MenuItem>
            <MenuItem value="Élevé">Élevé</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell align="right">Revenu Fiscal</TableCell>
                  <TableCell>Option Fiscale</TableCell>
                  <TableCell align="right">IFI</TableCell>
                  <TableCell align="right">Déductions</TableCell>
                  <TableCell>Connaissance</TableCell>
                  <TableCell>Dispositifs</TableCell>
                  <TableCell>Catégorie</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAnalyses.length > 0 ? (
                  filteredAnalyses.map((analysis) => (
                    <TableRow key={analysis.user_id} hover>
                      <TableCell>
                        {analysis.first_name} {analysis.last_name}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(analysis.taxable_income)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={analysis.tax_option || 'Non défini'} 
                          color={getTaxOptionColor(analysis.tax_option) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(analysis.wealth_tax)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(analysis.total_tax_deductions)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={analysis.fiscal_knowledge || 'Non défini'} 
                          color={getFiscalKnowledgeColor(analysis.fiscal_knowledge) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={analysis.uses_tax_devices ? 'Oui' : 'Non'} 
                          color={analysis.uses_tax_devices ? 'success' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={analysis.income_category || 'Non défini'} 
                          color={getIncomeCategoryColor(analysis.income_category) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Aucune analyse ne correspond aux critères de recherche
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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

export default TaxAnalysis;