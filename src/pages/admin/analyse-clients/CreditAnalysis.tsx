import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
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
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  FilterAlt as FilterIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  TrendingUp as TrendingUpIcon,
  CreditCard as CreditCardIcon,
  Percent as PercentIcon,
  People as PeopleIcon,
  Euro as EuroIcon,
  Scale as ScaleIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { supabase } from './../../../lib/supabase';

interface CreditAnalysis {
  user_id: string;
  last_name: string;
  first_name: string;
  credit_count: number;
  total_initial_amount: number;
  total_remaining_capital: number;
  total_monthly_payment: number;
  total_insurance: number;
  average_rate: number;
  credit_situation: string;
  monthly_payment_category: string;
}

const CreditAnalysis: React.FC = () => {
  const [creditAnalyses, setCreditAnalyses] = useState<CreditAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHasCredit, setFilterHasCredit] = useState<string>('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Fetch credit analyses from view
  useEffect(() => {
    const fetchCreditAnalyses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('credit_analysis')
          .select('*')
          .order('total_remaining_capital', { ascending: false });

        if (error) throw error;
        setCreditAnalyses(data || []);
      } catch (error) {
        console.error('Error fetching credit analyses:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch credit analysis data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCreditAnalyses();
  }, []);

  // Helper functions
  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return '0 €';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    if (rate === null || rate === undefined) return 'N/A';
    return `${rate.toFixed(2)}%`;
  };

  const getCreditSituationColor = (situation: string) => {
    switch (situation) {
      case 'Aucun crédit':
        return 'success';
      case 'Un crédit':
        return 'primary';
      case 'Plusieurs crédits':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getMonthlyPaymentCategoryColor = (category: string) => {
    switch (category) {
      case 'Aucune mensualité':
        return 'success';
      case 'Faible charge':
        return 'info';
      case 'Charge modérée':
        return 'warning';
      case 'Forte charge':
        return 'error';
      default:
        return 'default';
    }
  };

  const getDebtLevel = (remainingCapital: number) => {
    if (remainingCapital === 0) return { label: 'Aucune dette', color: 'success' };
    if (remainingCapital < 50000) return { label: 'Faible dette', color: 'info' };
    if (remainingCapital < 200000) return { label: 'Dette modérée', color: 'warning' };
    return { label: 'Forte dette', color: 'error' };
  };

  // Filter analyses
  const filteredAnalyses = creditAnalyses.filter(analysis => {
    const nameMatch = `${analysis.first_name} ${analysis.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const creditMatch = !filterHasCredit || 
      (filterHasCredit === 'true' && analysis.credit_count > 0) ||
      (filterHasCredit === 'false' && analysis.credit_count === 0);
    
    return nameMatch && creditMatch;
  });

  // Statistics calculations
  const totalInitialAmount = creditAnalyses.reduce((sum, analysis) => sum + (analysis.total_initial_amount || 0), 0);
  const totalRemainingCapital = creditAnalyses.reduce((sum, analysis) => sum + (analysis.total_remaining_capital || 0), 0);
  const totalMonthlyPayments = creditAnalyses.reduce((sum, analysis) => sum + (analysis.total_monthly_payment || 0), 0);
  const totalInsurance = creditAnalyses.reduce((sum, analysis) => sum + (analysis.total_insurance || 0), 0);

  const averageInitialAmount = creditAnalyses.length > 0 ? totalInitialAmount / creditAnalyses.length : 0;
  const averageRemainingCapital = creditAnalyses.length > 0 ? totalRemainingCapital / creditAnalyses.length : 0;
  const averageMonthlyPayment = creditAnalyses.length > 0 ? totalMonthlyPayments / creditAnalyses.length : 0;
  const averageRate = creditAnalyses.filter(a => a.average_rate > 0).length > 0 ? 
    creditAnalyses.filter(a => a.average_rate > 0).reduce((sum, a) => sum + a.average_rate, 0) / 
    creditAnalyses.filter(a => a.average_rate > 0).length : 0;

  const usersWithCredit = creditAnalyses.filter(analysis => analysis.credit_count > 0).length;
  const totalRepaymentProgress = totalInitialAmount > 0 ? ((totalInitialAmount - totalRemainingCapital) / totalInitialAmount) * 100 : 0;

  // Distribution statistics
  const creditSituationStats = creditAnalyses.reduce((acc, analysis) => {
    const situation = analysis.credit_situation || 'Non défini';
    acc[situation] = (acc[situation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyPaymentCategoryStats = creditAnalyses.reduce((acc, analysis) => {
    const category = analysis.monthly_payment_category || 'Non défini';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterHasCredit('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analyse des Crédits Clients
        </Typography>
        <Box>
          <Tooltip title="Réinitialiser les filtres">
            <IconButton onClick={handleClearFilters} color="primary">
              <ClearIcon />
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
                  <Typography color="textSecondary" gutterBottom>
                    Total Clients
                  </Typography>
                  <Typography variant="h5">
                    {creditAnalyses.length}
                  </Typography>
                </Box>
                <PeopleIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Clients avec Crédit
                  </Typography>
                  <Typography variant="h5">
                    {usersWithCredit} ({creditAnalyses.length > 0 ? ((usersWithCredit / creditAnalyses.length) * 100).toFixed(1) : 0}%)
                  </Typography>
                </Box>
                <CreditCardIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Taux Moyen
                  </Typography>
                  <Typography variant="h5">
                    {formatPercentage(averageRate)}
                  </Typography>
                </Box>
                <PercentIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Capital Restant
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(totalRemainingCapital)}
                  </Typography>
                </Box>
                <EuroIcon color="error" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Financial Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Capital Initial Total
              </Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(totalInitialAmount)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Moyenne: {formatCurrency(averageInitialAmount)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Mensualités Totales
              </Typography>
              <Typography variant="h6" color="warning.main">
                {formatCurrency(totalMonthlyPayments)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Moyenne: {formatCurrency(averageMonthlyPayment)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Assurances Totales
              </Typography>
              <Typography variant="h6" color="info.main">
                {formatCurrency(totalInsurance)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Moyenne: {formatCurrency(creditAnalyses.length > 0 ? totalInsurance / creditAnalyses.length : 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Progression Remboursement
              </Typography>
              <Typography variant="h6" color={totalRepaymentProgress > 50 ? 'success' : 'warning'}>
                {totalRepaymentProgress.toFixed(1)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={totalRepaymentProgress} 
                color={totalRepaymentProgress > 50 ? 'success' : 'warning'}
                sx={{ height: 8, mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Distribution Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Répartition des Situations de Crédit
              </Typography>
              {Object.entries(creditSituationStats).map(([situation, count]) => (
                <Box key={situation} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      <Chip 
                        label={situation} 
                        size="small" 
                        color={getCreditSituationColor(situation) as any}
                        sx={{ mr: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2">
                      {count} ({creditAnalyses.length > 0 ? ((count / creditAnalyses.length) * 100).toFixed(1) : 0}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(count / creditAnalyses.length) * 100}
                    color={getCreditSituationColor(situation) as any}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Répartition des Charges de Remboursement
              </Typography>
              {Object.entries(monthlyPaymentCategoryStats).map(([category, count]) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      <Chip 
                        label={category} 
                        size="small" 
                        color={getMonthlyPaymentCategoryColor(category) as any}
                        sx={{ mr: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2">
                      {count} ({creditAnalyses.length > 0 ? ((count / creditAnalyses.length) * 100).toFixed(1) : 0}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(count / creditAnalyses.length) * 100}
                    color={getMonthlyPaymentCategoryColor(category) as any}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Rechercher un client"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Statut Crédit</InputLabel>
            <Select
              value={filterHasCredit}
              label="Statut Crédit"
              onChange={(e) => setFilterHasCredit(e.target.value as string)}
            >
              <MenuItem value="">Tous les clients</MenuItem>
              <MenuItem value="true">Avec crédit(s)</MenuItem>
              <MenuItem value="false">Sans crédit</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Data Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell align="center">Nb Crédits</TableCell>
                  <TableCell align="right">Montant Initial</TableCell>
                  <TableCell align="right">Capital Restant</TableCell>
                  <TableCell align="right">Mensualité</TableCell>
                  <TableCell align="right">Assurance</TableCell>
                  <TableCell align="center">Taux Moyen</TableCell>
                  <TableCell>Niveau Dette</TableCell>
                  <TableCell>Charge</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAnalyses.length > 0 ? (
                  filteredAnalyses.map((analysis) => {
                    const debtLevel = getDebtLevel(analysis.total_remaining_capital);
                    
                    return (
                      <TableRow key={analysis.user_id} hover>
                        <TableCell>
                          {analysis.first_name} {analysis.last_name}
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={analysis.credit_count} 
                            color={analysis.credit_count > 0 ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(analysis.total_initial_amount)}
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          color: analysis.total_remaining_capital > 0 ? 'error.main' : 'text.primary',
                          fontWeight: analysis.total_remaining_capital > 0 ? 'bold' : 'normal'
                        }}>
                          {formatCurrency(analysis.total_remaining_capital)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(analysis.total_monthly_payment)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(analysis.total_insurance)}
                        </TableCell>
                        <TableCell align="center">
                          {analysis.average_rate ? (
                            <Chip 
                              label={formatPercentage(analysis.average_rate)} 
                              size="small"
                              variant="outlined"
                            />
                          ) : (
                            <Chip 
                              label="N/A" 
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={debtLevel.label} 
                            color={debtLevel.color as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={analysis.monthly_payment_category} 
                            color={getMonthlyPaymentCategoryColor(analysis.monthly_payment_category) as any}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">
                        Aucun résultat trouvé
                      </Typography>
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

export default CreditAnalysis;