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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import {
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  LocalHospital as HealthIcon,
  Restaurant as FoodIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Savings as SavingsIcon
} from '@mui/icons-material';

interface TrainDeVie {
  id: string;
  user_id: string;
  loyer: number;
  charges_loyer: number;
  assurances: number;
  transport: number;
  alimentation: number;
  loisirs: number;
  etudes: number;
  sante: number;
  divers: number;
  total: number;
  created_at: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

const categoryData = [
  { subject: 'Logement', icon: <HomeIcon /> },
  { subject: 'Transport', icon: <CarIcon /> },
  { subject: 'Alimentation', icon: <FoodIcon /> },
  { subject: 'Loisirs', icon: <FoodIcon color="secondary" /> },
  { subject: 'Santé', icon: <HealthIcon /> },
  { subject: 'Assurances', icon: <MoneyIcon /> },
  { subject: 'Études', icon: <SchoolIcon /> },
  { subject: 'Divers', icon: <MoneyIcon color="secondary" /> }
];

const TrainDeVieOverviewPage: React.FC = () => {
  const theme = useTheme();
  const [trainDeVie, setTrainDeVie] = useState<TrainDeVie[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'month' | 'year'>('month');
  const [selectedUserId, setSelectedUserId] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: trainData, error: trainError } = await supabase
          .from('traindevie')
          .select('*');

        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (trainError) throw trainError;
        if (usersError) throw usersError;

        setTrainDeVie(trainData || []);
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
  const filteredData = selectedUserId === 'all' 
    ? trainDeVie 
    : trainDeVie.filter(item => item.user_id === selectedUserId);

  const totalDepenses = filteredData.reduce((sum, item) => sum + item.total, 0);
  const avgDepenses = filteredData.length > 0 ? totalDepenses / filteredData.length : 0;
  const usersCount = new Set(filteredData.map(item => item.user_id)).size;

  // Prepare data for charts
  const prepareCategoryData = () => {
    const categories = {
      loyer: 0,
      charges_loyer: 0,
      transport: 0,
      alimentation: 0,
      loisirs: 0,
      sante: 0,
      assurances: 0,
      etudes: 0,
      divers: 0
    };

    filteredData.forEach(item => {
      categories.loyer += item.loyer;
      categories.charges_loyer += item.charges_loyer;
      categories.transport += item.transport;
      categories.alimentation += item.alimentation;
      categories.loisirs += item.loisirs;
      categories.sante += item.sante;
      categories.assurances += item.assurances;
      categories.etudes += item.etudes;
      categories.divers += item.divers;
    });

    return [
      { name: 'Logement', value: categories.loyer + categories.charges_loyer },
      { name: 'Transport', value: categories.transport },
      { name: 'Alimentation', value: categories.alimentation },
      { name: 'Loisirs', value: categories.loisirs },
      { name: 'Santé', value: categories.sante + categories.assurances },
      { name: 'Études', value: categories.etudes },
      { name: 'Divers', value: categories.divers }
    ].filter(item => item.value > 0);
  };

  const prepareUserData = () => {
    const userMap = new Map<string, number>();

    trainDeVie.forEach(item => {
      const current = userMap.get(item.user_id) || 0;
      userMap.set(item.user_id, current + item.total);
    });

    return Array.from(userMap.entries())
      .map(([userId, total]) => {
        const user = users.find(u => u.id === userId);
        return {
          name: user ? `${user.first_name} ${user.last_name}` : 'Inconnu',
          total
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const prepareRadarData = () => {
    if (filteredData.length === 0) return [];

    const avgValues = {
      loyer: 0,
      charges_loyer: 0,
      transport: 0,
      alimentation: 0,
      loisirs: 0,
      sante: 0,
      assurances: 0,
      etudes: 0,
      divers: 0
    };

    filteredData.forEach(item => {
      avgValues.loyer += item.loyer;
      avgValues.charges_loyer += item.charges_loyer;
      avgValues.transport += item.transport;
      avgValues.alimentation += item.alimentation;
      avgValues.loisirs += item.loisirs;
      avgValues.sante += item.sante;
      avgValues.assurances += item.assurances;
      avgValues.etudes += item.etudes;
      avgValues.divers += item.divers;
    });

    const count = filteredData.length;
    return [
      { subject: 'Logement', A: (avgValues.loyer + avgValues.charges_loyer) / count, fullMark: 2000 },
      { subject: 'Transport', A: avgValues.transport / count, fullMark: 1000 },
      { subject: 'Alimentation', A: avgValues.alimentation / count, fullMark: 1000 },
      { subject: 'Loisirs', A: avgValues.loisirs / count, fullMark: 1000 },
      { subject: 'Santé', A: (avgValues.sante + avgValues.assurances) / count, fullMark: 1000 },
      { subject: 'Études', A: avgValues.etudes / count, fullMark: 1000 },
      { subject: 'Divers', A: avgValues.divers / count, fullMark: 1000 }
    ];
  };

  const recentItems = [...trainDeVie]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Inconnu';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Synthèse du train de vie
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
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
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Utilisateur</InputLabel>
            <Select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value as string)}
              label="Utilisateur"
            >
              <MenuItem value="all">Tous les utilisateurs</MenuItem>
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

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
                    Dépenses totales
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(totalDepenses)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <SavingsIcon color="primary" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {filteredData.length} enregistrements
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Dépenses moyennes
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(avgDepenses)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    {avgDepenses > 0 ? (
                      <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                    ) : (
                      <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
                    )}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {usersCount} utilisateur(s)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Répartition
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    {prepareCategoryData().length > 0 ? (
                      <ResponsiveContainer width="100%" height={100}>
                        <PieChart>
                          <Pie
                            data={prepareCategoryData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={40}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {prepareCategoryData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography variant="body2">Aucune donnée</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Répartition par catégorie
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={prepareCategoryData()}
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

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Profil de dépenses
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={prepareRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 500']} />
                    <Radar 
                      name="Dépenses" 
                      dataKey="A" 
                      stroke={theme.palette.primary.main} 
                      fill={theme.palette.primary.main} 
                      fillOpacity={0.6} 
                    />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </RadarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Top utilisateurs
                </Typography>
                <List>
                  {prepareUserData().map((user, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={formatCurrency(user.total)}
                      />
                      <Chip 
                        label={`#${index + 1}`} 
                        color="primary" 
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Derniers enregistrements
                </Typography>
                <List>
                  {recentItems.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={getUserName(item.user_id)}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {formatCurrency(item.total)}
                            </Typography>
                            {` — ${new Date(item.created_at).toLocaleDateString('fr-FR')}`}
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
      )}
    </Box>
  );
};

export default TrainDeVieOverviewPage;