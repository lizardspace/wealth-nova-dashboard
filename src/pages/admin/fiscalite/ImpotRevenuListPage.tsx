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
  Select
} from '@mui/material';
import {
  Edit2 as EditIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
  Plus as AddIcon
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ImpotRevenu {
  id: string;
  user_id: string;
  deduction_revenu: number;
  reduction_impot: number;
  majoration_revenu_fiscal: number;
  revenu_fiscal_reference: number;
  deduction_reintegrer: number;
  reduction_a_reintegrer: number;
  pv_immu_brut: number;
  pv_immo_base_pfu: number;
  pv_immo_base_ir: number;
  option_fiscale: 'PFU' | 'Barème IR';
  annee: number;
  created_at: string;
}

const ImpotRevenuListPage: React.FC = () => {
  const [impots, setImpots] = useState<ImpotRevenu[]>([]);
  const [currentImpot, setCurrentImpot] = useState<ImpotRevenu | null>(null);
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
        const { data: impotsData, error: impotsError } = await supabase
          .from('impotrevenu')
          .select('*')
          .order('annee', { ascending: false });

        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (impotsError) throw impotsError;
        if (usersError) throw usersError;

        setImpots(impotsData || []);
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

  const handleEditClick = (impot: ImpotRevenu) => {
    setCurrentImpot(impot);
    setOpenEditModal(true);
  };

  const handleNewImpotClick = () => {
    setCurrentImpot({
      id: '',
      user_id: '',
      deduction_revenu: 0,
      reduction_impot: 0,
      majoration_revenu_fiscal: 0,
      revenu_fiscal_reference: 0,
      deduction_reintegrer: 0,
      reduction_a_reintegrer: 0,
      pv_immu_brut: 0,
      pv_immo_base_pfu: 0,
      pv_immo_base_ir: 0,
      option_fiscale: 'PFU',
      annee: new Date().getFullYear(),
      created_at: new Date().toISOString()
    });
    setOpenEditModal(true);
  };

  const handleSaveImpot = async () => {
    if (!currentImpot) return;

    setLoading(true);
    try {
      if (!currentImpot.id) {
        const { data, error } = await supabase
          .from('impotrevenu')
          .insert([currentImpot])
          .select()
          .single();

        if (error) throw error;
        
        setImpots([data, ...impots]);
        setSnackbar({
          open: true,
          message: 'Déclaration fiscale créée avec succès',
          severity: 'success'
        });
      } else {
        const { error } = await supabase
          .from('impotrevenu')
          .update(currentImpot)
          .eq('id', currentImpot.id);

        if (error) throw error;
        
        setImpots(impots.map(i => i.id === currentImpot.id ? currentImpot : i));
        setSnackbar({
          open: true,
          message: 'Déclaration fiscale mise à jour',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error saving impot:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImpot = async () => {
    if (!currentImpot) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('impotrevenu')
        .delete()
        .eq('id', currentImpot.id);

      if (error) throw error;
      
      setImpots(impots.filter(i => i.id !== currentImpot.id));
      setSnackbar({
        open: true,
        message: 'Déclaration fiscale supprimée avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting impot:', error);
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

  const filteredImpots = impots.filter(impot => {
    const userMatch = users.find(u => u.id === impot.user_id);
    return (
      impot.annee.toString().includes(searchTerm) ||
      userMatch?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMatch?.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Déclarations fiscales</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={20} />}
          onClick={handleNewImpotClick}
        >
          Nouvelle déclaration
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Rechercher par année ou nom"
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
                  <TableCell>Contribuable</TableCell>
                  <TableCell>Année</TableCell>
                  <TableCell>Revenu fiscal</TableCell>
                  <TableCell>Option fiscale</TableCell>
                  <TableCell>Déductions</TableCell>
                  <TableCell>Réductions</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredImpots.map((impot) => {
                  const user = users.find(u => u.id === impot.user_id);
                  return (
                    <TableRow key={impot.id}>
                      <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Inconnu'}</TableCell>
                      <TableCell>{impot.annee}</TableCell>
                      <TableCell>{impot.revenu_fiscal_reference.toLocaleString('fr-FR')} €</TableCell>
                      <TableCell>{impot.option_fiscale}</TableCell>
                      <TableCell>{impot.deduction_revenu.toLocaleString('fr-FR')} €</TableCell>
                      <TableCell>{impot.reduction_impot.toLocaleString('fr-FR')} €</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(impot)}>
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
          {currentImpot?.id ? 'Modifier la déclaration' : 'Ajouter une nouvelle déclaration'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Contribuable</InputLabel>
                <Select
                  label="Contribuable"
                  value={currentImpot?.user_id || ''}
                  onChange={(e) => currentImpot && setCurrentImpot({
                    ...currentImpot,
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
              <TextField
                fullWidth
                label="Année fiscale"
                type="number"
                value={currentImpot?.annee || ''}
                onChange={(e) => currentImpot && setCurrentImpot({
                  ...currentImpot,
                  annee: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Déductions sur revenu (€)"
                type="number"
                value={currentImpot?.deduction_revenu || ''}
                onChange={(e) => currentImpot && setCurrentImpot({
                  ...currentImpot,
                  deduction_revenu: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Réductions d'impôt (€)"
                type="number"
                value={currentImpot?.reduction_impot || ''}
                onChange={(e) => currentImpot && setCurrentImpot({
                  ...currentImpot,
                  reduction_impot: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Majoration revenu fiscal (€)"
                type="number"
                value={currentImpot?.majoration_revenu_fiscal || ''}
                onChange={(e) => currentImpot && setCurrentImpot({
                  ...currentImpot,
                  majoration_revenu_fiscal: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Revenu fiscal de référence (€)"
                type="number"
                value={currentImpot?.revenu_fiscal_reference || ''}
                onChange={(e) => currentImpot && setCurrentImpot({
                  ...currentImpot,
                  revenu_fiscal_reference: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Déductions à réintégrer (€)"
                type="number"
                value={currentImpot?.deduction_reintegrer || ''}
                onChange={(e) => currentImpot && setCurrentImpot({
                  ...currentImpot,
                  deduction_reintegrer: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Réductions à réintégrer (€)"
                type="number"
                value={currentImpot?.reduction_a_reintegrer || ''}
                onChange={(e) => currentImpot && setCurrentImpot({
                  ...currentImpot,
                  reduction_a_reintegrer: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Plus-values immo brutes (€)"
                type="number"
                value={currentImpot?.pv_immu_brut || ''}
                onChange={(e) => currentImpot && setCurrentImpot({
                  ...currentImpot,
                  pv_immu_brut: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PV immo base PFU (€)"
                type="number"
                value={currentImpot?.pv_immo_base_pfu || ''}
                onChange={(e) => currentImpot && setCurrentImpot({
                  ...currentImpot,
                  pv_immo_base_pfu: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PV immo base IR (€)"
                type="number"
                value={currentImpot?.pv_immo_base_ir || ''}
                onChange={(e) => currentImpot && setCurrentImpot({
                  ...currentImpot,
                  pv_immo_base_ir: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Option fiscale</InputLabel>
                <Select
                  label="Option fiscale"
                  value={currentImpot?.option_fiscale || 'PFU'}
                  onChange={(e) => currentImpot && setCurrentImpot({
                    ...currentImpot,
                    option_fiscale: e.target.value as 'PFU' | 'Barème IR'
                  })}
                >
                  <MenuItem value="PFU">PFU (Flat Tax)</MenuItem>
                  <MenuItem value="Barème IR">Barème progressif</MenuItem>
                </Select>
              </FormControl>
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
          {currentImpot?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Supprimer
            </Button>
          )}
          <Button 
            onClick={handleSaveImpot}
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
          Êtes-vous sûr de vouloir supprimer cette déclaration fiscale ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteImpot} 
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

export default ImpotRevenuListPage;