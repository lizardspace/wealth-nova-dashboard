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
  Chip,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  AccountBalance as PensionIcon,
  Work as WorkIcon,
  Euro as EuroIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Person as PersonIcon,
  Savings as SavingsIcon
} from '@mui/icons-material';

interface Retraite {
  id: string;
  user_id: string;
  epargne_retraite: boolean;
  montant_epargne: number;
  complement_retraite: string;
  contrats_prevoyance: string[];
  created_at: string;
}

interface RetraiteComplementaire {
  id: string;
  user_id: string;
  type_produit_retraite: 'Contrat monosupport' | 'Contrat multisupport';
  libelle: string;
  numero: string;
  value: number;
  souscripteur: string;
  created_at: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const RetraiteOverviewPage: React.FC = () => {
  const theme = useTheme();
  const [retraites, setRetraites] = useState<Retraite[]>([]);
  const [complementaires, setComplementaires] = useState<RetraiteComplementaire[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'month' | 'year'>('year');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch retraite data
        const { data: retraiteData, error: retraiteError } = await supabase
          .from('retraite')
          .select('*');

        // Fetch retraite complementaire data
        const { data: complementaireData, error: complementaireError } = await supabase
          .from('retraitecomplementaire')
          .select('*');

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (retraiteError) throw retraiteError;
        if (complementaireError) throw complementaireError;
        if (usersError) throw usersError;

        setRetraites(retraiteData || []);
        setComplementaires(complementaireData || []);
        setUsers(usersData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate summary statistics
  const totalEpargne = retraites.reduce((sum, r) => sum + r.montant_epargne, 0);
  const totalComplementaire = complementaires.reduce((sum, c) => sum + c.value, 0);
  const totalGlobal = totalEpargne + totalComplementaire;
  const usersWithRetraite = users.filter(u => 
    retraites.some(r => r.user_id === u.id) || 
    complementaires.some(c => c.user_id === u.id)
  ).length;

  // Prepare data for charts
  const prepareTypeData = () => {
    const types = {
      'PER': 0,
      'PERP': 0,
      'Madelin': 0,
      'Article 83': 0,
      'Autre': 0
    };

    retraites.forEach(r => {
      if (r.complement_retraite in types) {
        types[r.complement_retraite as keyof typeof types] += r.montant_epargne;
      } else {
        types['Autre'] += r.montant_epargne;
      }
    });

    return Object.entries(types)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  };

  const prepareUserData = () => {
    return users.map(user => {
      const userRetraite = retraites.filter(r => r.user_id === user.id);
      const userComplementaire = complementaires.filter(c => c.user_id === user.id);
      
      const retraiteSum = userRetraite.reduce((sum, r) => sum + r.montant_epargne, 0);
      const complementaireSum = userComplementaire.reduce((sum, c) => sum + c.value, 0);
      
      return {
        name: `${user.first_name} ${user.last_name}`,
        retraite: retraiteSum,
        complementaire: complementaireSum,
        total: retraiteSum + complementaireSum
      };
    }).filter(u => u.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const prepareEvolutionData = () => {
    // Group by year (simplified - would need actual date handling in a real app)
    const years = [2020, 2021, 2022, 2023];
    return years.map(year => {
      const yearRetraites = retraites.filter(r => new Date(r.created_at).getFullYear() <= year);
      const yearComplementaires = complementaires.filter(c => new Date(c.created_at).getFullYear() <= year);
      
      return {
        year,
        retraite: yearRetraites.reduce((sum, r) => sum + r.montant_epargne, 0),
        complementaire: yearComplementaires.reduce((sum, c) => sum + c.value, 0)
      };
    });
  };

  const recentRetraites = [...retraites]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const recentComplementaires = [...complementaires]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Inconnu';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Synthèse des retraites
      </Typography>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ mb: 3 }}
        variant="fullWidth"
      >
        <Tab label="Vue d'ensemble" icon={<PensionIcon />} />
        <Tab label="Détails par utilisateur" icon={<PersonIcon />} />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tabValue === 0 ? (
            <>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Épargne retraite totale
                      </Typography>
                      <Typography variant="h4" component="div">
                        {formatCurrency(totalGlobal)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <EuroIcon color="primary" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Dont {formatCurrency(totalEpargne)} en épargne et {formatCurrency(totalComplementaire)} en complémentaire
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Utilisateurs couverts
                      </Typography>
                      <Typography variant="h4" component="div">
                        {usersWithRetraite} / {users.length}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <PersonIcon color="secondary" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Soit {Math.round((usersWithRetraite / users.length) * 100)}% des utilisateurs
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Évolution
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {totalGlobal > 0 ? (
                          <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                        ) : (
                          <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
                        )}
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="h6">
                            +15% sur 3 ans
                          </Typography>
                          <Typography variant="body2">
                            Croissance moyenne annuelle
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Répartition par type de retraite
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={prepareTypeData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {prepareTypeData().map((entry, index) => (
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
                      Évolution historique
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={prepareEvolutionData()}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => formatCurrency(Number(value)).replace('€', '')} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="retraite" 
                          name="Épargne retraite" 
                          stroke={theme.palette.primary.main} 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="complementaire" 
                          name="Complémentaire" 
                          stroke={theme.palette.secondary.main} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Derniers plans retraite ajoutés
                    </Typography>
                    <List>
                      {recentRetraites.map((retraite) => (
                        <ListItem key={retraite.id}>
                          <ListItemAvatar>
                            <Avatar>
                              <PensionIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={getUserName(retraite.user_id)}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {formatCurrency(retraite.montant_epargne)}
                                </Typography>
                                {` — ${retraite.complement_retraite}`}
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Derniers contrats complémentaires
                    </Typography>
                    <List>
                      {recentComplementaires.map((complementaire) => (
                        <ListItem key={complementaire.id}>
                          <ListItemAvatar>
                            <Avatar>
                              <WorkIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={complementaire.libelle}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  {formatCurrency(complementaire.value)}
                                </Typography>
                                {` — ${getUserName(complementaire.user_id)}`}
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </>
          ) : (
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Répartition par utilisateur
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={prepareUserData()}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 80,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(Number(value)).replace('€', '')} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={150} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="retraite" name="Épargne retraite" fill={theme.palette.primary.main} />
                  <Bar dataKey="complementaire" name="Complémentaire" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default RetraiteOverviewPage;