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
  Chip
} from '@mui/material';
import {
  Edit2 as EditIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
  Plus as AddIcon
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

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

const assetTypes = [
  { value: 'immobilier', label: 'Immobilier' },
  { value: 'banque', label: 'Compte bancaire' },
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'assurance_vie', label: 'Assurance vie' },
  { value: 'autres', label: 'Autres' }
];

const frequencyTypes = [
  { value: 'non_recurrente', label: 'Non récurrente' },
  { value: 'monthly', label: 'Mensuelle' },
  { value: 'annual', label: 'Annuelle' }
];

const BudgetListPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
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
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: budgetsData, error: budgetsError } = await supabase
          .from('budget')
          .select('*')
          .order('date_creation', { ascending: false });

        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (budgetsError) throw budgetsError;
        if (usersError) throw usersError;

        setBudgets(budgetsData || []);
        setUsers(usersData || []);

        // Récupérer les actifs pour les liaisons
        const { data: biensData } = await supabase.from('bienimmobilier').select('id, libelle');
        const { data: comptesData } = await supabase.from('comptebancaire').select('id, libelle');
        const { data: entreprisesData } = await supabase.from('entrepriseparticipation').select('id, libelle');
        const { data: assurancesData } = await supabase.from('assurancevie').select('id, libelle');
        
        setAssets([
          ...(biensData?.map(b => ({ ...b, type: 'immobilier' })) || []),
          ...(comptesData?.map(c => ({ ...c, type: 'banque' })) || []),
          ...(entreprisesData?.map(e => ({ ...e, type: 'entreprise' })) || []),
          ...(assurancesData?.map(a => ({ ...a, type: 'assurance_vie' })) || [])
        ]);
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

  const handleEditClick = (budget: Budget) => {
    setCurrentBudget(budget);
    setOpenEditModal(true);
  };

  const handleNewBudgetClick = () => {
    setCurrentBudget({
      id: '',
      user_id: '',
      asset_type: 'autres',
      asset_id: null,
      libelle: '',
      montant: 0,
      frequency: 'monthly',
      date_creation: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setOpenEditModal(true);
  };

  const handleSaveBudget = async () => {
    if (!currentBudget) return;

    setLoading(true);
    try {
      if (!currentBudget.id) {
        const { data, error } = await supabase
          .from('budget')
          .insert([currentBudget])
          .select()
          .single();

        if (error) throw error;
        
        setBudgets([data, ...budgets]);
        setSnackbar({
          open: true,
          message: 'Budget créé avec succès',
          severity: 'success'
        });
      } else {
        const { error } = await supabase
          .from('budget')
          .update(currentBudget)
          .eq('id', currentBudget.id);

        if (error) throw error;
        
        setBudgets(budgets.map(b => b.id === currentBudget.id ? currentBudget : b));
        setSnackbar({
          open: true,
          message: 'Budget mis à jour',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error saving budget:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async () => {
    if (!currentBudget) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('budget')
        .delete()
        .eq('id', currentBudget.id);

      if (error) throw error;
      
      setBudgets(budgets.filter(b => b.id !== currentBudget.id));
      setSnackbar({
        open: true,
        message: 'Budget supprimé avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting budget:', error);
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

  const filteredBudgets = budgets.filter(budget => {
    const userMatch = users.find(u => u.id === budget.user_id);
    const assetMatch = budget.asset_id ? assets.find(a => a.id === budget.asset_id) : null;
    
    return (
      budget.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userMatch?.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (userMatch?.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (assetMatch?.libelle.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getAssetLabel = (budget: Budget) => {
    if (!budget.asset_id) return 'Aucun';
    const asset = assets.find(a => a.id === budget.asset_id);
    return asset ? asset.libelle : 'Inconnu';
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 'primary';
      case 'annual': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestion des budgets</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={20} />}
          onClick={handleNewBudgetClick}
        >
          Nouveau budget
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Rechercher des budgets"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading && !openEditModal ? (
        <Typography>Chargement en cours...</Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Libellé</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Actif lié</TableCell>
                  <TableCell>Montant (€)</TableCell>
                  <TableCell>Fréquence</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBudgets.map((budget) => {
                  const user = users.find(u => u.id === budget.user_id);
                  return (
                    <TableRow key={budget.id}>
                      <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Inconnu'}</TableCell>
                      <TableCell>{budget.libelle}</TableCell>
                      <TableCell>
                        {assetTypes.find(t => t.value === budget.asset_type)?.label}
                      </TableCell>
                      <TableCell>{getAssetLabel(budget)}</TableCell>
                      <TableCell>{budget.montant.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>
                        <Chip 
                          label={frequencyTypes.find(f => f.value === budget.frequency)?.label}
                          color={getFrequencyColor(budget.frequency)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(budget)}>
                          <EditIcon size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
          {currentBudget?.id ? 'Modifier le budget' : 'Créer un nouveau budget'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Utilisateur</InputLabel>
                <Select
                  label="Utilisateur"
                  value={currentBudget?.user_id || ''}
                  onChange={(e) => currentBudget && setCurrentBudget({
                    ...currentBudget,
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type d'actif</InputLabel>
                <Select
                  label="Type d'actif"
                  value={currentBudget?.asset_type || 'autres'}
                  onChange={(e) => currentBudget && setCurrentBudget({
                    ...currentBudget,
                    asset_type: e.target.value as any,
                    asset_id: null // Reset asset_id when changing type
                  })}
                >
                  {assetTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Actif lié</InputLabel>
                <Select
                  label="Actif lié"
                  value={currentBudget?.asset_id || ''}
                  onChange={(e) => currentBudget && setCurrentBudget({
                    ...currentBudget,
                    asset_id: e.target.value
                  })}
                  disabled={!currentBudget?.asset_type || currentBudget.asset_type === 'autres'}
                >
                  <MenuItem value="">Aucun</MenuItem>
                  {assets
                    .filter(a => a.type === currentBudget?.asset_type)
                    .map((asset) => (
                      <MenuItem key={asset.id} value={asset.id}>{asset.libelle}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Libellé"
                value={currentBudget?.libelle || ''}
                onChange={(e) => currentBudget && setCurrentBudget({
                  ...currentBudget,
                  libelle: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Montant (€)"
                type="number"
                value={currentBudget?.montant || ''}
                onChange={(e) => currentBudget && setCurrentBudget({
                  ...currentBudget,
                  montant: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Fréquence</InputLabel>
                <Select
                  label="Fréquence"
                  value={currentBudget?.frequency || 'monthly'}
                  onChange={(e) => currentBudget && setCurrentBudget({
                    ...currentBudget,
                    frequency: e.target.value as any
                  })}
                >
                  {frequencyTypes.map((freq) => (
                    <MenuItem key={freq.value} value={freq.value}>{freq.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de création"
                type="date"
                value={currentBudget?.date_creation?.split('T')[0] || ''}
                onChange={(e) => currentBudget && setCurrentBudget({
                  ...currentBudget,
                  date_creation: e.target.value
                })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
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
          {currentBudget?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Supprimer
            </Button>
          )}
          <Button 
            onClick={handleSaveBudget}
            variant="contained"
            startIcon={<SaveIcon size={20} />}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce budget ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteBudget} 
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

export default BudgetListPage;