import React, { useState, useEffect } from 'react';
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
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon,
  RiskAssessment as RiskAssessmentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { supabase } from '../../../lib/supabase';

// Enregistrer les composants ChartJS
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

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

const InvestorProfiles: React.FC = () => {
  const theme = useTheme();
  const [investorProfiles, setInvestorProfiles] = useState<InvestorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRiskTolerance, setFilterRiskTolerance] = useState<string>('');
  const [filterHorizonCategory, setFilterHorizonCategory] = useState<string>('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // Fetch investor profiles from view
  const fetchInvestorProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('investor_profiles')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setInvestorProfiles(data || []);
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

  const filteredProfiles = investorProfiles.filter(profile => {
    const nameMatch = `${profile.first_name} ${profile.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const riskMatch = !filterRiskTolerance || profile.risk_tolerance === filterRiskTolerance;
    const horizonMatch = !filterHorizonCategory || profile.investment_horizon_category === filterHorizonCategory;
    
    return nameMatch && riskMatch && horizonMatch;
  });

  // Statistics calculations
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

  const averageRiskPercentage = investorProfiles.length > 0 ? 
    investorProfiles.reduce((sum, profile) => sum + (profile.risk_asset_percentage || 0), 0) / investorProfiles.length : 0;

  const averageHorizon = investorProfiles.length > 0 ? 
    investorProfiles.reduce((sum, profile) => sum + (profile.investment_horizon || 0), 0) / investorProfiles.length : 0;

  const dynamicProfilesCount = Object.entries(riskToleranceStats).reduce((sum, [risk, count]) => {
    return ['dynamique', 'agressif'].includes(risk.toLowerCase()) ? sum + count : sum;
  }, 0);

  // Chart data for risk tolerance distribution
  const riskToleranceChartData = {
    labels: Object.keys(riskToleranceStats),
    datasets: [
      {
        data: Object.values(riskToleranceStats),
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
        borderWidth: 1,
      },
    ],
  };

  // Chart data for investment horizon distribution
  const horizonChartData = {
    labels: Object.keys(horizonStats),
    datasets: [
      {
        data: Object.values(horizonStats),
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
        borderWidth: 1,
      },
    ],
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
    // Implement export functionality
    setSnackbar({
      open: true,
      message: 'Fonctionnalité d\'export à implémenter',
      severity: 'info'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analyse des Profils Investisseurs
        </Typography>
        <Box>
          <Tooltip title="Actualiser les données">
            <IconButton onClick={handleRefresh} color="primary" sx={{ mr: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Exporter les données">
            <IconButton onClick={handleExportData} color="primary">
              <DownloadIcon />
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
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Profils Totaux
                  </Typography>
                  <Typography variant="h5" component="div">
                    {investorProfiles.length}
                  </Typography>
                </Box>
                <RiskAssessmentIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    % Actifs Risqués Moyen
                  </Typography>
                  <Typography variant="h5" component="div">
                    {averageRiskPercentage.toFixed(1)}%
                  </Typography>
                </Box>
                <PieChartIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Horizon Moyen
                  </Typography>
                  <Typography variant="h5" component="div">
                    {averageHorizon.toFixed(1)} ans
                  </Typography>
                </Box>
                <CalendarIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Profils Dynamiques
                  </Typography>
                  <Typography variant="h5" component="div">
                    {dynamicProfilesCount}
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      ({investorProfiles.length > 0 ? Math.round((dynamicProfilesCount / investorProfiles.length) * 100) : 0}%)
                    </Typography>
                  </Typography>
                </Box>
                <TrendingUpIcon color="success" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Répartition par Tolérance au Risque
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={riskToleranceChartData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Répartition par Horizon d'Investissement
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={horizonChartData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
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
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="risk-tolerance-filter">Tolérance au Risque</InputLabel>
          <Select
            labelId="risk-tolerance-filter"
            value={filterRiskTolerance}
            onChange={(e) => setFilterRiskTolerance(e.target.value as string)}
            label="Tolérance au Risque"
          >
            <MenuItem value="">Toutes les tolérances</MenuItem>
            {Object.keys(riskToleranceStats).map(risk => (
              <MenuItem key={risk} value={risk}>{risk}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="horizon-filter">Horizon d'Investissement</InputLabel>
          <Select
            labelId="horizon-filter"
            value={filterHorizonCategory}
            onChange={(e) => setFilterHorizonCategory(e.target.value as string)}
            label="Horizon d'Investissement"
          >
            <MenuItem value="">Tous les horizons</MenuItem>
            <MenuItem value="Court terme">Court terme</MenuItem>
            <MenuItem value="Moyen terme">Moyen terme</MenuItem>
            <MenuItem value="Long terme">Long terme</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Investisseur</TableCell>
                  <TableCell>Tolérance au Risque</TableCell>
                  <TableCell>Réaction à la Baisse</TableCell>
                  <TableCell>Type de Profil</TableCell>
                  <TableCell align="right">Score de Risque</TableCell>
                  <TableCell align="right">% Actifs Risqués</TableCell>
                  <TableCell align="right">Horizon (ans)</TableCell>
                  <TableCell>Catégorie Horizon</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((profile) => (
                    <TableRow key={profile.user_id} hover>
                      <TableCell>
                        {profile.first_name} {profile.last_name}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={profile.risk_tolerance || 'Non défini'} 
                          color={getRiskToleranceColor(profile.risk_tolerance) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{profile.reaction_to_drop || 'Non défini'}</TableCell>
                      <TableCell>{profile.profile_type || 'Non défini'}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={profile.risk_score || 'N/A'} 
                          color={
                            profile.risk_score >= 7 ? 'error' : 
                            profile.risk_score >= 4 ? 'warning' : 'success'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {profile.risk_asset_percentage ? `${profile.risk_asset_percentage}%` : 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {profile.investment_horizon || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={profile.investment_horizon_category || 'Non défini'} 
                          color={getHorizonCategoryColor(profile.investment_horizon_category) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Aucun profil ne correspond aux critères de recherche
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvestorProfiles;