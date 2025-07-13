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
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Edit2 as EditIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
  Plus as AddIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Target as TargetIcon,
  Clock as ClockIcon,
  DollarSign as DollarSignIcon,
  Users as UsersIcon
} from 'lucide-react';
import { supabase } from './../../../lib/supabase';

interface UserGoal {
  user_id: string;
  last_name: string;
  first_name: string;
  expected_changes: boolean;
  education_funding: string;
  patrimony_liquidity: number;
  patrimony_goals: string[];
  management_priority: string;
  five_year_projects: string[];
  retirement_savings: boolean;
  retirement_amount: number;
  has_dependent_children: boolean;
  dependent_children_count: number;
}

const UserGoalsComponent: React.FC = () => {
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterManagementPriority, setFilterManagementPriority] = useState('');
  const [filterRetirementSavings, setFilterRetirementSavings] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Fetch user goals from view
  useEffect(() => {
    const fetchUserGoals = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_goals')
          .select('*')
          .order('last_name', { ascending: true });

        if (error) throw error;
        setUserGoals(data || []);
      } catch (error) {
        console.error('Error fetching user goals:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch user goals data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserGoals();
  }, []);

  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getManagementPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'sécurité':
      case 'sécurite':
        return 'success';
      case 'rendement':
      case 'performance':
        return 'warning';
      case 'croissance':
      case 'développement':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEducationFundingColor = (funding: string) => {
    switch (funding?.toLowerCase()) {
      case 'oui':
      case 'prévu':
        return 'success';
      case 'en cours':
        return 'warning';
      case 'non':
      case 'non prévu':
        return 'default';
      default:
        return 'default';
    }
  };

  const filteredGoals = userGoals.filter(goal => {
    const nameMatch = `${goal.first_name} ${goal.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const priorityMatch = !filterManagementPriority || goal.management_priority === filterManagementPriority;
    const retirementMatch = !filterRetirementSavings || 
      (filterRetirementSavings === 'true' && goal.retirement_savings) ||
      (filterRetirementSavings === 'false' && !goal.retirement_savings);
    
    return nameMatch && priorityMatch && retirementMatch;
  });

  // Statistics calculations
  const usersWithRetirement = userGoals.filter(goal => goal.retirement_savings).length;
  const usersWithExpectedChanges = userGoals.filter(goal => goal.expected_changes).length;
  const averageRetirementAmount = userGoals.filter(goal => goal.retirement_amount > 0)
    .reduce((sum, goal) => sum + goal.retirement_amount, 0) / 
    userGoals.filter(goal => goal.retirement_amount > 0).length || 0;
  const averageLiquidity = userGoals.filter(goal => goal.patrimony_liquidity > 0)
    .reduce((sum, goal) => sum + goal.patrimony_liquidity, 0) / 
    userGoals.filter(goal => goal.patrimony_liquidity > 0).length || 0;

  // Management priority statistics
  const managementPriorityStats = userGoals.reduce((acc, goal) => {
    const priority = goal.management_priority || 'Non défini';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Education funding statistics
  const educationFundingStats = userGoals.reduce((acc, goal) => {
    const funding = goal.education_funding || 'Non défini';
    acc[funding] = (acc[funding] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Most common goals
  const allPatrimonyGoals = userGoals.flatMap(goal => goal.patrimony_goals || []);
  const patrimonyGoalsStats = allPatrimonyGoals.reduce((acc, goal) => {
    acc[goal] = (acc[goal] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Most common projects
  const allProjects = userGoals.flatMap(goal => goal.five_year_projects || []);
  const projectsStats = allProjects.reduce((acc, project) => {
    acc[project] = (acc[project] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Projets et Objectifs Utilisateurs</Typography>
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
                    {userGoals.length}
                  </Typography>
                </Box>
                <UsersIcon size={40} color="#1976d2" />
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
                    Épargne Retraite
                  </Typography>
                  <Typography variant="h5">
                    {usersWithRetirement} ({((usersWithRetirement / userGoals.length) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
                <TargetIcon size={40} color="#1976d2" />
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
                    Montant Retraite Moyen
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(averageRetirementAmount)}
                  </Typography>
                </Box>
                <DollarSignIcon size={40} color="#1976d2" />
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
                    Changements Prévus
                  </Typography>
                  <Typography variant="h5">
                    {usersWithExpectedChanges} ({((usersWithExpectedChanges / userGoals.length) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
                <ClockIcon size={40} color="#4caf50" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Statistics Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Répartition par Priorité de Gestion" />
            <CardContent>
              {Object.entries(managementPriorityStats).map(([priority, count]) => (
                <Box key={priority} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{priority}</Typography>
                    <Typography variant="body2">{count} ({((count / userGoals.length) * 100).toFixed(1)}%)</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(count / userGoals.length) * 100}
                    color={getManagementPriorityColor(priority) as any}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Objectifs Patrimoniaux les Plus Fréquents" />
            <CardContent>
              <List dense>
                {Object.entries(patrimonyGoalsStats)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([goal, count]) => (
                    <ListItem key={goal} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={goal}
                        secondary={`${count} clients (${((count / userGoals.length) * 100).toFixed(1)}%)`}
                      />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Rechercher un client"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Priorité de Gestion</InputLabel>
            <Select
              value={filterManagementPriority}
              label="Priorité de Gestion"
              onChange={(e) => setFilterManagementPriority(e.target.value)}
            >
              <MenuItem value="">Toutes</MenuItem>
              {Object.keys(managementPriorityStats).map(priority => (
                <MenuItem key={priority} value={priority}>{priority}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Épargne Retraite</InputLabel>
            <Select
              value={filterRetirementSavings}
              label="Épargne Retraite"
              onChange={(e) => setFilterRetirementSavings(e.target.value)}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="true">Oui</MenuItem>
              <MenuItem value="false">Non</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label="Vue d'ensemble" />
          <Tab label="Projets détaillés" />
        </Tabs>
      </Box>

      {loading ? (
        <Typography>Chargement des objectifs utilisateurs...</Typography>
      ) : (
        <>
          {selectedTab === 0 && (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Client</TableCell>
                      <TableCell>Changements Prévus</TableCell>
                      <TableCell>Financement Études</TableCell>
                      <TableCell align="right">Liquidité Patrimoine</TableCell>
                      <TableCell>Priorité Gestion</TableCell>
                      <TableCell>Épargne Retraite</TableCell>
                      <TableCell align="right">Montant Retraite</TableCell>
                      <TableCell>Enfants à Charge</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredGoals.map((goal) => (
                      <TableRow key={goal.user_id}>
                        <TableCell>
                          {goal.first_name} {goal.last_name}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={goal.expected_changes ? 'Oui' : 'Non'} 
                            color={goal.expected_changes ? 'warning' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={goal.education_funding || 'Non défini'} 
                            color={getEducationFundingColor(goal.education_funding) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(goal.patrimony_liquidity)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={goal.management_priority || 'Non défini'} 
                            color={getManagementPriorityColor(goal.management_priority) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={goal.retirement_savings ? 'Oui' : 'Non'} 
                            color={goal.retirement_savings ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(goal.retirement_amount)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={goal.has_dependent_children ? `${goal.dependent_children_count} enfant(s)` : 'Aucun'} 
                            color={goal.has_dependent_children ? 'info' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {selectedTab === 1 && (
            <Grid container spacing={3}>
              {filteredGoals.map((goal) => (
                <Grid item xs={12} md={6} lg={4} key={goal.user_id}>
                  <Card>
                    <CardHeader 
                      title={`${goal.first_name} ${goal.last_name}`}
                      subheader={goal.management_priority ? `Priorité: ${goal.management_priority}` : 'Priorité non définie'}
                    />
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Objectifs Patrimoniaux:
                      </Typography>
                      <List dense>
                        {(goal.patrimony_goals || []).map((objective, index) => (
                          <ListItem key={index} sx={{ py: 0, pl: 0 }}>
                            <ListItemText primary={`• ${objective}`} />
                          </ListItem>
                        ))}
                        {(!goal.patrimony_goals || goal.patrimony_goals.length === 0) && (
                          <ListItem sx={{ py: 0, pl: 0 }}>
                            <ListItemText primary="Aucun objectif défini" />
                          </ListItem>
                        )}
                      </List>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Projets 5 ans:
                      </Typography>
                      <List dense>
                        {(goal.five_year_projects || []).map((project, index) => (
                          <ListItem key={index} sx={{ py: 0, pl: 0 }}>
                            <ListItemText primary={`• ${project}`} />
                          </ListItem>
                        ))}
                        {(!goal.five_year_projects || goal.five_year_projects.length === 0) && (
                          <ListItem sx={{ py: 0, pl: 0 }}>
                            <ListItemText primary="Aucun projet défini" />
                          </ListItem>
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
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

export default UserGoalsComponent;

