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

interface Credit {
  id: string;
  user_id: string;
  type: string;
  libelle: string;
  date_acquisition: string;
  montant_initial: number;
  taux: number;
  duree_mois: number;
  mensualite: number;
  assurance: number;
  capital_restant_du: number;
  emprunteur: 'Personne 1' | 'Personne 2' | 'Commun';
  assurance_1: number;
  assurance_2: number;
  created_at: string;
}

const creditTypes = [
  'Immobilier',
  'Consommation',
  'Professionnel',
  'Autre'
];

const emprunteurTypes = [
  'Personne 1',
  'Personne 2',
  'Commun'
];

const CreditListPage: React.FC = () => {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [currentCredit, setCurrentCredit] = useState<Credit | null>(null);
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
        const { data: creditsData, error: creditsError } = await supabase
          .from('credit')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (creditsError) throw creditsError;
        if (usersError) throw usersError;

        setCredits(creditsData || []);
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

  const handleEditClick = (credit: Credit) => {
    setCurrentCredit(credit);
    setOpenEditModal(true);
  };

  const handleNewCreditClick = () => {
    setCurrentCredit({
      id: '',
      user_id: '',
      type: 'Immobilier',
      libelle: '',
      date_acquisition: new Date().toISOString().split('T')[0],
      montant_initial: 0,
      taux: 0,
      duree_mois: 0,
      mensualite: 0,
      assurance: 0,
      capital_restant_du: 0,
      emprunteur: 'Personne 1',
      assurance_1: 0,
      assurance_2: 0,
      created_at: new Date().toISOString()
    });
    setOpenEditModal(true);
  };

  const handleSaveCredit = async () => {
    if (!currentCredit) return;

    setLoading(true);
    try {
      if (!currentCredit.id) {
        const { data, error } = await supabase
          .from('credit')
          .insert([currentCredit])
          .select()
          .single();

        if (error) throw error;
        
        setCredits([data, ...credits]);
        setSnackbar({
          open: true,
          message: 'Crédit créé avec succès',
          severity: 'success'
        });
      } else {
        const { error } = await supabase
          .from('credit')
          .update(currentCredit)
          .eq('id', currentCredit.id);

        if (error) throw error;
        
        setCredits(credits.map(c => c.id === currentCredit.id ? currentCredit : c));
        setSnackbar({
          open: true,
          message: 'Crédit mis à jour',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error saving credit:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCredit = async () => {
    if (!currentCredit) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('credit')
        .delete()
        .eq('id', currentCredit.id);

      if (error) throw error;
      
      setCredits(credits.filter(c => c.id !== currentCredit.id));
      setSnackbar({
        open: true,
        message: 'Crédit supprimé avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting credit:', error);
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

  const filteredCredits = credits.filter(credit => {
    const userMatch = users.find(u => u.id === credit.user_id);
    return (
      credit.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMatch?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMatch?.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestion des Crédits</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={20} />}
          onClick={handleNewCreditClick}
        >
          Nouveau Crédit
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Rechercher des crédits"
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
                  <TableCell>Emprunteur</TableCell>
                  <TableCell>Libellé</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Montant initial (€)</TableCell>
                  <TableCell>Mensualité (€)</TableCell>
                  <TableCell>Capital restant (€)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCredits.map((credit) => {
                  const user = users.find(u => u.id === credit.user_id);
                  return (
                    <TableRow key={credit.id}>
                      <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Inconnu'}</TableCell>
                      <TableCell>{credit.libelle}</TableCell>
                      <TableCell>{credit.type}</TableCell>
                      <TableCell>{credit.montant_initial.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>{credit.mensualite.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>{credit.capital_restant_du.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(credit)}>
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
          {currentCredit?.id ? 'Modifier le crédit' : 'Ajouter un nouveau crédit'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Emprunteur</InputLabel>
                <Select
                  label="Emprunteur"
                  value={currentCredit?.user_id || ''}
                  onChange={(e) => currentCredit && setCurrentCredit({
                    ...currentCredit,
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
                <InputLabel>Type de crédit</InputLabel>
                <Select
                  label="Type de crédit"
                  value={currentCredit?.type || 'Immobilier'}
                  onChange={(e) => currentCredit && setCurrentCredit({
                    ...currentCredit,
                    type: e.target.value
                  })}
                >
                  {creditTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Libellé"
                value={currentCredit?.libelle || ''}
                onChange={(e) => currentCredit && setCurrentCredit({
                  ...currentCredit,
                  libelle: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date d'acquisition"
                type="date"
                value={currentCredit?.date_acquisition?.split('T')[0] || ''}
                onChange={(e) => currentCredit && setCurrentCredit({
                  ...currentCredit,
                  date_acquisition: e.target.value
                })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Montant initial (€)"
                type="number"
                value={currentCredit?.montant_initial || ''}
                onChange={(e) => currentCredit && setCurrentCredit({
                  ...currentCredit,
                  montant_initial: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Taux d'intérêt (%)"
                type="number"
                value={currentCredit?.taux || ''}
                onChange={(e) => currentCredit && setCurrentCredit({
                  ...currentCredit,
                  taux: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Durée (mois)"
                type="number"
                value={currentCredit?.duree_mois || ''}
                onChange={(e) => currentCredit && setCurrentCredit({
                  ...currentCredit,
                  duree_mois: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mensualité (€)"
                type="number"
                value={currentCredit?.mensualite || ''}
                onChange={(e) => currentCredit && setCurrentCredit({
                  ...currentCredit,
                  mensualite: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assurance totale (€)"
                type="number"
                value={currentCredit?.assurance || ''}
                onChange={(e) => currentCredit && setCurrentCredit({
                  ...currentCredit,
                  assurance: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capital restant dû (€)"
                type="number"
                value={currentCredit?.capital_restant_du || ''}
                onChange={(e) => currentCredit && setCurrentCredit({
                  ...currentCredit,
                  capital_restant_du: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Emprunteur légal</InputLabel>
                <Select
                  label="Emprunteur légal"
                  value={currentCredit?.emprunteur || 'Personne 1'}
                  onChange={(e) => currentCredit && setCurrentCredit({
                    ...currentCredit,
                    emprunteur: e.target.value as 'Personne 1' | 'Personne 2' | 'Commun'
                  })}
                >
                  {emprunteurTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assurance personne 1 (€)"
                type="number"
                value={currentCredit?.assurance_1 || ''}
                onChange={(e) => currentCredit && setCurrentCredit({
                  ...currentCredit,
                  assurance_1: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assurance personne 2 (€)"
                type="number"
                value={currentCredit?.assurance_2 || ''}
                onChange={(e) => currentCredit && setCurrentCredit({
                  ...currentCredit,
                  assurance_2: Number(e.target.value)
                })}
                margin="normal"
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
          {currentCredit?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Supprimer
            </Button>
          )}
          <Button 
            onClick={handleSaveCredit}
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
          Êtes-vous sûr de vouloir supprimer ce crédit ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteCredit} 
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

export default CreditListPage;