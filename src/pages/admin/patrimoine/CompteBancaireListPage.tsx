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
  Checkbox
} from '@mui/material';
import {
  Edit2 as EditIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
  Plus as AddIcon
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface CompteBancaire {
  id: string;
  user_id: string;
  type_compte: string;
  famille_liquidites: string;
  etablissement: string;
  libelle: string;
  contrat_gere: boolean;
  date_acquisition: string;
  date_cloture: string;
  value: number;
  epargne_annuelle: number;
  proprietaire: 'Personne 1' | 'Personne 2' | 'Commun';
  type_propriete: 'PP' | 'US' | 'NP -1' | 'NP -2';
  taux: number;
  optimisation: string;
  created_at: string;
}

const compteTypes = [
  'Autre', 'CEL', 'Compte à terme', 'Compte courant', 
  'LDDS', 'LEP', 'Livret A', 'PEL', 'PEP', 'Somme à investir'
];

const liquiditeTypes = [
  'Action', 'Autre', 'Compte titre', 'FCP', 'FCPI', 
  'FIP', 'Obligations', 'OPCI', 'Parts sociales', 
  'PEA', 'PEA-PME', 'PEE', 'PEP', 'SICAV', 'SOFICA'
];

const optimisationTypes = [
  'PFU 12,8%', 'PFL, 22,5% pea', 'PFL 19% pea', 'Exonération'
];

const CompteBancaireListPage: React.FC = () => {
  const [comptes, setComptes] = useState<CompteBancaire[]>([]);
  const [currentCompte, setCurrentCompte] = useState<CompteBancaire | null>(null);
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
        const { data: comptesData, error: comptesError } = await supabase
          .from('comptebancaire')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (comptesError) throw comptesError;
        if (usersError) throw usersError;

        setComptes(comptesData || []);
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

  const handleEditClick = (compte: CompteBancaire) => {
    setCurrentCompte(compte);
    setOpenEditModal(true);
  };

  const handleNewCompteClick = () => {
    setCurrentCompte({
      id: '',
      user_id: '',
      type_compte: 'Compte courant',
      famille_liquidites: 'Autre',
      etablissement: '',
      libelle: '',
      contrat_gere: false,
      date_acquisition: new Date().toISOString().split('T')[0],
      date_cloture: '',
      value: 0,
      epargne_annuelle: 0,
      proprietaire: 'Personne 1',
      type_propriete: 'PP',
      taux: 0,
      optimisation: 'PFU 12,8%',
      created_at: new Date().toISOString()
    });
    setOpenEditModal(true);
  };

  const handleSaveCompte = async () => {
    if (!currentCompte) return;

    setLoading(true);
    try {
      if (!currentCompte.id) {
        const { data, error } = await supabase
          .from('comptebancaire')
          .insert([currentCompte])
          .select()
          .single();

        if (error) throw error;
        
        setComptes([data, ...comptes]);
        setSnackbar({
          open: true,
          message: 'Compte bancaire créé avec succès',
          severity: 'success'
        });
      } else {
        const { error } = await supabase
          .from('comptebancaire')
          .update(currentCompte)
          .eq('id', currentCompte.id);

        if (error) throw error;
        
        setComptes(comptes.map(c => c.id === currentCompte.id ? currentCompte : c));
        setSnackbar({
          open: true,
          message: 'Compte bancaire mis à jour',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error saving compte:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompte = async () => {
    if (!currentCompte) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comptebancaire')
        .delete()
        .eq('id', currentCompte.id);

      if (error) throw error;
      
      setComptes(comptes.filter(c => c.id !== currentCompte.id));
      setSnackbar({
        open: true,
        message: 'Compte supprimé avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting compte:', error);
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

  const filteredComptes = comptes.filter(compte => {
    const userMatch = users.find(u => u.id === compte.user_id);
    return (
      compte.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compte.etablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compte.type_compte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMatch?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userMatch?.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Comptes Bancaires</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={20} />}
          onClick={handleNewCompteClick}
        >
          Nouveau Compte
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Rechercher des comptes"
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
                  <TableCell>Titulaire</TableCell>
                  <TableCell>Libellé</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Établissement</TableCell>
                  <TableCell>Solde (€)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredComptes.map((compte) => {
                  const user = users.find(u => u.id === compte.user_id);
                  return (
                    <TableRow key={compte.id}>
                      <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Inconnu'}</TableCell>
                      <TableCell>{compte.libelle}</TableCell>
                      <TableCell>{compte.type_compte}</TableCell>
                      <TableCell>{compte.etablissement}</TableCell>
                      <TableCell>{compte.value.toLocaleString('fr-FR')}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(compte)}>
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
          {currentCompte?.id ? 'Modifier le compte' : 'Créer un nouveau compte'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Titulaire</InputLabel>
                <Select
                  label="Titulaire"
                  value={currentCompte?.user_id || ''}
                  onChange={(e) => currentCompte && setCurrentCompte({
                    ...currentCompte,
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
                <InputLabel>Type de compte</InputLabel>
                <Select
                  label="Type de compte"
                  value={currentCompte?.type_compte || 'Compte courant'}
                  onChange={(e) => currentCompte && setCurrentCompte({
                    ...currentCompte,
                    type_compte: e.target.value
                  })}
                >
                  {compteTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Famille de liquidités</InputLabel>
                <Select
                  label="Famille de liquidités"
                  value={currentCompte?.famille_liquidites || 'Autre'}
                  onChange={(e) => currentCompte && setCurrentCompte({
                    ...currentCompte,
                    famille_liquidites: e.target.value
                  })}
                >
                  {liquiditeTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Établissement bancaire"
                value={currentCompte?.etablissement || ''}
                onChange={(e) => currentCompte && setCurrentCompte({
                  ...currentCompte,
                  etablissement: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Libellé"
                value={currentCompte?.libelle || ''}
                onChange={(e) => currentCompte && setCurrentCompte({
                  ...currentCompte,
                  libelle: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentCompte?.contrat_gere || false}
                    onChange={(e) => currentCompte && setCurrentCompte({
                      ...currentCompte,
                      contrat_gere: e.target.checked
                    })}
                  />
                }
                label="Contrat géré"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date d'ouverture"
                type="date"
                value={currentCompte?.date_acquisition?.split('T')[0] || ''}
                onChange={(e) => currentCompte && setCurrentCompte({
                  ...currentCompte,
                  date_acquisition: e.target.value
                })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de clôture"
                type="date"
                value={currentCompte?.date_cloture?.split('T')[0] || ''}
                onChange={(e) => currentCompte && setCurrentCompte({
                  ...currentCompte,
                  date_cloture: e.target.value
                })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Solde (€)"
                type="number"
                value={currentCompte?.value || ''}
                onChange={(e) => currentCompte && setCurrentCompte({
                  ...currentCompte,
                  value: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Épargne annuelle (€)"
                type="number"
                value={currentCompte?.epargne_annuelle || ''}
                onChange={(e) => currentCompte && setCurrentCompte({
                  ...currentCompte,
                  epargne_annuelle: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Propriétaire</InputLabel>
                <Select
                  label="Propriétaire"
                  value={currentCompte?.proprietaire || 'Personne 1'}
                  onChange={(e) => currentCompte && setCurrentCompte({
                    ...currentCompte,
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
                  value={currentCompte?.type_propriete || 'PP'}
                  onChange={(e) => currentCompte && setCurrentCompte({
                    ...currentCompte,
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
                label="Taux d'intérêt (%)"
                type="number"
                value={currentCompte?.taux || ''}
                onChange={(e) => currentCompte && setCurrentCompte({
                  ...currentCompte,
                  taux: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Optimisation fiscale</InputLabel>
                <Select
                  label="Optimisation fiscale"
                  value={currentCompte?.optimisation || 'PFU 12,8%'}
                  onChange={(e) => currentCompte && setCurrentCompte({
                    ...currentCompte,
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
          {currentCompte?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Supprimer
            </Button>
          )}
          <Button 
            onClick={handleSaveCompte}
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
          Êtes-vous sûr de vouloir supprimer ce compte bancaire ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteCompte} 
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

export default CompteBancaireListPage;