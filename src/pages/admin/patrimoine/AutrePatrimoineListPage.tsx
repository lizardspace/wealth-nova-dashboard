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

interface AutrePatrimoine {
  id: string;
  user_id: string;
  libelle: string;
  famille_autre: string;
  date_acquisition: string;
  value: number;
  proprietaire: 'Personne 1' | 'Personne 2' | 'Commun';
  type_propriete: 'PP' | 'US' | 'NP -1' | 'NP -2';
  created_at: string;
}

const famillePatrimoineTypes = [
  'Métaux précieux',
  'Objets de collection',
  'Œuvres d\'art',
  'Véhicules',
  'Autres biens matériels',
  'Cryptomonnaies',
  'Droits d\'auteur',
  'Autres'
];

const proprietaireTypes = [
  'Personne 1',
  'Personne 2',
  'Commun'
];

const typeProprieteTypes = [
  'PP',
  'US',
  'NP -1',
  'NP -2'
];

const AutrePatrimoineListPage: React.FC = () => {
  const [patrimoines, setPatrimoines] = useState<AutrePatrimoine[]>([]);
  const [currentPatrimoine, setCurrentPatrimoine] = useState<AutrePatrimoine | null>(null);
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
        const { data: patrimoinesData, error: patrimoinesError } = await supabase
          .from('autrepatrimoine')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (patrimoinesError) throw patrimoinesError;
        if (usersError) throw usersError;

        setPatrimoines(patrimoinesData || []);
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

  const handleEditClick = (patrimoine: AutrePatrimoine) => {
    setCurrentPatrimoine(patrimoine);
    setOpenEditModal(true);
  };

  const handleNewPatrimoineClick = () => {
    setCurrentPatrimoine({
      id: '',
      user_id: '',
      libelle: '',
      famille_autre: 'Autres',
      date_acquisition: new Date().toISOString().split('T')[0],
      value: 0,
      proprietaire: 'Personne 1',
      type_propriete: 'PP',
      created_at: new Date().toISOString()
    });
    setOpenEditModal(true);
  };

  const handleSavePatrimoine = async () => {
    if (!currentPatrimoine) return;

    setLoading(true);
    try {
      if (!currentPatrimoine.id) {
        const { data, error } = await supabase
          .from('autrepatrimoine')
          .insert([currentPatrimoine])
          .select()
          .single();

        if (error) throw error;
        
        setPatrimoines([data, ...patrimoines]);
        setSnackbar({
          open: true,
          message: 'Patrimoine créé avec succès',
          severity: 'success'
        });
      } else {
        const { error } = await supabase
          .from('autrepatrimoine')
          .update(currentPatrimoine)
          .eq('id', currentPatrimoine.id);

        if (error) throw error;
        
        setPatrimoines(patrimoines.map(p => p.id === currentPatrimoine.id ? currentPatrimoine : p));
        setSnackbar({
          open: true,
          message: 'Patrimoine mis à jour',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error saving patrimoine:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatrimoine = async () => {
    if (!currentPatrimoine) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('autrepatrimoine')
        .delete()
        .eq('id', currentPatrimoine.id);

      if (error) throw error;
      
      setPatrimoines(patrimoines.filter(p => p.id !== currentPatrimoine.id));
      setSnackbar({
        open: true,
        message: 'Patrimoine supprimé avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting patrimoine:', error);
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

  const filteredPatrimoines = patrimoines.filter(patrimoine => {
    const userMatch = users.find(u => u.id === patrimoine.user_id);
    return (
      patrimoine.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patrimoine.famille_autre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMatch?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMatch?.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Autres Patrimoines</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={20} />}
          onClick={handleNewPatrimoineClick}
        >
          Nouveau Patrimoine
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Rechercher des patrimoines"
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
                  <TableCell>Famille</TableCell>
                  <TableCell>Valeur (€)</TableCell>
                  <TableCell>Date d'acquisition</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatrimoines.map((patrimoine) => {
                  const user = users.find(u => u.id === patrimoine.user_id);
                  return (
                    <TableRow key={patrimoine.id}>
                      <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Inconnu'}</TableCell>
                      <TableCell>{patrimoine.libelle}</TableCell>
                      <TableCell>{patrimoine.famille_autre}</TableCell>
                      <TableCell>{patrimoine.value.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>{new Date(patrimoine.date_acquisition).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(patrimoine)}>
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
          {currentPatrimoine?.id ? 'Modifier le patrimoine' : 'Ajouter un nouveau patrimoine'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Propriétaire</InputLabel>
                <Select
                  label="Propriétaire"
                  value={currentPatrimoine?.user_id || ''}
                  onChange={(e) => currentPatrimoine && setCurrentPatrimoine({
                    ...currentPatrimoine,
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
                label="Libellé"
                value={currentPatrimoine?.libelle || ''}
                onChange={(e) => currentPatrimoine && setCurrentPatrimoine({
                  ...currentPatrimoine,
                  libelle: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Famille de patrimoine</InputLabel>
                <Select
                  label="Famille de patrimoine"
                  value={currentPatrimoine?.famille_autre || 'Autres'}
                  onChange={(e) => currentPatrimoine && setCurrentPatrimoine({
                    ...currentPatrimoine,
                    famille_autre: e.target.value
                  })}
                >
                  {famillePatrimoineTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date d'acquisition"
                type="date"
                value={currentPatrimoine?.date_acquisition?.split('T')[0] || ''}
                onChange={(e) => currentPatrimoine && setCurrentPatrimoine({
                  ...currentPatrimoine,
                  date_acquisition: e.target.value
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
                value={currentPatrimoine?.value || ''}
                onChange={(e) => currentPatrimoine && setCurrentPatrimoine({
                  ...currentPatrimoine,
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
                  value={currentPatrimoine?.proprietaire || 'Personne 1'}
                  onChange={(e) => currentPatrimoine && setCurrentPatrimoine({
                    ...currentPatrimoine,
                    proprietaire: e.target.value as 'Personne 1' | 'Personne 2' | 'Commun'
                  })}
                >
                  {proprietaireTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type de propriété</InputLabel>
                <Select
                  label="Type de propriété"
                  value={currentPatrimoine?.type_propriete || 'PP'}
                  onChange={(e) => currentPatrimoine && setCurrentPatrimoine({
                    ...currentPatrimoine,
                    type_propriete: e.target.value as 'PP' | 'US' | 'NP -1' | 'NP -2'
                  })}
                >
                  {typeProprieteTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
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
          {currentPatrimoine?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Supprimer
            </Button>
          )}
          <Button 
            onClick={handleSavePatrimoine}
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
          Êtes-vous sûr de vouloir supprimer ce patrimoine ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeletePatrimoine} 
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

export default AutrePatrimoineListPage;