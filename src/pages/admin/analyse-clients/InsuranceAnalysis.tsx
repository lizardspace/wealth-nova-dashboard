import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  Tooltip,
  useTheme,
  Skeleton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Shield as ShieldIcon,
  Favorite as FavoriteIcon,
  MonetizationOn as MonetizationOnIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { supabase } from './../../../lib/supabase';
import { useConfirm } from 'material-ui-confirm';
import { visuallyHidden } from '@mui/utils';

interface InsuranceAnalysis {
  user_id: string;
  last_name: string;
  first_name: string;
  life_insurance_count: number;
  total_life_insurance_value: number;
  prevoyance_count: number;
  total_death_capital: number;
  total_monthly_death_pension: number;
  total_annual_premium: number;
  life_insurance_category: string;
  life_insurance_value_category: string;
}

const InsuranceAnalysis: React.FC = () => {
  const theme = useTheme();
  const confirm = useConfirm();
  const [insuranceAnalyses, setInsuranceAnalyses] = useState<InsuranceAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<InsuranceAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHasLifeInsurance, setFilterHasLifeInsurance] = useState<string>('');
  const [filterHasPrevoyance, setFilterHasPrevoyance] = useState<string>('');
  const [filterLifeInsuranceCategory, setFilterLifeInsuranceCategory] = useState<string>('');
  const [filterLifeInsuranceValueCategory, setFilterLifeInsuranceValueCategory] = useState<string>('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Fetch insurance analyses from view
  const fetchInsuranceAnalyses = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('insurance_analysis')
        .select('*')
        .order('total_life_insurance_value', { ascending: false });

      if (error) throw error;
      setInsuranceAnalyses(data || []);
      setFilteredAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching insurance analyses:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch insurance analysis data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsuranceAnalyses();
  }, []);

  // Apply filters whenever any filter changes
  useEffect(() => {
    const filtered = insuranceAnalyses.filter(analysis => {
      const nameMatch = `${analysis.first_name} ${analysis.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const lifeInsuranceMatch = !filterHasLifeInsurance || 
        (filterHasLifeInsurance === 'true' && analysis.life_insurance_count > 0) ||
        (filterHasLifeInsurance === 'false' && analysis.life_insurance_count === 0);
      
      const prevoyanceMatch = !filterHasPrevoyance || 
        (filterHasPrevoyance === 'true' && analysis.prevoyance_count > 0) ||
        (filterHasPrevoyance === 'false' && analysis.prevoyance_count === 0);
      
      const lifeInsuranceCategoryMatch = !filterLifeInsuranceCategory || 
        analysis.life_insurance_category === filterLifeInsuranceCategory;
      
      const lifeInsuranceValueCategoryMatch = !filterLifeInsuranceValueCategory || 
        analysis.life_insurance_value_category === filterLifeInsuranceValueCategory;
      
      return nameMatch && lifeInsuranceMatch && prevoyanceMatch && 
             lifeInsuranceCategoryMatch && lifeInsuranceValueCategoryMatch;
    });
    
    setFilteredAnalyses(filtered);
  }, [
    searchTerm, 
    filterHasLifeInsurance, 
    filterHasPrevoyance, 
    filterLifeInsuranceCategory, 
    filterLifeInsuranceValueCategory, 
    insuranceAnalyses
  ]);

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getInsuranceCoverageLevel = (deathCapital: number, lifeInsuranceValue: number) => {
    const totalCoverage = (deathCapital || 0) + (lifeInsuranceValue || 0);
    if (totalCoverage === 0) return { label: 'Aucune couverture', color: 'error' };
    if (totalCoverage < 100000) return { label: 'Couverture faible', color: 'warning' };
    if (totalCoverage < 500000) return { label: 'Couverture moyenne', color: 'info' };
    if (totalCoverage < 1000000) return { label: 'Couverture élevée', color: 'success' };
    return { label: 'Couverture très élevée', color: 'success' };
  };

  const getPremiumCategory = (premium: number) => {
    if (premium === null || premium === undefined || premium === 0) return { label: 'Aucune prime', color: 'default' };
    if (premium < 1000) return { label: 'Prime faible', color: 'success' };
    if (premium < 5000) return { label: 'Prime moyenne', color: 'info' };
    if (premium < 10000) return { label: 'Prime élevée', color: 'warning' };
    return { label: 'Prime très élevée', color: 'error' };
  };

  // Statistics calculations
  const totalLifeInsuranceValue = insuranceAnalyses.reduce((sum, analysis) => sum + (analysis.total_life_insurance_value || 0), 0);
  const totalDeathCapital = insuranceAnalyses.reduce((sum, analysis) => sum + (analysis.total_death_capital || 0), 0);
  const totalAnnualPremiums = insuranceAnalyses.reduce((sum, analysis) => sum + (analysis.total_annual_premium || 0), 0);
  const averageLifeInsuranceValue = insuranceAnalyses.length > 0 ? totalLifeInsuranceValue / insuranceAnalyses.length : 0;
  const averageDeathCapital = insuranceAnalyses.length > 0 ? totalDeathCapital / insuranceAnalyses.length : 0;
  const averageAnnualPremium = insuranceAnalyses.length > 0 ? totalAnnualPremiums / insuranceAnalyses.length : 0;

  const usersWithLifeInsurance = insuranceAnalyses.filter(analysis => analysis.life_insurance_count > 0).length;
  const usersWithPrevoyance = insuranceAnalyses.filter(analysis => analysis.prevoyance_count > 0).length;
  const usersWithBothInsurances = insuranceAnalyses.filter(analysis => 
    analysis.life_insurance_count > 0 && analysis.prevoyance_count > 0
  ).length;

  // Coverage level distribution
  const coverageLevelStats = insuranceAnalyses.reduce((acc, analysis) => {
    const level = getInsuranceCoverageLevel(analysis.total_death_capital, analysis.total_life_insurance_value);
    acc[level.label] = (acc[level.label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Premium category distribution
  const premiumCategoryStats = insuranceAnalyses.reduce((acc, analysis) => {
    const category = getPremiumCategory(analysis.total_annual_premium);
    acc[category.label] = (acc[category.label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleRefresh = async () => {
    await fetchInsuranceAnalyses();
    setSnackbar({
      open: true,
      message: 'Données actualisées avec succès',
      severity: 'success'
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterHasLifeInsurance('');
    setFilterHasPrevoyance('');
    setFilterLifeInsuranceCategory('');
    setFilterLifeInsuranceValueCategory('');
  };

  const lifeInsuranceCategories = [
    { value: '', label: 'Toutes' },
    { value: 'Aucune', label: 'Aucune assurance vie' },
    { value: 'Une', label: 'Une assurance vie' },
    { value: 'Deux', label: 'Deux assurances vie' },
    { value: 'Plusieurs', label: 'Plusieurs assurances vie' }
  ];

  const lifeInsuranceValueCategories = [
    { value: '', label: 'Toutes' },
    { value: 'Aucune', label: 'Aucune valeur' },
    { value: 'Faible', label: 'Valeur faible (<50k€)' },
    { value: 'Moyenne', label: 'Valeur moyenne (50k-200k€)' },
    { value: 'Élevée', label: 'Valeur élevée (>200k€)' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analyse des Assurances
        </Typography>
        <Box>
          <Tooltip title="Actualiser les données">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              <RefreshIcon color={refreshing ? 'disabled' : 'primary'} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="subtitle2">
                    Total Clients
                  </Typography>
                  <Typography variant="h4" component="div">
                    {loading ? <Skeleton width={60} /> : insuranceAnalyses.length}
                  </Typography>
                </Box>
                <PeopleIcon fontSize="large" color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="subtitle2">
                    Assurance Vie
                  </Typography>
                  <Typography variant="h4" component="div">
                    {loading ? (
                      <Skeleton width={100} />
                    ) : (
                      `${usersWithLifeInsurance} (${((usersWithLifeInsurance / insuranceAnalyses.length) * 100 || 0).toFixed(1)}%)`
                    )}
                  </Typography>
                </Box>
                <ShieldIcon fontSize="large" color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="subtitle2">
                    Prévoyance
                  </Typography>
                  <Typography variant="h4" component="div">
                    {loading ? (
                      <Skeleton width={100} />
                    ) : (
                      `${usersWithPrevoyance} (${((usersWithPrevoyance / insuranceAnalyses.length) * 100 || 0).toFixed(1)}%)`
                    )}
                  </Typography>
                </Box>
                <FavoriteIcon fontSize="large" color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="subtitle2">
                    Couverture Complète
                  </Typography>
                  <Typography variant="h4" component="div">
                    {loading ? (
                      <Skeleton width={100} />
                    ) : (
                      `${usersWithBothInsurances} (${((usersWithBothInsurances / insuranceAnalyses.length) * 100 || 0).toFixed(1)}%)`
                    )}
                  </Typography>
                </Box>
                <MonetizationOnIcon fontSize="large" color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Average Values Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2">
                Valeur Assurance Vie Moyenne
              </Typography>
              <Typography variant="h5" color="primary">
                {loading ? <Skeleton /> : formatCurrency(averageLifeInsuranceValue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2">
                Capital Décès Moyen
              </Typography>
              <Typography variant="h5" color="primary">
                {loading ? <Skeleton /> : formatCurrency(averageDeathCapital)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2">
                Prime Annuelle Moyenne
              </Typography>
              <Typography variant="h5" color="primary">
                {loading ? <Skeleton /> : formatCurrency(averageAnnualPremium)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2">
                Total Primes Annuelles
              </Typography>
              <Typography variant="h5" color="primary">
                {loading ? <Skeleton /> : formatCurrency(totalAnnualPremiums)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Distribution Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader 
              title="Répartition par Niveau de Couverture" 
              avatar={<BarChartIcon color="primary" />}
            />
            <CardContent>
              {loading ? (
                <Box sx={{ width: '100%' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="rectangular" height={10} />
                    </Box>
                  ))}
                </Box>
              ) : (
                Object.entries(coverageLevelStats).map(([level, count]) => (
                  <Box key={level} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{level}</Typography>
                      <Typography variant="body2">
                        {count} ({((count / insuranceAnalyses.length) * 100 || 0).toFixed(1)}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(count / insuranceAnalyses.length) * 100}
                      color={getInsuranceCoverageLevel(0, 0).color as any}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader 
              title="Répartition par Catégorie de Prime" 
              avatar={<PieChartIcon color="primary" />}
            />
            <CardContent>
              {loading ? (
                <Box sx={{ width: '100%' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="rectangular" height={10} />
                    </Box>
                  ))}
                </Box>
              ) : (
                Object.entries(premiumCategoryStats).map(([category, count]) => (
                  <Box key={category} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{category}</Typography>
                      <Typography variant="body2">
                        {count} ({((count / insuranceAnalyses.length) * 100 || 0).toFixed(1)}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(count / insuranceAnalyses.length) * 100}
                      color={getPremiumCategory(0).color as any}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card elevation={1} sx={{ mb: 3 }}>
        <CardHeader 
          title="Filtres" 
          avatar={<FilterIcon color="action" />}
          action={
            <Button 
              size="small" 
              onClick={handleClearFilters}
              disabled={!searchTerm && !filterHasLifeInsurance && !filterHasPrevoyance && !filterLifeInsuranceCategory && !filterLifeInsuranceValueCategory}
            >
              Réinitialiser
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Rechercher un client"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Assurance Vie</InputLabel>
                <Select
                  value={filterHasLifeInsurance}
                  label="Assurance Vie"
                  onChange={(e) => setFilterHasLifeInsurance(e.target.value)}
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="true">Avec Assurance Vie</MenuItem>
                  <MenuItem value="false">Sans Assurance Vie</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Prévoyance</InputLabel>
                <Select
                  value={filterHasPrevoyance}
                  label="Prévoyance"
                  onChange={(e) => setFilterHasPrevoyance(e.target.value)}
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="true">Avec Prévoyance</MenuItem>
                  <MenuItem value="false">Sans Prévoyance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Catégorie Assurance Vie</InputLabel>
                <Select
                  value={filterLifeInsuranceCategory}
                  label="Catégorie Assurance Vie"
                  onChange={(e) => setFilterLifeInsuranceCategory(e.target.value)}
                >
                  {lifeInsuranceCategories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Catégorie Valeur</InputLabel>
                <Select
                  value={filterLifeInsuranceValueCategory}
                  label="Catégorie Valeur"
                  onChange={(e) => setFilterLifeInsuranceValueCategory(e.target.value)}
                >
                  {lifeInsuranceValueCategories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">
          {filteredAnalyses.length} résultat{filteredAnalyses.length !== 1 ? 's' : ''} trouvé{filteredAnalyses.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ width: '100%' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 1 }} />
          ))}
        </Box>
      ) : (
        <Paper elevation={2} sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nb Assurance Vie</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Valeur Assurance Vie</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nb Prévoyance</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Capital Décès</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rente Décès Mensuelle</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Prime Annuelle</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Niveau Couverture</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Catégorie Prime</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAnalyses.length > 0 ? (
                  filteredAnalyses.map((analysis) => {
                    const coverageLevel = getInsuranceCoverageLevel(
                      analysis.total_death_capital, 
                      analysis.total_life_insurance_value
                    );
                    const premiumCategory = getPremiumCategory(analysis.total_annual_premium);
                    
                    return (
                      <TableRow 
                        key={analysis.user_id}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {analysis.first_name} {analysis.last_name}
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={analysis.life_insurance_count} 
                            color={analysis.life_insurance_count > 0 ? 'primary' : 'default'}
                            size="small"
                            variant={analysis.life_insurance_count > 0 ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(analysis.total_life_insurance_value)}
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={analysis.prevoyance_count} 
                            color={analysis.prevoyance_count > 0 ? 'secondary' : 'default'}
                            size="small"
                            variant={analysis.prevoyance_count > 0 ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(analysis.total_death_capital)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(analysis.total_monthly_death_pension)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(analysis.total_annual_premium)}
                        </TableCell>
                        <TableCell>
                          <Tooltip title={`Capital décès: ${formatCurrency(analysis.total_death_capital)}\nAssurance vie: ${formatCurrency(analysis.total_life_insurance_value)}`}>
                            <Chip 
                              label={coverageLevel.label} 
                              color={coverageLevel.color as any}
                              size="small"
                              variant="filled"
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={premiumCategory.label} 
                            color={premiumCategory.color as any}
                            size="small"
                            variant="filled"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">
                        Aucun résultat trouvé avec les filtres actuels
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InsuranceAnalysis;