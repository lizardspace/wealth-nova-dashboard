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
  patrimony_liquidity: number | null;
  patrimony_goals: string[];
  management_priority: string;
  five_year_projects: string[];
  retirement_savings: boolean;
  retirement_amount: number | null;
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
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, last_name, first_name');

      if (usersError) throw usersError;

      const goals = await Promise.all(users.map(async (user) => {
        const { data: personalinfo, error: piError } = await supabase
          .from('personalinfo')
          .select('objectifs_patrimoniaux, priorite_gestion, projets_5_ans, nb_enfants_charge')
          .eq('user_id', user.id)
          .single();

        const { data: projetsvie, error: pvError } = await supabase
          .from('projetsvie')
          .select('changements_previsibles, financement_etudes, liquidite_patrimoine')
          .eq('user_id', user.id)
          .single();

        const { data: retraite, error: rError } = await supabase
          .from('retraite')
          .select('epargne_retraite, montant_epargne')
          .eq('user_id', user.id)
          .single();

        return {
          user_id: user.id,
          last_name: user.last_name,
          first_name: user.first_name,
          expected_changes: projetsvie?.changements_previsibles,
          education_funding: projetsvie?.financement_etudes,
          patrimony_liquidity: projetsvie?.liquidite_patrimoine,
          patrimony_goals: personalinfo?.objectifs_patrimoniaux,
          management_priority: personalinfo?.priorite_gestion,
          five_year_projects: personalinfo?.projets_5_ans,
          retirement_savings: retraite?.epargne_retraite,
          retirement_amount: retraite?.montant_epargne,
          has_dependent_children: personalinfo?.nb_enfants_charge > 0,
          dependent_children_count: personalinfo?.nb_enfants_charge,
        };
      }));

      setUserGoals(goals);
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

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
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
    
    const retirementAmounts = userGoals
      .filter(goal => goal.retirement_amount !== null && goal.retirement_amount > 0)
      .map(goal => goal.retirement_amount) as number[];
    
    const averageRetirementAmount = retirementAmounts.length > 0 ? 
      retirementAmounts.reduce((sum, amount) => sum + amount, 0) / retirementAmounts.length : 0;
    
    const liquidityAmounts = userGoals
      .filter(goal => goal.patrimony_liquidity !== null && goal.patrimony_liquidity > 0)
      .map(goal => goal.patrimony_liquidity) as number[];
    
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
      valueFormatter: (params) => formatCurrency(params?.value)
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
    name: `${goal.first_name} ${goal.last_name}`,
    patrimony_liquidity: goal.patrimony_liquidity || 0
  }));

  return (
    <Box sx={{ p: 3 }}>
      {/* ... (le reste du code reste inchangé) ... */}
    </Box>
  );
};

export default UserGoalsComponent;