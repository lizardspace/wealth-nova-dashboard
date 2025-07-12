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

interface Entreprise {
  id: string;
  user_id: string;
  type_entreprise: 'Outils de travail' | 'Entreprise Participation';
  famille_entreprise: string;
  libelle: string;
  date_acquisition: string;
  date_echeance: string;
  value: number;
  proprietaire: 'Personne 1' | 'Personne 2' | 'Commun';
  type_propriete: 'PP' | 'US' | 'NP -1' | 'NP -2';
  dividendes: number;
  optimisation: string;
  created_at: string;
}

const entrepriseTypes = [
  'Outils de travail',
  'Entreprise Participation'
];

const familleEntrepriseTypes = [
  'autre',
  'Clientèle BNC',
  'Entreprise BA',
  'Fonds de com.BIC',
  'SCI à l\'IS',
  'Sociétés à l\'IR',
  'Société à l\'IS',
  'Société à l\'IS en PEA'
];

const optimisationTypes = [
  'PFU 12,8%',
  'PFL, 22,5% pea',
  'PFL 19% pea',
  'Exonération'
];

const EntrepriseListPage: React.FC = () => {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [currentEntreprise, setCurrentEntreprise] = useState<Entreprise | null>(null);
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
        const { data: entreprisesData, error: entreprisesError } = await supabase
          .from('entrepriseparticipation')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (entreprisesError) throw entreprisesError;
        if (usersError) throw usersError;

        setEntreprises(entreprisesData || []);
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

  const handleEditClick = (entreprise: Entreprise) => {
    setCurrentEntreprise(entreprise);
    setOpenEditModal(true);
  };

  const handleNewEntrepriseClick = () => {
    setCurrentEntreprise({
      id: '',
      user_id: '',
      type_entreprise: 'Entreprise Participation',
      famille_entreprise: 'autre',
      libelle: '',
      date_acquisition: new Date().toISOString().split('T')[0],
      date_echeance: '',
      value: 0,
      proprietaire: 'Personne 1',
      type_propriete: 'PP',
      dividendes: 0,
      optimisation: 'PFU 12,8%',
      created_at: new Date().toISOString()
    });
    setOpenEditModal(true);
  };

  const handleSaveEntreprise = async () => {
    if (!currentEntreprise) return;

    setLoading(true);
    try {
      if (!currentEntreprise.id) {
        const { data, error } = await supabase
          .from('entrepriseparticipation')
          .insert([currentEntreprise])
          .select()
          .single();

        if (error) throw error;
        
        setEntreprises([data, ...entreprises]);
        setSnackbar({
          open: true,
          message: 'Entreprise créée avec succès',
          severity: 'success'
        });
      } else {
        const { error } = await supabase
          .from('entrepriseparticipation')
          .update(currentEntreprise)
          .eq('id', currentEntreprise.id);

        if (error) throw error;
        
        setEntreprises(entreprises.map(e => e.id === currentEntreprise.id ? currentEntreprise : e));
        setSnackbar({
          open: true,
          message: 'Entreprise mise à jour',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error saving entreprise:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntreprise = async () => {
    if (!currentEntreprise) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('entrepriseparticipation')
        .delete()
        .eq('id', currentEntreprise.id);

      if (error) throw error;
      
      setEntreprises(entreprises.filter(e => e.id !== currentEntreprise.id));
      setSnackbar({
        open: true,
        message: 'Entreprise supprimée avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting entreprise:', error);
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

  const filteredEntreprises = entreprises.filter(entreprise => {
    const userMatch = users.find(u => u.id === entreprise.user_id);
    return (
      entreprise.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entreprise.type_entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMatch?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMatch?.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Participations Entreprises</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={20} />}
          onClick={handleNewEntrepriseClick}
        >
          Nouvelle Participation
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Rechercher des entreprises"
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
                  <TableCell>Famille</TableCell>
                  <TableCell>Valeur (€)</TableCell>
                  <TableCell>Dividendes (€)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEntreprises.map((entreprise) => {
                  const user = users.find(u => u.id === entreprise.user_id);
                  return (
                    <TableRow key={entreprise.id}>
                      <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Inconnu'}</TableCell>
                      <TableCell>{entreprise.libelle}</TableCell>
                      <TableCell>{entreprise.type_entreprise}</TableCell>
                      <TableCell>{entreprise.famille_entreprise}</TableCell>
                      <TableCell>{entreprise.value.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>{entreprise.dividendes.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(entreprise)}>
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
          {currentEntreprise?.id ? 'Modifier la participation' : 'Ajouter une participation'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Propriétaire</InputLabel>
                <Select
                  label="Propriétaire"
                  value={currentEntreprise?.user_id || ''}
                  onChange={(e) => currentEntreprise && setCurrentEntreprise({
                    ...currentEntreprise,
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
                <InputLabel>Type d'entreprise</InputLabel>
                <Select
                  label="Type d'entreprise"
                  value={currentEntreprise?.type_entreprise || 'Entreprise Participation'}
                  onChange={(e) => currentEntreprise && setCurrentEntreprise({
                    ...currentEntreprise,
                    type_entreprise: e.target.value as 'Outils de travail' | 'Entreprise Participation'
                  })}
                >
                  {entrepriseTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Famille d'entreprise</InputLabel>
                <Select
                  label="Famille d'entreprise"
                  value={currentEntreprise?.famille_entreprise || 'autre'}
                  onChange={(e) => currentEntreprise && setCurrentEntreprise({
                    ...currentEntreprise,
                    famille_entreprise: e.target.value
                  })}
                >
                  {familleEntrepriseTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Libellé"
                value={currentEntreprise?.libelle || ''}
                onChange={(e) => currentEntreprise && setCurrentEntreprise({
                  ...currentEntreprise,
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
                value={currentEntreprise?.date_acquisition?.split('T')[0] || ''}
                onChange={(e) => currentEntreprise && setCurrentEntreprise({
                  ...currentEntreprise,
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
                value={currentEntreprise?.date_echeance?.split('T')[0] || ''}
                onChange={(e) => currentEntreprise && setCurrentEntreprise({
                  ...currentEntreprise,
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
                value={currentEntreprise?.value || ''}
                onChange={(e) => currentEntreprise && setCurrentEntreprise({
                  ...currentEntreprise,
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
                  value={currentEntreprise?.proprietaire || 'Personne 1'}
                  onChange={(e) => currentEntreprise && setCurrentEntreprise({
                    ...currentEntreprise,
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
                  value={currentEntreprise?.type_propriete || 'PP'}
                  onChange={(e) => currentEntreprise && setCurrentEntreprise({
                    ...currentEntreprise,
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
                label="Dividendes (€)"
                type="number"
                value={currentEntreprise?.dividendes || ''}
                onChange={(e) => currentEntreprise && setCurrentEntreprise({
                  ...currentEntreprise,
                  dividendes: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Optimisation fiscale</InputLabel>
                <Select
                  label="Optimisation fiscale"
                  value={currentEntreprise?.optimisation || 'PFU 12,8%'}
                  onChange={(e) => currentEntreprise && setCurrentEntreprise({
                    ...currentEntreprise,
                    optimisation: e.target.value
                  })}
                >
                  {optimisationTypes.map((type) => (
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
          {currentEntreprise?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Supprimer
            </Button>
          )}
          <Button 
            onClick={handleSaveEntreprise}
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
          Êtes-vous sûr de vouloir supprimer cette participation d'entreprise ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteEntreprise} 
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

export default EntrepriseListPage;