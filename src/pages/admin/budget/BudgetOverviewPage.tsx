import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { supabase } from '../../../lib/supabase';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ArrowUp, ArrowDown, Euro } from 'lucide-react';

interface Budget {
  id: string;
  user_id: string;
  asset_type: 'immobilier' | 'banque' | 'entreprise' | 'assurance_vie' | 'autres';
  asset_id: string | null;
  libelle: string;
  montant: number;
  frequency: 'non_recurrente' | 'monthly' | 'annual';
  date_creation: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

interface BudgetSummary {
  total: number;
  monthly: number;
  annual: number;
  non_recurrente: number;
  byType: Record<string, number>;
  byUser: Record<string, number>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const BudgetOverviewPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'month' | 'year'>('month');
  const [summary, setSummary] = useState<BudgetSummary>({
    total: 0,
    monthly: 0,
    annual: 0,
    non_recurrente: 0,
    byType: {},
    byUser: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: budgetsData, error: budgetsError } = await supabase
          .from('budget')
          .select('*');

        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (budgetsError) throw budgetsError;
        if (usersError) throw usersError;

        setBudgets(budgetsData || []);
        setUsers(usersData || []);
        calculateSummary(budgetsData || [], usersData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateSummary = (budgets: Budget[], users: User[]) => {
    const newSummary: BudgetSummary = {
      total: 0,
      monthly: 0,
      annual: 0,
      non_recurrente: 0,
      byType: {
        immobilier: 0,
        banque: 0,
        entreprise: 0,
        assurance_vie: 0,
        autres: 0
      },
      byUser: {}
    };

    // Initialize user sums
    users.forEach(user => {
      newSummary.byUser[user.id] = 0;
    });

    budgets.forEach(budget => {
      // Calculate based on frequency
      if (budget.frequency === 'monthly') {
        newSummary.monthly += budget.montant;
        newSummary.total += budget.montant * (timeRange === 'month' ? 1 : 12);
      } else if (budget.frequency === 'annual') {
        newSummary.annual += budget.montant;
        newSummary.total += budget.montant * (timeRange === 'month' ? 1/12 : 1);
      } else {
        newSummary.non_recurrente += budget.montant;
        newSummary.total += budget.montant;
      }

      // Sum by asset type
      newSummary.byType[budget.asset_type] += budget.montant;

      // Sum by user
      if (budget.user_id && newSummary.byUser[budget.user_id] !== undefined) {
        newSummary.byUser[budget.user_id] += budget.montant;
      }
    });

    setSummary(newSummary);
  };

  useEffect(() => {
    if (budgets.length > 0 && users.length > 0) {
      calculateSummary(budgets, users);
    }
  }, [timeRange, budgets, users]);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Inconnu';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'immobilier': return 'Immobilier';
      case 'banque': return 'Compte bancaire';
      case 'entreprise': return 'Entreprise';
      case 'assurance_vie': return 'Assurance vie';
      case 'autres': return 'Autres';
      default: return type;
    }
  };

  const prepareChartData = () => {
    return Object.entries(summary.byType)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name: getTypeLabel(name),
        value
      }));
  };

  const prepareUserData = () => {
    return Object.entries(summary.byUser)
      .filter(([_, value]) => value > 0)
      .map(([id, value]) => ({
        name: getUserName(id),
        value
      }));
  };

  const recentBudgets = [...budgets]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Synthèse des budgets
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Période</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'month' | 'year')}
            label="Période"
          >
            <MenuItem value="month">Mensuelle</MenuItem>
            <MenuItem value="year">Annuelle</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total {timeRange === 'month' ? 'mensuel' : 'annuel'}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(summary.total)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Euro size={20} />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      Tous budgets confondus
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Budgets mensuels
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(summary.monthly)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {summary.monthly > 0 ? (
                      <ArrowUp color="green" size={20} />
                    ) : (
                      <ArrowDown color="red" size={20} />
                    )}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {timeRange === 'month' ? 'Ce mois' : 'Par mois'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Budgets annuels
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(summary.annual)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {summary.annual > 0 ? (
                      <ArrowUp color="green" size={20} />
                    ) : (
                      <ArrowDown color="red" size={20} />
                    )}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {timeRange === 'year' ? 'Cette année' : 'Par an'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Répartition par type
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={prepareChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Répartition par utilisateur
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={prepareUserData()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(Number(value)).replace('€', '')} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Derniers budgets ajoutés
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Libellé</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Fréquence</TableCell>
                    <TableCell>Utilisateur</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentBudgets.map((budget) => (
                    <TableRow key={budget.id}>
                      <TableCell>{budget.libelle}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getTypeLabel(budget.asset_type)} 
                          size="small" 
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(budget.montant)}</TableCell>
                      <TableCell>
                        <Chip
                          label={budget.frequency === 'monthly' ? 'Mensuel' : 
                                budget.frequency === 'annual' ? 'Annuel' : 'Non récurrent'}
                          size="small"
                          color={budget.frequency === 'monthly' ? 'primary' : 
                                budget.frequency === 'annual' ? 'secondary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>{getUserName(budget.user_id)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default BudgetOverviewPage;