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

interface BienImmobilier {
  id: string;
  user_id: string;
  type_immobilier: 'Bien de jouissance' | 'Bien de rapport';
  famille_immobilier: 'Résidence principale' | 'Résidence secondaire' | 'Autre';
  libelle: string;
  date_acquisition: string;
  date_echeance: string;
  value: number;
  proprietaire: 'Personne 1' | 'Personne 2' | 'Commun';
  type_propriete: 'PP' | 'US' | 'NP -1' | 'NP -2';
  loyer_brut: number;
  loyer_imposable: number;
  taxes: number;
  created_at: string;
}

const BienImmobilierListPage: React.FC = () => {
  const [biens, setBiens] = useState<BienImmobilier[]>([]);
  const [currentBien, setCurrentBien] = useState<BienImmobilier | null>(null);
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
        const { data: biensData, error: biensError } = await supabase
          .from('bienimmobilier')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (biensError) throw biensError;
        if (usersError) throw usersError;

        setBiens(biensData || []);
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

  const handleEditClick = (bien: BienImmobilier) => {
    setCurrentBien(bien);
    setOpenEditModal(true);
  };

  const handleNewBienClick = () => {
    setCurrentBien({
      id: '',
      user_id: '',
      type_immobilier: 'Bien de jouissance',
      famille_immobilier: 'Résidence principale',
      libelle: '',
      date_acquisition: new Date().toISOString().split('T')[0],
      date_echeance: '',
      value: 0,
      proprietaire: 'Personne 1',
      type_propriete: 'PP',
      loyer_brut: 0,
      loyer_imposable: 0,
      taxes: 0,
      created_at: new Date().toISOString()
    });
    setOpenEditModal(true);
  };

  const handleSaveBien = async () => {
    if (!currentBien) return;

    setLoading(true);
    try {
      if (!currentBien.id) {
        const { data, error } = await supabase
          .from('bienimmobilier')
          .insert([currentBien])
          .select()
          .single();

        if (error) throw error;
        
        setBiens([data, ...biens]);
        setSnackbar({
          open: true,
          message: 'Bien immobilier créé avec succès',
          severity: 'success'
        });
      } else {
        const { error } = await supabase
          .from('bienimmobilier')
          .update(currentBien)
          .eq('id', currentBien.id);

        if (error) throw error;
        
        setBiens(biens.map(b => b.id === currentBien.id ? currentBien : b));
        setSnackbar({
          open: true,
          message: 'Bien immobilier mis à jour',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error saving bien:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBien = async () => {
    if (!currentBien) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('bienimmobilier')
        .delete()
        .eq('id', currentBien.id);

      if (error) throw error;
      
      setBiens(biens.filter(b => b.id !== currentBien.id));
      setSnackbar({
        open: true,
        message: 'Bien supprimé avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting bien:', error);
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

  const filteredBiens = biens.filter(bien => {
  const userMatch = users.find(u => u.id === bien.user_id);
  return (
    bien.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bien.famille_immobilier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userMatch?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userMatch?.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestion des biens immobiliers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={20} />}
          onClick={handleNewBienClick}
        >
          Ajouter un bien
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Rechercher un bien"
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
                  <TableCell>Propriétaire</TableCell>
                  <TableCell>Libellé</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Valeur (€)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBiens.map((bien) => {
                  const user = users.find(u => u.id === bien.user_id);
                  return (
                    <TableRow key={bien.id}>
                      <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Inconnu'}</TableCell>
                      <TableCell>{bien.libelle}</TableCell>
                      <TableCell>{bien.type_immobilier}</TableCell>
                      <TableCell>{bien.famille_immobilier}</TableCell>
                      <TableCell>{bien.value.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(bien)}>
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
          {currentBien?.id ? 'Modifier le bien' : 'Ajouter un nouveau bien'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Propriétaire</InputLabel>
                <Select
                  label="Propriétaire"
                  value={currentBien?.user_id || ''}
                  onChange={(e) => currentBien && setCurrentBien({
                    ...currentBien,
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
                <InputLabel>Type de bien</InputLabel>
                <Select
                  label="Type de bien"
                  value={currentBien?.type_immobilier || 'Bien de jouissance'}
                  onChange={(e) => currentBien && setCurrentBien({
                    ...currentBien,
                    type_immobilier: e.target.value as 'Bien de jouissance' | 'Bien de rapport'
                  })}
                >
                  <MenuItem value="Bien de jouissance">Bien de jouissance</MenuItem>
                  <MenuItem value="Bien de rapport">Bien de rapport</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Catégorie</InputLabel>
                <Select
                  label="Catégorie"
                  value={currentBien?.famille_immobilier || 'Résidence principale'}
                  onChange={(e) => currentBien && setCurrentBien({
                    ...currentBien,
                    famille_immobilier: e.target.value as 'Résidence principale' | 'Résidence secondaire' | 'Autre'
                  })}
                >
                  <MenuItem value="Résidence principale">Résidence principale</MenuItem>
                  <MenuItem value="Résidence secondaire">Résidence secondaire</MenuItem>
                  <MenuItem value="Autre">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Libellé"
                value={currentBien?.libelle || ''}
                onChange={(e) => currentBien && setCurrentBien({
                  ...currentBien,
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
                value={currentBien?.date_acquisition?.split('T')[0] || ''}
                onChange={(e) => currentBien && setCurrentBien({
                  ...currentBien,
                  date_acquisition: e.target.value
                })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date d'échéance"
                type="date"
                value={currentBien?.date_echeance?.split('T')[0] || ''}
                onChange={(e) => currentBien && setCurrentBien({
                  ...currentBien,
                  date_echeance: e.target.value
                })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valeur (€)"
                type="number"
                value={currentBien?.value || ''}
                onChange={(e) => currentBien && setCurrentBien({
                  ...currentBien,
                  value: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Propriétaire légal</InputLabel>
                <Select
                  label="Propriétaire légal"
                  value={currentBien?.proprietaire || 'Personne 1'}
                  onChange={(e) => currentBien && setCurrentBien({
                    ...currentBien,
                    proprietaire: e.target.value as 'Personne 1' | 'Personne 2' | 'Commun'
                  })}
                >
                  <MenuItem value="Personne 1">Personne 1</MenuItem>
                  <MenuItem value="Personne 2">Personne 2</MenuItem>
                  <MenuItem value="Commun">Commun</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type de propriété</InputLabel>
                <Select
                  label="Type de propriété"
                  value={currentBien?.type_propriete || 'PP'}
                  onChange={(e) => currentBien && setCurrentBien({
                    ...currentBien,
                    type_propriete: e.target.value as 'PP' | 'US' | 'NP -1' | 'NP -2'
                  })}
                >
                  <MenuItem value="PP">PP</MenuItem>
                  <MenuItem value="US">US</MenuItem>
                  <MenuItem value="NP -1">NP -1</MenuItem>
                  <MenuItem value="NP -2">NP -2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Loyer brut (€)"
                type="number"
                value={currentBien?.loyer_brut || ''}
                onChange={(e) => currentBien && setCurrentBien({
                  ...currentBien,
                  loyer_brut: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Loyer imposable (€)"
                type="number"
                value={currentBien?.loyer_imposable || ''}
                onChange={(e) => currentBien && setCurrentBien({
                  ...currentBien,
                  loyer_imposable: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Taxes (€)"
                type="number"
                value={currentBien?.taxes || ''}
                onChange={(e) => currentBien && setCurrentBien({
                  ...currentBien,
                  taxes: Number(e.target.value)
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
          {currentBien?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Supprimer
            </Button>
          )}
          <Button 
            onClick={handleSaveBien}
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
          Êtes-vous sûr de vouloir supprimer ce bien immobilier ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteBien} 
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

export default BienImmobilierListPage;