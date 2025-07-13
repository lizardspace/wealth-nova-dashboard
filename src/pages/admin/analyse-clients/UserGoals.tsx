import React, { useState, useEffect, useMemo } from 'react';
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
  Divider,
  Tooltip,
  Avatar,
  Badge,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrackChanges as TargetIcon,
  Schedule as ClockIcon,
  AttachMoney as DollarSignIcon,
  People as UsersIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  School as EducationIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  ChildCare as ChildIcon,
  TableChart as TableIcon,
  ViewModule as ViewModuleIcon
} from '@mui/icons-material';
import { supabase } from './../../../lib/supabase';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

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

const priorityColors = {
  'Sécurité': '#4caf50',
  'Rendement': '#ff9800',
  'Croissance': '#f44336',
  'Développement': '#9c27b0',
  'Non défini': '#9e9e9e'
};

const UserGoalsComponent: React.FC = () => {
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterManagementPriority, setFilterManagementPriority] = useState('');
  const [filterRetirementSavings, setFilterRetirementSavings] = useState('');
  const [filterEducationFunding, setFilterEducationFunding] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const theme = useTheme();

  // Fetch user goals from view
  const fetchUserGoals = async () => {
    setRefreshing(true);
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
        message: 'Échec du chargement des objectifs utilisateurs',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserGoals();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getManagementPriorityColor = (priority: string) => {
    if (!priority) return 'default';
    const normalizedPriority = priority.toLowerCase();
    
    if (normalizedPriority.includes('sécurité') || normalizedPriority.includes('securite')) return 'success';
    if (normalizedPriority.includes('rendement')) return 'warning';
    if (normalizedPriority.includes('croissance')) return 'error';
    if (normalizedPriority.includes('développement')) return 'secondary';
    
    return 'default';
  };

  const getEducationFundingColor = (funding: string) => {
    if (!funding) return 'default';
    const normalizedFunding = funding.toLowerCase();
    
    if (normalizedFunding.includes('oui') || normalizedFunding.includes('prévu')) return 'success';
    if (normalizedFunding.includes('en cours')) return 'warning';
    if (normalizedFunding.includes('non')) return 'error';
    
    return 'default';
  };

  const filteredGoals = useMemo(() => {
    return userGoals.filter(goal => {
      const nameMatch = `${goal.first_name} ${goal.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      const priorityMatch = !filterManagementPriority || 
        (goal.management_priority && goal.management_priority.toLowerCase().includes(filterManagementPriority.toLowerCase()));
      const retirementMatch = !filterRetirementSavings || 
        (filterRetirementSavings === 'true' && goal.retirement_savings) ||
        (filterRetirementSavings === 'false' && !goal.retirement_savings);
      const educationMatch = !filterEducationFunding || 
        (goal.education_funding && goal.education_funding.toLowerCase().includes(filterEducationFunding.toLowerCase()));
      
      return nameMatch && priorityMatch && retirementMatch && educationMatch;
    });
  }, [userGoals, searchTerm, filterManagementPriority, filterRetirementSavings, filterEducationFunding]);

  // Statistics calculations
  const stats = useMemo(() => {
    const usersWithRetirement = userGoals.filter(goal => goal.retirement_savings).length;
    const usersWithExpectedChanges = userGoals.filter(goal => goal.expected_changes).length;
    const usersWithChildren = userGoals.filter(goal => goal.has_dependent_children).length;
    
    const retirementAmounts = userGoals.filter(goal => goal.retirement_amount > 0).map(goal => goal.retirement_amount);
    const averageRetirementAmount = retirementAmounts.length > 0 ? 
      retirementAmounts.reduce((sum, amount) => sum + amount, 0) / retirementAmounts.length : 0;
    
    const liquidityAmounts = userGoals.filter(goal => goal.patrimony_liquidity > 0).map(goal => goal.patrimony_liquidity);
    const averageLiquidity = liquidityAmounts.length > 0 ? 
      liquidityAmounts.reduce((sum, amount) => sum + amount, 0) / liquidityAmounts.length : 0;

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

    return {
      totalUsers: userGoals.length,
      usersWithRetirement,
      retirementPercentage: userGoals.length > 0 ? (usersWithRetirement / userGoals.length) * 100 : 0,
      averageRetirementAmount,
      usersWithExpectedChanges,
      expectedChangesPercentage: userGoals.length > 0 ? (usersWithExpectedChanges / userGoals.length) * 100 : 0,
      usersWithChildren,
      childrenPercentage: userGoals.length > 0 ? (usersWithChildren / userGoals.length) * 100 : 0,
      averageLiquidity,
      managementPriorityStats,
      educationFundingStats,
      patrimonyGoalsStats,
      projectsStats,
      topPatrimonyGoals: Object.entries(patrimonyGoalsStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      topProjects: Object.entries(projectsStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    };
  }, [userGoals]);

  // Chart data
  const priorityChartData = {
    labels: Object.keys(stats.managementPriorityStats),
    datasets: [
      {
        data: Object.values(stats.managementPriorityStats),
        backgroundColor: Object.keys(stats.managementPriorityStats).map(priority => 
          priorityColors[priority as keyof typeof priorityColors] || '#9e9e9e'
        ),
        borderWidth: 1
      }
    ]
  };

  const projectsChartData = {
    labels: stats.topProjects.map(([project]) => project),
    datasets: [
      {
        label: 'Nombre de clients',
        data: stats.topProjects.map(([,count]) => count),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const handleGoalClick = (goal: UserGoal) => {
    setSelectedGoal(goal);
    setDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailDialogOpen(false);
    setSelectedGoal(null);
  };

  const handleRefresh = () => {
    fetchUserGoals();
    setSnackbar({
      open: true,
      message: 'Actualisation des données en cours...',
      severity: 'info'
    });
  };

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Client', 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32, mr: 2 }}>
            {params.row.first_name.charAt(0)}{params.row.last_name.charAt(0)}
          </Avatar>
          {params.row.first_name} {params.row.last_name}
        </Box>
      )
    },
    { 
      field: 'expected_changes', 
      headerName: 'Changements', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Oui' : 'Non'} 
          color={params.value ? 'warning' : 'default'}
          size="small"
          variant="outlined"
        />
      )
    },
    { 
      field: 'education_funding', 
      headerName: 'Financement Études', 
      width: 180,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'Non défini'} 
          color={getEducationFundingColor(params.value) as any}
          size="small"
        />
      )
    },
    { 
      field: 'patrimony_liquidity', 
      headerName: 'Liquidité', 
      width: 120,
      valueFormatter: (params) => formatCurrency(params.value)
    },
    { 
      field: 'management_priority', 
      headerName: 'Priorité', 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'Non défini'} 
          color={getManagementPriorityColor(params.value) as any}
          size="small"
        />
      )
    },
    { 
      field: 'retirement_savings', 
      headerName: 'Retraite', 
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip 
            label={params.value ? 'Oui' : 'Non'} 
            color={params.value ? 'success' : 'default'}
            size="small"
            sx={{ mr: 1 }}
          />
          {params.value && (
            <Tooltip title={formatCurrency(params.row.retirement_amount)}>
              <InfoIcon fontSize="small" color="action" />
            </Tooltip>
          )}
        </Box>
      )
    },
    { 
      field: 'has_dependent_children', 
      headerName: 'Enfants', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value ? `${params.row.dependent_children_count} enfant(s)` : 'Aucun'} 
          color={params.value ? 'info' : 'default'}
          size="small"
          icon={params.value ? <ChildIcon fontSize="small" /> : undefined}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleGoalClick(params.row)} size="small">
          <InfoIcon color="primary" />
        </IconButton>
      )
    }
  ];

  const rows = filteredGoals.map(goal => ({
    id: goal.user_id,
    ...goal,
    name: `${goal.first_name} ${goal.last_name}`
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Projets et Objectifs Utilisateurs
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />} 
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ mr: 2 }}
          >
            {refreshing ? 'Actualisation...' : 'Actualiser'}
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FilterIcon />}
            onClick={() => {
              setFilterManagementPriority('');
              setFilterRetirementSavings('');
              setFilterEducationFunding('');
              setSearchTerm('');
            }}
          >
            Réinitialiser les filtres
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Clients
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalUsers}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.primary.light, width: 56, height: 56 }}>
                  <UsersIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Épargne Retraite
                  </Typography>
                  <Typography variant="h4">
                    {stats.usersWithRetirement}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {stats.retirementPercentage.toFixed(1)}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.success.light, width: 56, height: 56 }}>
                  <TargetIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Montant Retraite Moyen
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(stats.averageRetirementAmount)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.warning.light, width: 56, height: 56 }}>
                  <DollarSignIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Changements Prévus
                  </Typography>
                  <Typography variant="h4">
                    {stats.usersWithExpectedChanges}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {stats.expectedChangesPercentage.toFixed(1)}%
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.info.light, width: 56, height: 56 }}>
                  <ClockIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Statistics Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Répartition par Priorité de Gestion" 
              action={
                <Tooltip title="Priorité déclarée par les clients pour la gestion de leur patrimoine">
                  <InfoIcon color="action" />
                </Tooltip>
              }
            />
            <CardContent sx={{ height: 300 }}>
              <Doughnut 
                data={priorityChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw as number;
                          const percentage = (value / stats.totalUsers) * 100;
                          return `${label}: ${value} (${percentage.toFixed(1)}%)`;
                        }
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Projets 5 ans les Plus Fréquents" 
              action={
                <Tooltip title="Projets déclarés par les clients pour les 5 prochaines années">
                  <InfoIcon color="action" />
                </Tooltip>
              }
            />
            <CardContent sx={{ height: 300 }}>
              <Bar 
                data={projectsChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Nombre de clients'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Filtres" 
          avatar={<FilterIcon />}
          action={
            <Badge 
              badgeContent={
                [searchTerm, filterManagementPriority, filterRetirementSavings, filterEducationFunding]
                  .filter(Boolean).length
              } 
              color="primary"
            >
              <FilterIcon color="action" />
            </Badge>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Priorité de Gestion</InputLabel>
                <Select
                  value={filterManagementPriority}
                  label="Priorité de Gestion"
                  onChange={(e) => setFilterManagementPriority(e.target.value)}
                >
                  <MenuItem value="">Toutes les priorités</MenuItem>
                  {Object.keys(stats.managementPriorityStats).map(priority => (
                    <MenuItem key={priority} value={priority}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{
                            width: 12,
                            height: 12,
                            bgcolor: priorityColors[priority as keyof typeof priorityColors] || '#9e9e9e',
                            borderRadius: '50%',
                            mr: 1
                          }} 
                        />
                        {priority} ({stats.managementPriorityStats[priority]})
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Épargne Retraite</InputLabel>
                <Select
                  value={filterRetirementSavings}
                  label="Épargne Retraite"
                  onChange={(e) => setFilterRetirementSavings(e.target.value)}
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="true">Avec épargne</MenuItem>
                  <MenuItem value="false">Sans épargne</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Financement Études</InputLabel>
                <Select
                  value={filterEducationFunding}
                  label="Financement Études"
                  onChange={(e) => setFilterEducationFunding(e.target.value)}
                >
                  <MenuItem value="">Tous</MenuItem>
                  {Object.keys(stats.educationFundingStats).map(funding => (
                    <MenuItem key={funding} value={funding}>
                      {funding} ({stats.educationFundingStats[funding]})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Vue Tableau" icon={<TableIcon />} />
          <Tab label="Vue Cartes" icon={<ViewModuleIcon />} />
          <Tab label="Statistiques" icon={<BarChartIcon />} />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {selectedTab === 0 && (
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                checkboxSelection
                disableSelectionOnClick
                components={{ Toolbar: GridToolbar }}
                loading={refreshing}
                localeText={{
                  toolbarDensity: 'Densité',
                  toolbarDensityLabel: 'Densité',
                  toolbarDensityCompact: 'Compact',
                  toolbarDensityStandard: 'Standard',
                  toolbarDensityComfortable: 'Confortable',
                  toolbarFilters: 'Filtres',
                  toolbarFiltersLabel: 'Afficher les filtres',
                  toolbarFiltersTooltipHide: 'Cacher les filtres',
                  toolbarFiltersTooltipShow: 'Afficher les filtres',
                  toolbarExport: 'Exporter',
                  toolbarExportLabel: 'Exporter',
                  toolbarExportCSV: 'Télécharger en CSV',
                  noRowsLabel: 'Aucun résultat trouvé',
                  footerRowSelected: (count) => 
                    count > 1 ? `${count.toLocaleString()} lignes sélectionnées` : `${count.toLocaleString()} ligne sélectionnée`,
                }}
              />
            </Box>
          )}

          {selectedTab === 1 && (
            <Grid container spacing={3}>
              {filteredGoals.map((goal) => (
                <Grid item xs={12} sm={6} md={4} key={goal.user_id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderLeft: `4px solid ${priorityColors[goal.management_priority as keyof typeof priorityColors] || '#9e9e9e'}`
                    }}
                  >
                    <CardHeader 
                      avatar={
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          {goal.first_name.charAt(0)}{goal.last_name.charAt(0)}
                        </Avatar>
                      }
                      title={`${goal.first_name} ${goal.last_name}`}
                      subheader={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Chip 
                            label={goal.management_priority || 'Non défini'} 
                            color={getManagementPriorityColor(goal.management_priority) as any}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          {goal.has_dependent_children && (
                            <Tooltip title={`${goal.dependent_children_count} enfant(s) à charge`}>
                              <ChildIcon color="info" fontSize="small" />
                            </Tooltip>
                          )}
                        </Box>
                      }
                      action={
                        <IconButton onClick={() => handleGoalClick(goal)}>
                          <InfoIcon color="primary" />
                        </IconButton>
                      }
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <DollarSignIcon fontSize="small" sx={{ mr: 1 }} />
                        Liquidité: {formatCurrency(goal.patrimony_liquidity)}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <TargetIcon fontSize="small" sx={{ mr: 1 }} />
                        Retraite: {goal.retirement_savings ? formatCurrency(goal.retirement_amount) : 'Non prévue'}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <EducationIcon fontSize="small" sx={{ mr: 1 }} />
                        Études: {goal.education_funding || 'Non spécifié'}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Principaux objectifs:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(goal.patrimony_goals || []).slice(0, 3).map((objective, index) => (
                          <Chip 
                            key={index} 
                            label={objective} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                        {(goal.patrimony_goals || []).length > 3 && (
                          <Tooltip title={(goal.patrimony_goals || []).slice(3).join(', ')}>
                            <Chip 
                              label={`+${(goal.patrimony_goals || []).length - 3}`} 
                              size="small" 
                            />
                          </Tooltip>
                        )}
                        {(goal.patrimony_goals || []).length === 0 && (
                          <Typography variant="caption" color="textSecondary">
                            Aucun objectif défini
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {selectedTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Objectifs Patrimoniaux" 
                    subheader="Les objectifs les plus fréquemment déclarés"
                  />
                  <CardContent>
                    <List dense>
                      {stats.topPatrimonyGoals.map(([goal, count]) => (
                        <ListItem key={goal} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={goal}
                            secondary={`${count} clients (${((count / stats.totalUsers) * 100).toFixed(1)}%)`}
                          />
                          <LinearProgress 
                            variant="determinate" 
                            value={(count / stats.totalUsers) * 100}
                            sx={{ 
                              width: '40%',
                              height: 8,
                              borderRadius: 4,
                              ml: 2
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader 
                    title="Financement des Études" 
                    subheader="Répartition des réponses"
                  />
                  <CardContent>
                    <List dense>
                      {Object.entries(stats.educationFundingStats).map(([funding, count]) => (
                        <ListItem key={funding} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={funding}
                            secondary={`${count} clients (${((count / stats.totalUsers) * 100).toFixed(1)}%)`}
                          />
                          <Box sx={{ 
                            width: '40%',
                            height: 8,
                            borderRadius: 4,
                            ml: 2,
                            bgcolor: getEducationFundingColor(funding) === 'default' ? 
                              theme.palette.grey[300] : 
                              theme.palette[getEducationFundingColor(funding) as any].light
                          }} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardHeader 
                    title="Statistiques Globales" 
                    subheader="Synthèse des données"
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4">
                            {stats.usersWithChildren}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                            Clients avec enfants
                          </Typography>
                          <Typography variant="body2">
                            ({stats.childrenPercentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4">
                            {formatCurrency(stats.averageLiquidity)}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                            Liquidité moyenne
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4">
                            {stats.topPatrimonyGoals[0]?.[1] || 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                            Objectif principal: {stats.topPatrimonyGoals[0]?.[0] || 'Aucun'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4">
                            {stats.topProjects[0]?.[1] || 0}
                          </Typography>
                          <Typography variant="subtitle2" color="textSecondary">
                            Projet principal: {stats.topProjects[0]?.[0] || 'Aucun'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}

      {/* Goal Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Détails des objectifs: {selectedGoal?.first_name} {selectedGoal?.last_name}
        </DialogTitle>
        <DialogContent dividers>
          {selectedGoal && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TargetIcon sx={{ mr: 1 }} /> Objectifs Patrimoniaux
                </Typography>
                <List dense>
                  {(selectedGoal.patrimony_goals || []).map((goal, index) => (
                    <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                      <ListItemText primary={`• ${goal}`} />
                    </ListItem>
                  ))}
                  {(!selectedGoal.patrimony_goals || selectedGoal.patrimony_goals.length === 0) && (
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemText primary="Aucun objectif défini" />
                    </ListItem>
                  )}
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                  <DollarSignIcon sx={{ mr: 1 }} /> Situation Financière
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Liquidité du patrimoine:</Typography>
                    <Typography>{formatCurrency(selectedGoal.patrimony_liquidity)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Priorité de gestion:</Typography>
                    <Chip 
                      label={selectedGoal.management_priority || 'Non défini'} 
                      color={getManagementPriorityColor(selectedGoal.management_priority) as any}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Épargne retraite:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={selectedGoal.retirement_savings ? 'Oui' : 'Non'} 
                        color={selectedGoal.retirement_savings ? 'success' : 'default'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      {selectedGoal.retirement_savings && (
                        <Typography variant="body2">
                          {formatCurrency(selectedGoal.retirement_amount)}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Financement études:</Typography>
                    <Chip 
                      label={selectedGoal.education_funding || 'Non défini'} 
                      color={getEducationFundingColor(selectedGoal.education_funding) as any}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkIcon sx={{ mr: 1 }} /> Projets à 5 ans
                </Typography>
                <List dense>
                  {(selectedGoal.five_year_projects || []).map((project, index) => (
                    <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                      <ListItemText primary={`• ${project}`} />
                    </ListItem>
                  ))}
                  {(!selectedGoal.five_year_projects || selectedGoal.five_year_projects.length === 0) && (
                    <ListItem sx={{ py: 0.5, pl: 0 }}>
                      <ListItemText primary="Aucun projet défini" />
                    </ListItem>
                  )}
                </List>

                <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                  <ChildIcon sx={{ mr: 1 }} /> Situation Familiale
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Enfants à charge:</Typography>
                    <Chip 
                      label={selectedGoal.has_dependent_children ? `${selectedGoal.dependent_children_count} enfant(s)` : 'Aucun'} 
                      color={selectedGoal.has_dependent_children ? 'info' : 'default'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Changements prévus:</Typography>
                    <Chip 
                      label={selectedGoal.expected_changes ? 'Oui' : 'Non'} 
                      color={selectedGoal.expected_changes ? 'warning' : 'default'}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

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
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserGoalsComponent;