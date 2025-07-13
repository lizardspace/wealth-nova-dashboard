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
  Card,
  CardContent,
  CardHeader,
  Chip,
  LinearProgress,
  useTheme,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  LocalGroceryStore as FoodIcon,
  SportsSoccer as LeisureIcon,
  HealthAndSafety as HealthIcon,
  School as EducationIcon,
  Receipt as ChargesIcon,
  MoreHoriz as MiscIcon,
  Savings as InsuranceIcon,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon,
  Equalizer as EqualIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';

// Fonctions de formattage intégrées
const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '0,00 €';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '0%';
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100); // Division par 100 car le composant attend des valeurs entre 0 et 1
};

interface BudgetLifestyle {
  user_id: string;
  last_name: string;
  first_name: string;
  rent: number;
  housing_charges: number;
  insurance: number;
  transport: number;
  food: number;
  leisure: number;
  education: number;
  health: number;
  miscellaneous: number;
  total_expenses: number;
  budgeted_expenses: number;
  difference: number;
  budget_coverage_percentage: number;
}

const BudgetLifestyle: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [budgetLifestyles, setBudgetLifestyles] = useState<BudgetLifestyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [stats, setStats] = useState({
    totalClients: 0,
    avgExpenses: 0,
    avgBudget: 0,
    avgDifference: 0,
    totalExpenses: 0,
    totalBudgeted: 0
  });

  const expenseCategories = [
    { key: 'rent', label: 'Loyer', icon: HomeIcon, color: theme.palette.primary.main },
    { key: 'housing_charges', label: 'Charges', icon: ChargesIcon, color: theme.palette.info.main },
    { key: 'insurance', label: 'Assurances', icon: InsuranceIcon, color: theme.palette.warning.main },
    { key: 'transport', label: 'Transport', icon: CarIcon, color: theme.palette.error.main },
    { key: 'food', label: 'Alimentation', icon: FoodIcon, color: theme.palette.success.main },
    { key: 'leisure', label: 'Loisirs', icon: LeisureIcon, color: theme.palette.secondary.main },
    { key: 'education', label: 'Études', icon: EducationIcon, color: theme.palette.info.dark },
    { key: 'health', label: 'Santé', icon: HealthIcon, color: theme.palette.error.dark },
    { key: 'miscellaneous', label: 'Divers', icon: MiscIcon, color: theme.palette.text.secondary }
  ];

  useEffect(() => {
    const fetchBudgetLifestyles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('budget_lifestyle')
          .select('*')
          .order('total_expenses', { ascending: false });

        if (error) throw error;

        setBudgetLifestyles(data || []);

        const totalExpenses = data.reduce((sum, budget) => sum + (budget.total_expenses || 0), 0);
        const avgExpenses = data.length > 0 ? totalExpenses / data.length : 0;
        const totalBudgeted = data.reduce((sum, budget) => sum + (budget.budgeted_expenses || 0), 0);
        const avgBudget = data.length > 0 ? totalBudgeted / data.length : 0;
        const avgDifference = data.length > 0 ? 
          data.reduce((sum, budget) => sum + (budget.difference || 0), 0) / data.length : 0;

        setStats({
          totalClients: data.length,
          avgExpenses,
          avgBudget,
          avgDifference,
          totalExpenses,
          totalBudgeted
        });

      } catch (err) {
        console.error('Error fetching budget lifestyle data:', err);
        setError('Échec du chargement des données budget');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetLifestyles();
  }, []);

  const calculateCategoryAverages = () => {
    if (budgetLifestyles.length === 0) return {};
    return expenseCategories.reduce((acc, category) => {
      const total = budgetLifestyles.reduce(
        (sum, budget) => sum + (budget[category.key as keyof BudgetLifestyle] || 0), 0
      );
      return {
        ...acc,
        [category.key]: total / budgetLifestyles.length
      };
    }, {} as Record<string, number>);
  };

  const categoryAverages = calculateCategoryAverages();
  const filteredBudgets = budgetLifestyles.filter(budget =>
    `${budget.first_name} ${budget.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getExpenseCategory = (totalExpenses: number) => {
    if (!totalExpenses) return { label: 'Non renseigné', color: 'default' };
    if (totalExpenses < 1500) return { label: 'Très modeste', color: 'info' };
    if (totalExpenses < 2500) return { label: 'Modeste', color: 'primary' };
    if (totalExpenses < 4000) return { label: 'Moyen', color: 'warning' };
    if (totalExpenses < 6000) return { label: 'Confortable', color: 'success' };
    return { label: 'Élevé', color: 'error' };
  };

  const handleRowClick = (userId: string) => {
    navigate(`/clients/${userId}/budget`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6">Chargement des données budget...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Budget et Train de Vie
        </Typography>
        <Box>
          <Tooltip title="Aide et informations">
            <IconButton onClick={() => navigate('/help/budget-analysis')}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 2 }}>
                  <BarChartIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Clients analysés
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalClients}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.light, mr: 2 }}>
                  <EqualIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Dépenses moyennes
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(stats.avgExpenses)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.info.light, mr: 2 }}>
                  <PieChartIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Budget moyen
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(stats.avgBudget)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: stats.avgDifference >= 0 ? 
                    theme.palette.success.light : 
                    theme.palette.error.light, 
                  mr: 2 
                }}>
                  {stats.avgDifference >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Écart moyen
                  </Typography>
                  <Typography variant="h5" sx={{ 
                    color: stats.avgDifference >= 0 ? 'success.main' : 'error.main'
                  }}>
                    {formatCurrency(stats.avgDifference)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Expense Categories Overview */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardHeader 
          title="Répartition moyenne des dépenses" 
          subheader="Analyse par catégorie de dépenses"
        />
        <CardContent>
          <Grid container spacing={2}>
            {expenseCategories.map((category) => {
              const Icon = category.icon;
              const average = categoryAverages[category.key as keyof typeof categoryAverages] || 0;
              const percentage = stats.avgExpenses > 0 ? (average / stats.avgExpenses) * 100 : 0;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={category.key}>
                  <Box sx={{ 
                    p: 2, 
                    border: 1, 
                    borderColor: 'divider', 
                    borderRadius: 1,
                    '&:hover': {
                      boxShadow: 2,
                      borderColor: category.color
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Icon sx={{ color: category.color, mr: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {category.label}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ color: category.color }}>
                        {formatCurrency(average)}
                      </Typography>
                      <Chip 
                        label={`${percentage.toFixed(1)}%`}
                        size="small"
                        sx={{ 
                          backgroundColor: `${category.color}20`,
                          color: category.color
                        }}
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(percentage, 100)}
                      sx={{ 
                        mt: 1, 
                        height: 6,
                        borderRadius: 3,
                        '& .MuiLinearProgress-bar': { 
                          backgroundColor: category.color 
                        } 
                      }}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Search and Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher un client..."
          size="small"
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 350 }}
        />
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ 
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main
            }
          }}
        >
          <Tab label="Vue synthèse" />
          <Tab label="Détail des dépenses" />
          <Tab label="Analyse budgétaire" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Loyer</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Transport</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Alimentation</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Loisirs</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Dépenses</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Budget</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Écart</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Couverture</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Profil</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBudgets.map((budget) => {
                  const category = getExpenseCategory(budget.total_expenses);
                  return (
                    <TableRow 
                      key={budget.user_id}
                      hover
                      onClick={() => handleRowClick(budget.user_id)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight="medium">
                          {budget.first_name} {budget.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(budget.rent)}</TableCell>
                      <TableCell align="right">{formatCurrency(budget.transport)}</TableCell>
                      <TableCell align="right">{formatCurrency(budget.food)}</TableCell>
                      <TableCell align="right">{formatCurrency(budget.leisure)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(budget.total_expenses)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(budget.budgeted_expenses)}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          icon={budget.difference >= 0 ? <TrendUpIcon fontSize="small" /> : <TrendDownIcon fontSize="small" />}
                          label={formatCurrency(budget.difference)}
                          color={budget.difference >= 0 ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(budget.budget_coverage_percentage || 0, 100)}
                          sx={{ 
                            height: 6,
                            borderRadius: 3,
                            mb: 0.5,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: budget.budget_coverage_percentage >= 100 ? 
                                theme.palette.success.main : 
                                budget.budget_coverage_percentage >= 80 ? 
                                  theme.palette.warning.main : 
                                  theme.palette.error.main
                            }
                          }}
                        />
                        <Typography variant="body2">
                          {budget.budget_coverage_percentage ? formatPercentage(budget.budget_coverage_percentage / 100) : 'N/A'}
                        </Typography>
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
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedTab === 1 && (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                  {expenseCategories.map((category) => (
                    <TableCell 
                      key={category.key} 
                      align="right" 
                      sx={{ fontWeight: 'bold' }}
                    >
                      {category.label}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBudgets.map((budget) => (
                  <TableRow 
                    key={budget.user_id}
                    hover
                    onClick={() => handleRowClick(budget.user_id)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight="medium">
                        {budget.first_name} {budget.last_name}
                      </Typography>
                    </TableCell>
                    {expenseCategories.map((category) => (
                      <TableCell key={category.key} align="right">
                        {formatCurrency(budget[category.key as keyof BudgetLifestyle] || 0)}
                      </TableCell>
                    ))}
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(budget.total_expenses)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardHeader 
                title="Top 5 des budgets les plus élevés" 
                subheader="Clients avec le budget le plus important"
              />
              <CardContent>
                {[...filteredBudgets]
                  .sort((a, b) => (b.budgeted_expenses || 0) - (a.budgeted_expenses || 0))
                  .slice(0, 5)
                  .map((budget, index) => (
                    <Box key={budget.user_id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>
                          {index + 1}. {budget.first_name} {budget.last_name}
                        </Typography>
                        <Typography fontWeight="bold">
                          {formatCurrency(budget.budgeted_expenses)}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(budget.budgeted_expenses / stats.avgBudget) * 100}
                        sx={{ height: 8, borderRadius: 2 }}
                      />
                    </Box>
                  ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardHeader 
                title="Top 5 des meilleures couvertures" 
                subheader="Clients avec la meilleure couverture budget/dépenses"
              />
              <CardContent>
                {[...filteredBudgets]
                  .sort((a, b) => (b.budget_coverage_percentage || 0) - (a.budget_coverage_percentage || 0))
                  .slice(0, 5)
                  .map((budget, index) => (
                    <Box key={budget.user_id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>
                          {index + 1}. {budget.first_name} {budget.last_name}
                        </Typography>
                        <Typography fontWeight="bold">
                          {budget.budget_coverage_percentage ? formatPercentage(budget.budget_coverage_percentage / 100) : 'N/A'}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={budget.budget_coverage_percentage || 0}
                        sx={{ 
                          height: 8, 
                          borderRadius: 2,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: budget.budget_coverage_percentage >= 100 ? 
                              theme.palette.success.main : 
                              budget.budget_coverage_percentage >= 80 ? 
                                theme.palette.warning.main : 
                                theme.palette.error.main
                          }
                        }}
                      />
                    </Box>
                  ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Empty state */}
      {filteredBudgets.length === 0 && (
        <Box sx={{ 
          p: 4, 
          textAlign: 'center',
          border: `1px dashed ${theme.palette.divider}`,
          borderRadius: 1
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun résultat trouvé
          </Typography>
          <Typography color="text.secondary">
            Essayez de modifier vos critères de recherche
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BudgetLifestyle;