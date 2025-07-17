import React, { useState, useEffect, useMemo } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Tooltip as MuiTooltip,
  useTheme,
  CircularProgress,
  Avatar,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Switch,
  Divider,
  LinearProgress,
  Slider,
  ButtonGroup,
  TablePagination,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  CalendarToday as CalendarIcon,
  Assessment as RiskAssessmentIcon,
  TrendingUp as TrendingUpIcon,
  ExpandMore as ExpandMoreIcon,
  PersonAdd as PersonAddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Analytics as AnalyticsIcon,
  TableChart as TableChartIcon,
  GridView as GridViewIcon,
  Sort as SortIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  InsertChart as InsertChartIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  LocalAtm as LocalAtmIcon
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale
} from 'chart.js';
import { Pie, Bar, Radar, Doughnut } from 'react-chartjs-2';

// Enregistrement des composants ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale
);

// Simulation des données Supabase
const mockInvestorProfiles = [
  {
    user_id: '1',
    last_name: 'Dubois',
    first_name: 'Marie',
    risk_tolerance: 'Prudent',
    reaction_to_drop: 'Vente immédiate',
    profile_type: 'Conservateur',
    risk_asset_percentage: 25,
    investment_horizon: 3,
    investment_horizon_category: 'Court terme',
    risk_score: 3
  },
  {
    user_id: '2',
    last_name: 'Martin',
    first_name: 'Pierre',
    risk_tolerance: 'Équilibré',
    reaction_to_drop: 'Maintien des positions',
    profile_type: 'Modéré',
    risk_asset_percentage: 60,
    investment_horizon: 7,
    investment_horizon_category: 'Moyen terme',
    risk_score: 6
  },
  {
    user_id: '3',
    last_name: 'Leroy',
    first_name: 'Sophie',
    risk_tolerance: 'Dynamique',
    reaction_to_drop: 'Renforcement',
    profile_type: 'Agressif',
    risk_asset_percentage: 85,
    investment_horizon: 15,
    investment_horizon_category: 'Long terme',
    risk_score: 8
  },
  {
    user_id: '4',
    last_name: 'Bernard',
    first_name: 'Jean',
    risk_tolerance: 'Conservateur',
    reaction_to_drop: 'Réduction partielle',
    profile_type: 'Prudent',
    risk_asset_percentage: 15,
    investment_horizon: 2,
    investment_horizon_category: 'Court terme',
    risk_score: 2
  },
  {
    user_id: '5',
    last_name: 'Moreau',
    first_name: 'Claire',
    risk_tolerance: 'Dynamique',
    reaction_to_drop: 'Opportunité d\'achat',
    profile_type: 'Agressif',
    risk_asset_percentage: 90,
    investment_horizon: 20,
    investment_horizon_category: 'Long terme',
    risk_score: 9
  }
];

interface InvestorProfile {
  user_id: string;
  last_name: string;
  first_name: string;
  risk_tolerance: string;
  reaction_to_drop: string;
  profile_type: string;
  risk_asset_percentage: number;
  investment_horizon: number;
  investment_horizon_category: string;
  risk_score: number;
}

type ViewMode = 'table' | 'cards' | 'analytics';
type SortField = 'name' | 'risk_score' | 'risk_asset_percentage' | 'investment_horizon';
type SortDirection = 'asc' | 'desc';

const InvestorProfiles: React.FC = () => {
  const theme = useTheme();
  const [investorProfiles, setInvestorProfiles] = useState<InvestorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRiskTolerance, setFilterRiskTolerance] = useState<string>('');
  const [filterHorizonCategory, setFilterHorizonCategory] = useState<string>('');
  const [filterRiskScore, setFilterRiskScore] = useState<[number, number]>([0, 10]);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [profileDetailOpen, setProfileDetailOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<InvestorProfile | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const fetchInvestorProfiles = async () => {
    setLoading(true);
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvestorProfiles(mockInvestorProfiles);
    } catch (error) {
      console.error('Error fetching investor profiles:', error);
      setSnackbar({
        open: true,
        message: 'Échec du chargement des profils investisseurs',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestorProfiles();
  }, []);

  // Fonctions utilitaires
  const getRiskToleranceColor = (riskTolerance: string) => {
    switch (riskTolerance?.toLowerCase()) {
      case 'prudent':
      case 'conservateur':
        return 'success';
      case 'équilibré':
      case 'modéré':
        return 'warning';
      case 'dynamique':
      case 'agressif':
        return 'error';
      default:
        return 'default';
    }
  };

  const getHorizonCategoryColor = (category: string) => {
    switch (category) {
      case 'Court terme':
        return 'error';
      case 'Moyen terme':
        return 'warning';
      case 'Long terme':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRiskScoreIcon = (score: number) => {
    if (score <= 3) return <CheckCircleIcon color="success" />;
    if (score <= 6) return <WarningIcon color="warning" />;
    return <SecurityIcon color="error" />;
  };

  // Filtrage et tri avancés
  const filteredAndSortedProfiles = useMemo(() => {
    let filtered = investorProfiles.filter(profile => {
      const nameMatch = `${profile.first_name} ${profile.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      const riskMatch = !filterRiskTolerance || profile.risk_tolerance === filterRiskTolerance;
      const horizonMatch = !filterHorizonCategory || profile.investment_horizon_category === filterHorizonCategory;
      const scoreMatch = profile.risk_score >= filterRiskScore[0] && profile.risk_score <= filterRiskScore[1];
      
      return nameMatch && riskMatch && horizonMatch && scoreMatch;
    });

    // Tri
    filtered.sort((a, b) => {
      let valueA: any, valueB: any;
      
      switch (sortField) {
        case 'name':
          valueA = `${a.first_name} ${a.last_name}`.toLowerCase();
          valueB = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'risk_score':
          valueA = a.risk_score;
          valueB = b.risk_score;
          break;
        case 'risk_asset_percentage':
          valueA = a.risk_asset_percentage;
          valueB = b.risk_asset_percentage;
          break;
        case 'investment_horizon':
          valueA = a.investment_horizon;
          valueB = b.investment_horizon;
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [investorProfiles, searchTerm, filterRiskTolerance, filterHorizonCategory, filterRiskScore, sortField, sortDirection]);

  // Pagination
  const paginatedProfiles = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedProfiles.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedProfiles, page, rowsPerPage]);

  // Calculs statistiques avancés
  const stats = useMemo(() => {
    if (investorProfiles.length === 0) return {};

    const riskToleranceStats = investorProfiles.reduce((acc, profile) => {
      const risk = profile.risk_tolerance || 'Non défini';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const horizonStats = investorProfiles.reduce((acc, profile) => {
      const horizon = profile.investment_horizon_category || 'Non défini';
      acc[horizon] = (acc[horizon] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageRiskPercentage = investorProfiles.reduce((sum, profile) => sum + (profile.risk_asset_percentage || 0), 0) / investorProfiles.length;
    const averageHorizon = investorProfiles.reduce((sum, profile) => sum + (profile.investment_horizon || 0), 0) / investorProfiles.length;
    const averageRiskScore = investorProfiles.reduce((sum, profile) => sum + (profile.risk_score || 0), 0) / investorProfiles.length;

    const riskScoreDistribution = investorProfiles.reduce((acc, profile) => {
      const scoreRange = profile.risk_score <= 3 ? 'Faible (1-3)' : 
                        profile.risk_score <= 6 ? 'Modéré (4-6)' : 'Élevé (7-10)';
      acc[scoreRange] = (acc[scoreRange] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      riskToleranceStats,
      horizonStats,
      riskScoreDistribution,
      averageRiskPercentage,
      averageHorizon,
      averageRiskScore,
      totalProfiles: investorProfiles.length,
      dynamicProfiles: Object.entries(riskToleranceStats).reduce((sum, [risk, count]) => {
        return ['dynamique', 'agressif'].includes(risk.toLowerCase()) ? sum + count : sum;
      }, 0)
    };
  }, [investorProfiles]);

  // Données pour les graphiques avancés
  const chartData = useMemo(() => {
    if (!stats.riskToleranceStats) return {};

    const riskToleranceChart = {
      labels: Object.keys(stats.riskToleranceStats),
      datasets: [
        {
          data: Object.values(stats.riskToleranceStats),
          backgroundColor: [
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.error.main,
            theme.palette.grey[500],
          ],
          borderColor: [
            theme.palette.success.dark,
            theme.palette.warning.dark,
            theme.palette.error.dark,
            theme.palette.grey[700],
          ],
          borderWidth: 2,
        },
      ],
    };

    const horizonChart = {
      labels: Object.keys(stats.horizonStats),
      datasets: [
        {
          data: Object.values(stats.horizonStats),
          backgroundColor: [
            theme.palette.error.main,
            theme.palette.warning.main,
            theme.palette.success.main,
            theme.palette.grey[500],
          ],
          borderColor: [
            theme.palette.error.dark,
            theme.palette.warning.dark,
            theme.palette.success.dark,
            theme.palette.grey[700],
          ],
          borderWidth: 2,
        },
      ],
    };

    const riskScoreChart = {
      labels: Object.keys(stats.riskScoreDistribution || {}),
      datasets: [
        {
          label: 'Nombre d\'investisseurs',
          data: Object.values(stats.riskScoreDistribution || {}),
          backgroundColor: [
            theme.palette.success.light,
            theme.palette.warning.light,
            theme.palette.error.light,
          ],
          borderColor: [
            theme.palette.success.dark,
            theme.palette.warning.dark,
            theme.palette.error.dark,
          ],
          borderWidth: 2,
        },
      ],
    };

    const radarChart = {
      labels: ['Tolérance Risque', 'Horizon Long', '% Actifs Risqués', 'Score Élevé', 'Réactivité'],
      datasets: [
        {
          label: 'Profil Moyen',
          data: [
            (stats.averageRiskScore || 0) * 10,
            (stats.averageHorizon || 0) * 5,
            stats.averageRiskPercentage || 0,
            (stats.averageRiskScore || 0) * 10,
            70 // Valeur fictive pour la réactivité
          ],
          backgroundColor: theme.palette.primary.main + '20',
          borderColor: theme.palette.primary.main,
          borderWidth: 2,
        },
      ],
    };

    return {
      riskToleranceChart,
      horizonChart,
      riskScoreChart,
      radarChart
    };
  }, [stats, theme]);

  // Gestionnaires d'événements
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectProfile = (profileId: string) => {
    setSelectedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSelectAllProfiles = () => {
    if (selectedProfiles.length === paginatedProfiles.length) {
      setSelectedProfiles([]);
    } else {
      setSelectedProfiles(paginatedProfiles.map(profile => profile.user_id));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRiskTolerance('');
    setFilterHorizonCategory('');
    setFilterRiskScore([0, 10]);
  };

  const handleRefresh = () => {
    fetchInvestorProfiles();
    setSnackbar({
      open: true,
      message: 'Données actualisées avec succès',
      severity: 'success'
    });
  };

  const handleExportData = () => {
    const data = filteredAndSortedProfiles.map(profile => ({
      Nom: `${profile.first_name} ${profile.last_name}`,
      'Tolérance Risque': profile.risk_tolerance,
      'Réaction Baisse': profile.reaction_to_drop,
      'Type Profil': profile.profile_type,
      'Score Risque': profile.risk_score,
      '% Actifs Risqués': profile.risk_asset_percentage,
      'Horizon (ans)': profile.investment_horizon,
      'Catégorie Horizon': profile.investment_horizon_category
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profils_investisseurs.csv';
    a.click();
    URL.revokeObjectURL(url);

    setSnackbar({
      open: true,
      message: 'Données exportées avec succès',
      severity: 'success'
    });
  };

  const openProfileDetail = (profile: InvestorProfile) => {
    setSelectedProfile(profile);
    setProfileDetailOpen(true);
  };

  // Rendu des composants
  const renderStatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Profils Totaux
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats.totalProfiles || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {filteredAndSortedProfiles.length !== stats.totalProfiles ? 
                    `${filteredAndSortedProfiles.length} filtrés` : 'Tous affichés'}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}>
                <RiskAssessmentIcon fontSize="large" />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}05)` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  % Actifs Risqués Moyen
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {(stats.averageRiskPercentage || 0).toFixed(1)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.averageRiskPercentage || 0} 
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                />
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.success.main, width: 56, height: 56 }}>
                <PieChartIcon fontSize="large" />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.warning.main}05)` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Horizon Moyen
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {(stats.averageHorizon || 0).toFixed(1)} ans
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Score: {(stats.averageRiskScore || 0).toFixed(1)}/10
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 56, height: 56 }}>
                <CalendarIcon fontSize="large" />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${theme.palette.error.main}15, ${theme.palette.error.main}05)` }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Profils Dynamiques
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats.dynamicProfiles || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {stats.totalProfiles > 0 ? Math.round(((stats.dynamicProfiles || 0) / stats.totalProfiles) * 100) : 0}% du total
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: theme.palette.error.main, width: 56, height: 56 }}>
                <TrendingUpIcon fontSize="large" />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCharts = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PieChartIcon color="primary" />
              Répartition par Tolérance au Risque
            </Typography>
            <Box sx={{ height: 320 }}>
              {chartData.riskToleranceChart && (
                <Doughnut 
                  data={chartData.riskToleranceChart} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BarChartIcon color="primary" />
              Distribution des Scores de Risque
            </Typography>
            <Box sx={{ height: 320 }}>
              {chartData.riskScoreChart && (
                <Bar 
                  data={chartData.riskScoreChart} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }} 
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon color="primary" />
              Horizon d'Investissement
            </Typography>
            <Box sx={{ height: 320 }}>
              {chartData.horizonChart && (
                <Pie 
                  data={chartData.horizonChart} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnalyticsIcon color="primary" />
              Profil Radar Moyen
            </Typography>
            <Box sx={{ height: 320 }}>
              {chartData.radarChart && (
                <Radar 
                  data={chartData.radarChart} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }} 
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderFilters = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon color="primary" />
            Recherche et Filtres
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              sx={{ mr: 1 }}
            >
              Effacer
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFilterDialogOpen(true)}
            >
              Filtres Avancés
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher un investisseur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Tolérance au Risque</InputLabel>
              <Select
                value={filterRiskTolerance}
                onChange={(e) => setFilterRiskTolerance(e.target.value)}
                label="Tolérance au Risque"
              >
                <MenuItem value="">Toutes</MenuItem>
                <MenuItem value="Prudent">Prudent</MenuItem>
                <MenuItem value="Conservateur">Conservateur</MenuItem>
                <MenuItem value="Équilibré">Équilibré</MenuItem>
                <MenuItem value="Modéré">Modéré</MenuItem>
                <MenuItem value="Dynamique">Dynamique</MenuItem>
                <MenuItem value="Agressif">Agressif</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Horizon d'Investissement</InputLabel>
              <Select
                value={filterHorizonCategory}
                onChange={(e) => setFilterHorizonCategory(e.target.value)}
                label="Horizon d'Investissement"
              >
                <MenuItem value="">Tous</MenuItem>
                                <MenuItem value="Court terme">Court terme</MenuItem>
                <MenuItem value="Moyen terme">Moyen terme</MenuItem>
                <MenuItem value="Long terme">Long terme</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={() => {}}
            >
              Rechercher
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderTable = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TableChartIcon color="primary" />
            Liste des Profils
          </Typography>
          <Box>
            <ButtonGroup variant="outlined" sx={{ mr: 1 }}>
              <Button 
                startIcon={<GridViewIcon />} 
                onClick={() => setViewMode('cards')}
                disabled={viewMode === 'cards'}
              >
                Cartes
              </Button>
              <Button 
                startIcon={<AnalyticsIcon />} 
                onClick={() => setViewMode('analytics')}
                disabled={viewMode === 'analytics'}
              >
                Analytics
              </Button>
            </ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleExportData}
            >
              Exporter
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedProfiles.length > 0 && selectedProfiles.length < paginatedProfiles.length}
                    checked={selectedProfiles.length === paginatedProfiles.length && paginatedProfiles.length > 0}
                    onChange={handleSelectAllProfiles}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                    Investisseur
                    {sortField === 'name' && (
                      <SortIcon sx={{ 
                        transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                        ml: 0.5 
                      }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>Tolérance au Risque</TableCell>
                <TableCell>Réaction à la Baisse</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSort('risk_score')}>
                    Score Risque
                    {sortField === 'risk_score' && (
                      <SortIcon sx={{ 
                        transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                        ml: 0.5 
                      }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={() => handleSort('risk_asset_percentage')}>
                    % Actifs Risqués
                    {sortField === 'risk_asset_percentage' && (
                      <SortIcon sx={{ 
                        transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                        ml: 0.5 
                      }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }} onClick={() => handleSort('investment_horizon')}>
                    Horizon (ans)
                    {sortField === 'investment_horizon' && (
                      <SortIcon sx={{ 
                        transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                        ml: 0.5 
                      }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>Catégorie Horizon</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProfiles.length > 0 ? (
                paginatedProfiles.map((profile) => (
                  <TableRow key={profile.user_id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedProfiles.includes(profile.user_id)}
                        onChange={() => handleSelectProfile(profile.user_id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: theme.palette.primary.main }}>
                          {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
                        </Avatar>
                        {profile.first_name} {profile.last_name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={profile.risk_tolerance} 
                        color={getRiskToleranceColor(profile.risk_tolerance) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{profile.reaction_to_drop}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getRiskScoreIcon(profile.risk_score)}
                        <Box sx={{ ml: 1 }}>{profile.risk_score}/10</Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <LinearProgress 
                        variant="determinate" 
                        value={profile.risk_asset_percentage} 
                        sx={{ height: 6, borderRadius: 3, mb: 0.5 }}
                        color={
                          profile.risk_asset_percentage >= 70 ? 'error' : 
                          profile.risk_asset_percentage >= 40 ? 'warning' : 'success'
                        }
                      />
                      {profile.risk_asset_percentage}%
                    </TableCell>
                    <TableCell align="right">{profile.investment_horizon}</TableCell>
                    <TableCell>
                      <Chip 
                        label={profile.investment_horizon_category} 
                        color={getHorizonCategoryColor(profile.investment_horizon_category) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => openProfileDetail(profile)} color="primary">
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Aucun profil ne correspond aux critères de recherche
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAndSortedProfiles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </CardContent>
    </Card>
  );

  const renderProfileCards = () => (
    <Grid container spacing={3}>
      {paginatedProfiles.map((profile) => (
        <Grid item xs={12} sm={6} md={4} key={profile.user_id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 48, height: 48, mr: 2, bgcolor: theme.palette.primary.main }}>
                    {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{profile.first_name} {profile.last_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile.profile_type}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton onClick={() => openProfileDetail(profile)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tolérance au risque
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={profile.risk_tolerance} 
                    color={getRiskToleranceColor(profile.risk_tolerance) as any}
                    size="small"
                  />
                  <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                    {getRiskScoreIcon(profile.risk_score)}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {profile.risk_score}/10
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    % Actifs risqués
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={profile.risk_asset_percentage} 
                    sx={{ height: 8, borderRadius: 2, mb: 0.5 }}
                    color={
                      profile.risk_asset_percentage >= 70 ? 'error' : 
                      profile.risk_asset_percentage >= 40 ? 'warning' : 'success'
                    }
                  />
                  <Typography variant="body2">
                    {profile.risk_asset_percentage}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Horizon
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={profile.investment_horizon_category} 
                      color={getHorizonCategoryColor(profile.investment_horizon_category) as any}
                      size="small"
                    />
                    <Typography variant="body2" sx={{ ml: 'auto' }}>
                      {profile.investment_horizon} ans
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Réaction à une baisse
                </Typography>
                <Typography variant="body2">
                  {profile.reaction_to_drop}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderProfileDetail = () => (
    <Dialog 
      open={profileDetailOpen} 
      onClose={() => setProfileDetailOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            {selectedProfile?.first_name.charAt(0)}{selectedProfile?.last_name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {selectedProfile?.first_name} {selectedProfile?.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Profil {selectedProfile?.profile_type}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {selectedProfile && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RiskAssessmentIcon color="primary" />
                Évaluation du Risque
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Score de risque
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={selectedProfile.risk_score}
                    min={0}
                    max={10}
                    step={1}
                    marks
                    disabled
                    sx={{ flexGrow: 1 }}
                  />
                  <Chip 
                    label={`${selectedProfile.risk_score}/10`} 
                    color={
                      selectedProfile.risk_score >= 7 ? 'error' : 
                      selectedProfile.risk_score >= 4 ? 'warning' : 'success'
                    }
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Pourcentage d'actifs risqués
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={selectedProfile.risk_asset_percentage} 
                    sx={{ height: 10, borderRadius: 5, flexGrow: 1 }}
                    color={
                      selectedProfile.risk_asset_percentage >= 70 ? 'error' : 
                      selectedProfile.risk_asset_percentage >= 40 ? 'warning' : 'success'
                    }
                  />
                  <Typography variant="body2">
                    {selectedProfile.risk_asset_percentage}%
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tolérance au risque
                </Typography>
                <Chip 
                  label={selectedProfile.risk_tolerance} 
                  color={getRiskToleranceColor(selectedProfile.risk_tolerance) as any}
                  sx={{ fontSize: '0.875rem' }}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Réaction à une baisse de marché
                </Typography>
                <Typography variant="body2">
                  {selectedProfile.reaction_to_drop}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon color="primary" />
                Horizon d'Investissement
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Durée (années)
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={selectedProfile.investment_horizon}
                    min={0}
                    max={30}
                    step={1}
                    marks={[{ value: 0, label: '0' }, { value: 30, label: '30' }]}
                    disabled
                    sx={{ flexGrow: 1 }}
                  />
                  <Chip 
                    label={`${selectedProfile.investment_horizon} ans`} 
                    color={getHorizonCategoryColor(selectedProfile.investment_horizon_category) as any}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Catégorie d'horizon
                </Typography>
                <Chip 
                  label={selectedProfile.investment_horizon_category} 
                  color={getHorizonCategoryColor(selectedProfile.investment_horizon_category) as any}
                  sx={{ fontSize: '0.875rem' }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AnalyticsIcon color="primary" />
                  Recommandations
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 1, 
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="body2" gutterBottom>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>Allocation suggérée:</Box> {getSuggestedAllocation(selectedProfile)}
                  </Typography>
                  <Typography variant="body2">
                    <Box component="span" sx={{ fontWeight: 'bold' }}>Stratégie:</Box> {getSuggestedStrategy(selectedProfile)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setProfileDetailOpen(false)}>Fermer</Button>
        <Button 
          variant="contained" 
          startIcon={<EditIcon />}
          onClick={() => {
            setProfileDetailOpen(false);
            // Navigation vers l'édition du profil
          }}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderFilterDialog = () => (
    <Dialog 
      open={filterDialogOpen} 
      onClose={() => setFilterDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterIcon color="primary" />
        Filtres Avancés
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Score de Risque
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={filterRiskScore}
              onChange={(_, newValue) => setFilterRiskScore(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={1}
              marks={[
                { value: 0, label: '0' },
                { value: 10, label: '10' }
              ]}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Min: {filterRiskScore[0]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Max: {filterRiskScore[1]}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Pourcentage d'Actifs Risqués
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={[0, 100]}
              disabled
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Min: 0%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Max: 100%
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Options Supplémentaires
          </Typography>
          <FormControlLabel
            control={<Switch checked={showAdvancedFilters} onChange={(e) => setShowAdvancedFilters(e.target.checked)} />}
            label="Afficher les filtres avancés"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setFilterDialogOpen(false)}>Annuler</Button>
        <Button 
          variant="contained" 
          onClick={() => {
            setFilterDialogOpen(false);
            setPage(0);
          }}
        >
          Appliquer
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Fonctions utilitaires pour les recommandations
  const getSuggestedAllocation = (profile: InvestorProfile) => {
    if (profile.risk_score <= 3) return "80% Obligations, 15% Actions, 5% Liquidités";
    if (profile.risk_score <= 6) return "50% Actions, 40% Obligations, 10% Alternatives";
    return "80% Actions, 15% Alternatives, 5% Obligations";
  };

  const getSuggestedStrategy = (profile: InvestorProfile) => {
    if (profile.risk_score <= 3) return "Stratégie défensive avec accent sur la préservation du capital";
    if (profile.risk_score <= 6) return "Approche équilibrée entre croissance et stabilité";
    return "Stratégie offensive axée sur la croissance à long terme";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/">
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Accueil
          </Link>
          <Link underline="hover" color="inherit" href="/clients">
            Clients
          </Link>
          <Typography color="text.primary">
            Profils Investisseurs
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon fontSize="large" />
            Analyse des Profils Investisseurs
          </Typography>
          <Box>
            <MuiTooltip title="Actualiser les données">
              <IconButton onClick={handleRefresh} color="primary" sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            </MuiTooltip>
            <Fab
              variant="extended"
              color="primary"
              size="medium"
              onClick={() => {}}
              sx={{ boxShadow: 'none', textTransform: 'none' }}
            >
              <PersonAddIcon sx={{ mr: 1 }} />
              Nouveau Profil
            </Fab>
          </Box>
        </Box>
      </Box>

      {renderStatsCards()}
      {viewMode === 'analytics' && renderCharts()}
      {renderFilters()}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {viewMode === 'table' && renderTable()}
          {viewMode === 'cards' && renderProfileCards()}
        </>
      )}

      {renderProfileDetail()}
      {renderFilterDialog()}

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

export default InvestorProfiles;
