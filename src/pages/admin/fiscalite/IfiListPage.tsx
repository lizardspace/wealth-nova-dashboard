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
  MenuItem
} from '@mui/material';
import {
  Edit2 as EditIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
  Plus as AddIcon
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Ifi {
  id: string;
  user_id: string;
  deduction: number;
  deduction_residence_principale: number;
  us: number;
  reduction: number;
  ifi: number;
  annee: number;
  created_at: string;
}

const IfiListPage: React.FC = () => {
  const [ifis, setIfis] = useState<Ifi[]>([]);
  const [currentIfi, setCurrentIfi] = useState<Ifi | null>(null);
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
        const { data: ifisData, error: ifisError } = await supabase
          .from('ifi')
          .select('*')
          .order('annee', { ascending: false });

        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (ifisError) throw ifisError;
        if (usersError) throw usersError;

        setIfis(ifisData || []);
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

  const handleEditClick = (ifi: Ifi) => {
    setCurrentIfi(ifi);
    setOpenEditModal(true);
  };

  const handleNewIfiClick = () => {
    setCurrentIfi({
      id: '',
      user_id: '',
      deduction: 0,
      deduction_residence_principale: 0,
      us: 0,
      reduction: 0,
      ifi: 0,
      annee: new Date().getFullYear(),
      created_at: new Date().toISOString()
    });
    setOpenEditModal(true);
  };

  const handleSaveIfi = async () => {
    if (!currentIfi) return;

    setLoading(true);
    try {
      if (!currentIfi.id) {
        const { data, error } = await supabase
          .from('ifi')
          .insert([currentIfi])
          .select()
          .single();

        if (error) throw error;
        
        setIfis([data, ...ifis]);
        setSnackbar({
          open: true,
          message: 'Déclaration IFI créée avec succès',
          severity: 'success'
        });
      } else {
        const { error } = await supabase
          .from('ifi')
          .update(currentIfi)
          .eq('id', currentIfi.id);

        if (error) throw error;
        
        setIfis(ifis.map(i => i.id === currentIfi.id ? currentIfi : i));
        setSnackbar({
          open: true,
          message: 'Déclaration IFI mise à jour',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error saving IFI:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIfi = async () => {
    if (!currentIfi) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('ifi')
        .delete()
        .eq('id', currentIfi.id);

      if (error) throw error;
      
      setIfis(ifis.filter(i => i.id !== currentIfi.id));
      setSnackbar({
        open: true,
        message: 'Déclaration IFI supprimée avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting IFI:', error);
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

  const filteredIfis = ifis.filter(ifi => {
    const userMatch = users.find(u => u.id === ifi.user_id);
    return (
      ifi.annee.toString().includes(searchTerm) ||
      (userMatch?.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (userMatch?.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const calculateIfi = (ifi: Ifi) => {
    // Logique de calcul simplifiée (à adapter selon les règles fiscales exactes)
    const base = ifi.us - ifi.deduction - ifi.deduction_residence_principale;
    const montant = Math.max(0, base - ifi.reduction);
    return montant;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Impôt sur la Fortune Immobilière (IFI)</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={20} />}
          onClick={handleNewIfiClick}
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
                  <TableCell>Base US (€)</TableCell>
                  <TableCell>Déductions (€)</TableCell>
                  <TableCell>Réductions (€)</TableCell>
                  <TableCell>IFI calculé (€)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIfis.map((ifi) => {
                  const user = users.find(u => u.id === ifi.user_id);
                  const ifiCalcule = calculateIfi(ifi);
                  
                  return (
                    <TableRow key={ifi.id}>
                      <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Inconnu'}</TableCell>
                      <TableCell>{ifi.annee}</TableCell>
                      <TableCell>{ifi.us.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>{(ifi.deduction + ifi.deduction_residence_principale).toLocaleString('fr-FR')}</TableCell>
                      <TableCell>{ifi.reduction.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>{ifiCalcule.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(ifi)}>
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
          {currentIfi?.id ? 'Modifier la déclaration IFI' : 'Ajouter une nouvelle déclaration IFI'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Contribuable</InputLabel>
                <Select
                  label="Contribuable"
                  value={currentIfi?.user_id || ''}
                  onChange={(e) => currentIfi && setCurrentIfi({
                    ...currentIfi,
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
                value={currentIfi?.annee || ''}
                onChange={(e) => currentIfi && setCurrentIfi({
                  ...currentIfi,
                  annee: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Base US (€)"
                type="number"
                value={currentIfi?.us || ''}
                onChange={(e) => currentIfi && setCurrentIfi({
                  ...currentIfi,
                  us: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Déductions générales (€)"
                type="number"
                value={currentIfi?.deduction || ''}
                onChange={(e) => currentIfi && setCurrentIfi({
                  ...currentIfi,
                  deduction: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Déduction résidence principale (€)"
                type="number"
                value={currentIfi?.deduction_residence_principale || ''}
                onChange={(e) => currentIfi && setCurrentIfi({
                  ...currentIfi,
                  deduction_residence_principale: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Réductions (€)"
                type="number"
                value={currentIfi?.reduction || ''}
                onChange={(e) => currentIfi && setCurrentIfi({
                  ...currentIfi,
                  reduction: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mt: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                IFI calculé: {currentIfi ? `${calculateIfi(currentIfi).toLocaleString('fr-FR')} €` : '0 €'}
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
          {currentIfi?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Supprimer
            </Button>
          )}
          <Button 
            onClick={handleSaveIfi}
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
          Êtes-vous sûr de vouloir supprimer cette déclaration IFI ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteIfi} 
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

export default IfiListPage;