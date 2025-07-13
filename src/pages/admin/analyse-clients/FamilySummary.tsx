import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Grid,
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
  Avatar,
  AvatarGroup,
  TableSortLabel,
  TablePagination,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  Favorite as FavoriteIcon,
  Link as LinkIcon,
  AttachMoney as AttachMoneyIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  FamilyRestroom as FamilyIcon
} from '@mui/icons-material';
import { supabase } from './../../../lib/supabase';
import { CSVLink } from 'react-csv';

interface FamilySummary {
  family_id: string;
  user1_id: string;
  user1_last_name: string;
  user1_first_name: string;
  user2_id: string;
  user2_last_name: string;
  user2_first_name: string;
  relation: string;
  linked: boolean;
  family_total_assets: number;
  family_net_worth: number;
  accepted_invitations: number;
  pending_invitations: number;
  link_status: string;
  wealth_category: string;
}

type Order = 'asc' | 'desc';

const FamilySummary: React.FC = () => {
  const [familySummaries, setFamilySummaries] = useState<FamilySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRelation, setFilterRelation] = useState('');
  const [filterLinked, setFilterLinked] = useState('');
  const [filterWealth, setFilterWealth] = useState('');
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof FamilySummary>('family_net_worth');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedFamily, setSelectedFamily] = useState<FamilySummary | null>(null);
  const [openDetails, setOpenDetails] = useState(false);

  // Fetch family summaries from view
  useEffect(() => {
    const fetchFamilySummaries = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('family_summary')
          .select('*');

        if (error) throw error;
        setFamilySummaries(data || []);
      } catch (err) {
        console.error('Error fetching family summaries:', err);
        setError('Failed to fetch family summary data');
      } finally {
        setLoading(false);
      }
    };

    fetchFamilySummaries();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRelationColor = (relation: string) => {
    if (!relation) return 'default';
    switch (relation.toLowerCase()) {
      case 'conjoint':
      case 'époux':
      case 'épouse':
        return 'error';
      case 'enfant':
      case 'fils':
      case 'fille':
        return 'primary';
      case 'parent':
      case 'père':
      case 'mère':
        return 'secondary';
      case 'frère':
      case 'sœur':
        return 'info';
      default:
        return 'default';
    }
  };

  const getWealthColor = (category: string) => {
    if (!category) return 'default';
    switch (category.toLowerCase()) {
      case 'patrimoine modeste':
        return 'info';
      case 'patrimoine moyen':
        return 'primary';
      case 'patrimoine important':
        return 'success';
      case 'patrimoine très élevé':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleRequestSort = (property: keyof FamilySummary) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetails = (family: FamilySummary) => {
    setSelectedFamily(family);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const filteredFamilies = familySummaries.filter(family => {
    const nameMatch = 
      `${family.user1_first_name} ${family.user1_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${family.user2_first_name} ${family.user2_last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const relationMatch = !filterRelation || family.relation === filterRelation;
    const linkedMatch = !filterLinked || 
      (filterLinked === 'true' && family.linked) ||
      (filterLinked === 'false' && !family.linked);
    const wealthMatch = !filterWealth || family.wealth_category === filterWealth;
    
    return nameMatch && relationMatch && linkedMatch && wealthMatch;
  });

  const sortedFamilies = filteredFamilies.sort((a, b) => {
    if (a[orderBy] === null) return 1;
    if (b[orderBy] === null) return -1;
    if (a[orderBy] === b[orderBy]) return 0;

    const compareResult = 
      typeof a[orderBy] === 'number' && typeof b[orderBy] === 'number'
        ? (a[orderBy] as number) - (b[orderBy] as number)
        : String(a[orderBy]).localeCompare(String(b[orderBy]));

    return order === 'asc' ? compareResult : -compareResult;
  });

  const paginatedFamilies = sortedFamilies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Statistics calculations
  const totalFamilyAssets = familySummaries.reduce((sum, family) => sum + (family.family_total_assets || 0), 0);
  const totalFamilyNetWorth = familySummaries.reduce((sum, family) => sum + (family.family_net_worth || 0), 0);
  const averageFamilyAssets = familySummaries.length > 0 ? totalFamilyAssets / familySummaries.length : 0;
  const averageFamilyNetWorth = familySummaries.length > 0 ? totalFamilyNetWorth / familySummaries.length : 0;

  const linkedFamilies = familySummaries.filter(family => family.linked).length;
  const unlinkedFamilies = familySummaries.filter(family => !family.linked).length;

  // Relation distribution
  const relationStats = familySummaries.reduce((acc, family) => {
    const relation = family.relation || 'Non défini';
    acc[relation] = (acc[relation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Wealth category distribution
  const wealthCategoryStats = familySummaries.reduce((acc, family) => {
    const category = family.wealth_category || 'Non défini';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Prepare data for CSV export
  const csvData = filteredFamilies.map(family => ({
    'ID Famille': family.family_id,
    'Membre 1': `${family.user1_first_name} ${family.user1_last_name}`,
    'Membre 2': `${family.user2_first_name} ${family.user2_last_name}`,
    'Relation': family.relation,
    'Statut': family.linked ? 'Liée' : 'Non liée',
    'Patrimoine Total': formatCurrency(family.family_total_assets),
    'Patrimoine Net': formatCurrency(family.family_net_worth),
    'Catégorie Patrimoine': family.wealth_category,
    'Invitations Acceptées': family.accepted_invitations,
    'Invitations En Attente': family.pending_invitations
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Synthèse Familles</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<DownloadIcon />}
            sx={{ mr: 2 }}
          >
            <CSVLink 
              data={csvData} 
              filename={`familles-${new Date().toISOString().slice(0, 10)}.csv`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Exporter CSV
            </CSVLink>
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Familles
                  </Typography>
                  <Typography variant="h5">
                    {familySummaries.length}
                  </Typography>
                </Box>
                <PeopleIcon fontSize="large" color="primary" />
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
                    Familles Liées
                  </Typography>
                  <Typography variant="h5">
                    {linkedFamilies} ({((linkedFamilies / familySummaries.length) * 100).toFixed(1)}%)
                  </Typography>
                </Box>
                <LinkIcon fontSize="large" color="success" />
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
                    Patrimoine Moyen
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(averageFamilyAssets)}
                  </Typography>
                </Box>
                <AttachMoneyIcon fontSize="large" color="primary" />
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
                    Patrimoine Net Moyen
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(averageFamilyNetWorth)}
                  </Typography>
                </Box>
                <TrendingUpIcon fontSize="large" color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Rechercher une famille"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <PeopleIcon color="action" sx={{ mr: 1 }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Type de Relation</InputLabel>
            <Select
              value={filterRelation}
              label="Type de Relation"
              onChange={(e) => setFilterRelation(e.target.value)}
            >
              <MenuItem value="">Toutes</MenuItem>
              {Object.keys(relationStats).map(relation => (
                <MenuItem key={relation} value={relation}>{relation}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Statut de Liaison</InputLabel>
            <Select
              value={filterLinked}
              label="Statut de Liaison"
              onChange={(e) => setFilterLinked(e.target.value)}
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="true">Liées</MenuItem>
              <MenuItem value="false">Non liées</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Catégorie Patrimoine</InputLabel>
            <Select
              value={filterWealth}
              label="Catégorie Patrimoine"
              onChange={(e) => setFilterWealth(e.target.value)}
            >
              <MenuItem value="">Toutes</MenuItem>
              {Object.keys(wealthCategoryStats).map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      ) : (
        <>
          <Paper sx={{ mb: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'user1_last_name'}
                        direction={orderBy === 'user1_last_name' ? order : 'asc'}
                        onClick={() => handleRequestSort('user1_last_name')}
                      >
                        Membres de la Famille
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'relation'}
                        direction={orderBy === 'relation' ? order : 'asc'}
                        onClick={() => handleRequestSort('relation')}
                      >
                        Relation
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'linked'}
                        direction={orderBy === 'linked' ? order : 'asc'}
                        onClick={() => handleRequestSort('linked')}
                      >
                        Statut
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'family_total_assets'}
                        direction={orderBy === 'family_total_assets' ? order : 'desc'}
                        onClick={() => handleRequestSort('family_total_assets')}
                      >
                        Patrimoine Total
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'family_net_worth'}
                        direction={orderBy === 'family_net_worth' ? order : 'desc'}
                        onClick={() => handleRequestSort('family_net_worth')}
                      >
                        Patrimoine Net
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'wealth_category'}
                        direction={orderBy === 'wealth_category' ? order : 'asc'}
                        onClick={() => handleRequestSort('wealth_category')}
                      >
                        Catégorie
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedFamilies.map((family) => (
                    <TableRow key={family.family_id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AvatarGroup max={2} sx={{ mr: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                              {getInitials(family.user1_first_name, family.user1_last_name)}
                            </Avatar>
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.875rem' }}>
                              {getInitials(family.user2_first_name, family.user2_last_name)}
                            </Avatar>
                          </AvatarGroup>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {family.user1_first_name} {family.user1_last_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {family.user2_first_name} {family.user2_last_name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={family.relation || 'Non défini'} 
                          color={getRelationColor(family.relation) as any}
                          size="small"
                          icon={<FavoriteIcon fontSize="small" />}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={family.linked ? 'Liée' : 'Non liée'} 
                          color={family.linked ? 'success' : 'default'}
                          size="small"
                          icon={family.linked ? <CheckCircleIcon fontSize="small" /> : <PendingIcon fontSize="small" />}
                        />
                        {family.pending_invitations > 0 && (
                          <Tooltip title={`${family.pending_invitations} invitation(s) en attente`}>
                            <Chip 
                              label={family.pending_invitations}
                              color="warning"
                              size="small"
                              sx={{ ml: 1 }}
                              icon={<PendingIcon fontSize="small" />}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(family.family_total_assets)}
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        fontWeight: 'bold',
                        color: family.family_net_worth >= 0 ? 'success.main' : 'error.main'
                      }}>
                        {formatCurrency(family.family_net_worth)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={family.wealth_category || 'Non défini'} 
                          color={getWealthColor(family.wealth_category) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Voir les détails">
                          <IconButton onClick={() => handleOpenDetails(family)}>
                            <InfoIcon color="info" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredFamilies.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
            />
          </Paper>

          {/* Family Details Dialog */}
          <Dialog 
            open={openDetails} 
            onClose={handleCloseDetails}
            maxWidth="md"
            fullWidth
          >
            {selectedFamily && (
              <>
                <DialogTitle>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FamilyIcon color="primary" sx={{ mr: 2 }} />
                    Détails de la Famille
                  </Box>
                </DialogTitle>
                <DialogContent dividers>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Membres de la Famille
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {getInitials(selectedFamily.user1_first_name, selectedFamily.user1_last_name)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${selectedFamily.user1_first_name} ${selectedFamily.user1_last_name}`}
                            secondary={`ID: ${selectedFamily.user1_id}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                              {getInitials(selectedFamily.user2_first_name, selectedFamily.user2_last_name)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${selectedFamily.user2_first_name} ${selectedFamily.user2_last_name}`}
                            secondary={`ID: ${selectedFamily.user2_id}`}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Informations Générales
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Relation" 
                            secondary={
                              <Chip 
                                label={selectedFamily.relation || 'Non défini'} 
                                color={getRelationColor(selectedFamily.relation) as any}
                                size="small"
                                icon={<FavoriteIcon fontSize="small" />}
                              />
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Statut de Liaison" 
                            secondary={
                              <Chip 
                                label={selectedFamily.linked ? 'Liée' : 'Non liée'} 
                                color={selectedFamily.linked ? 'success' : 'default'}
                                size="small"
                                icon={selectedFamily.linked ? <CheckCircleIcon fontSize="small" /> : <PendingIcon fontSize="small" />}
                              />
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Invitations" 
                            secondary={
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip 
                                  label={`${selectedFamily.accepted_invitations} acceptée(s)`} 
                                  color="success"
                                  size="small"
                                  icon={<CheckCircleIcon fontSize="small" />}
                                />
                                {selectedFamily.pending_invitations > 0 && (
                                  <Chip 
                                    label={`${selectedFamily.pending_invitations} en attente`} 
                                    color="warning"
                                    size="small"
                                    icon={<PendingIcon fontSize="small" />}
                                  />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Patrimoine
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Patrimoine Total" 
                            secondary={
                              <Typography variant="body1" fontWeight="bold">
                                {formatCurrency(selectedFamily.family_total_assets)}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Patrimoine Net" 
                            secondary={
                              <Typography 
                                variant="body1" 
                                fontWeight="bold"
                                color={selectedFamily.family_net_worth >= 0 ? 'success.main' : 'error.main'}
                              >
                                {formatCurrency(selectedFamily.family_net_worth)}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Catégorisation
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Catégorie de Patrimoine" 
                            secondary={
                              <Chip 
                                label={selectedFamily.wealth_category || 'Non défini'} 
                                color={getWealthColor(selectedFamily.wealth_category) as any}
                              />
                            }
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDetails}>Fermer</Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default FamilySummary;