import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
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
  MenuItem,
  Chip,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  LocalHospital as HealthIcon,
  Restaurant as FoodIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { supabase } from '../../../lib/supabase';

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

const categoryIcons: Record<string, JSX.Element> = {
  loyer: <HomeIcon />,
  charges_loyer: <HomeIcon color="secondary" />,
  assurances: <MoneyIcon />,
  transport: <CarIcon />,
  alimentation: <FoodIcon />,
  loisirs: <FoodIcon color="secondary" />,
  etudes: <SchoolIcon />,
  sante: <HealthIcon />,
  divers: <MoneyIcon color="secondary" />
};

const TrainDeVieListPage: React.FC = () => {
  const [trainDeVie, setTrainDeVie] = useState<TrainDeVie[]>([]);
  const [currentItem, setCurrentItem] = useState<TrainDeVie | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

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
        setSnackbar({
          open: true,
          message: 'Failed to fetch data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (item: TrainDeVie) => {
    setCurrentItem(item);
    setOpenEditModal(true);
  };

  const handleNewItemClick = () => {
    setCurrentItem({
      id: '',
      user_id: '',
      loyer: 0,
      charges_loyer: 0,
      assurances: 0,
      transport: 0,
      alimentation: 0,
      loisirs: 0,
      etudes: 0,
      sante: 0,
      divers: 0,
      total: 0,
      created_at: new Date().toISOString()
    });
    setOpenEditModal(true);
  };

  const calculateTotal = (item: TrainDeVie) => {
    return (
      item.loyer +
      item.charges_loyer +
      item.assurances +
      item.transport +
      item.alimentation +
      item.loisirs +
      item.etudes +
      item.sante +
      item.divers
    );
  };

  const handleSaveItem = async () => {
    if (!currentItem) return;

    // Calculate total before saving
    const itemToSave = {
      ...currentItem,
      total: calculateTotal(currentItem)
    };

    setLoading(true);
    try {
      if (!itemToSave.id) {
        const { data, error } = await supabase
          .from('traindevie')
          .insert([itemToSave])
          .select()
          .single();

        if (error) throw error;
        
        setTrainDeVie([data, ...trainDeVie]);
        setSnackbar({
          open: true,
          message: 'Train de vie créé avec succès',
          severity: 'success'
        });
      } else {
        const { error } = await supabase
          .from('traindevie')
          .update(itemToSave)
          .eq('id', itemToSave.id);

        if (error) throw error;
        
        setTrainDeVie(trainDeVie.map(t => t.id === itemToSave.id ? itemToSave : t));
        setSnackbar({
          open: true,
          message: 'Train de vie mis à jour',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error saving train de vie:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!currentItem) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('traindevie')
        .delete()
        .eq('id', currentItem.id);

      if (error) throw error;
      
      setTrainDeVie(trainDeVie.filter(t => t.id !== currentItem.id));
      setSnackbar({
        open: true,
        message: 'Train de vie supprimé avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting train de vie:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
      setOpenEditModal(false);
    }
  };

  const filteredItems = trainDeVie.filter(item => {
    const userMatch = users.find(u => u.id === item.user_id);
    return (
      (userMatch?.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (userMatch?.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Inconnu';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const renderCategoryValue = (category: string, value: number) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {categoryIcons[category]}
        <Box sx={{ ml: 1 }}>{formatCurrency(value)}</Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestion du train de vie</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewItemClick}
        >
          Nouveau train de vie
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Rechercher par utilisateur"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading && !openEditModal ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Logement</TableCell>
                  <TableCell>Transport</TableCell>
                  <TableCell>Alimentation</TableCell>
                  <TableCell>Santé</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{getUserName(item.user_id)}</TableCell>
                    <TableCell>
                      {renderCategoryValue('loyer', item.loyer)}
                      {renderCategoryValue('charges_loyer', item.charges_loyer)}
                    </TableCell>
                    <TableCell>
                      {renderCategoryValue('transport', item.transport)}
                    </TableCell>
                    <TableCell>
                      {renderCategoryValue('alimentation', item.alimentation)}
                      {renderCategoryValue('loisirs', item.loisirs)}
                    </TableCell>
                    <TableCell>
                      {renderCategoryValue('sante', item.sante)}
                      {renderCategoryValue('assurances', item.assurances)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={formatCurrency(item.total)} 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(item)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog 
        open={openEditModal} 
        onClose={() => setOpenEditModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {currentItem?.id ? 'Modifier le train de vie' : 'Créer un nouveau train de vie'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Utilisateur</InputLabel>
                <Select
                  label="Utilisateur"
                  value={currentItem?.user_id || ''}
                  onChange={(e) => currentItem && setCurrentItem({
                    ...currentItem,
                    user_id: e.target.value
                  })}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Logement
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Loyer (€)"
                type="number"
                value={currentItem?.loyer || ''}
                onChange={(e) => currentItem && setCurrentItem({
                  ...currentItem,
                  loyer: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Charges (€)"
                type="number"
                value={currentItem?.charges_loyer || ''}
                onChange={(e) => currentItem && setCurrentItem({
                  ...currentItem,
                  charges_loyer: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Transport
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Transport (€)"
                type="number"
                value={currentItem?.transport || ''}
                onChange={(e) => currentItem && setCurrentItem({
                  ...currentItem,
                  transport: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Alimentation & Loisirs
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alimentation (€)"
                type="number"
                value={currentItem?.alimentation || ''}
                onChange={(e) => currentItem && setCurrentItem({
                  ...currentItem,
                  alimentation: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Loisirs (€)"
                type="number"
                value={currentItem?.loisirs || ''}
                onChange={(e) => currentItem && setCurrentItem({
                  ...currentItem,
                  loisirs: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Santé & Assurances
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Santé (€)"
                type="number"
                value={currentItem?.sante || ''}
                onChange={(e) => currentItem && setCurrentItem({
                  ...currentItem,
                  sante: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assurances (€)"
                type="number"
                value={currentItem?.assurances || ''}
                onChange={(e) => currentItem && setCurrentItem({
                  ...currentItem,
                  assurances: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Divers
              </Typography>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Études (€)"
                type="number"
                value={currentItem?.etudes || ''}
                onChange={(e) => currentItem && setCurrentItem({
                  ...currentItem,
                  etudes: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Autres dépenses (€)"
                type="number"
                value={currentItem?.divers || ''}
                onChange={(e) => currentItem && setCurrentItem({
                  ...currentItem,
                  divers: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total: {formatCurrency(currentItem ? calculateTotal(currentItem) : 0)}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenEditModal(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          {currentItem?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Supprimer
            </Button>
          )}
          <Button 
            onClick={handleSaveItem}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce train de vie ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteItem} 
            color="error"
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default TrainDeVieListPage;