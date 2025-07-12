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
  Chip,
  Tabs,
  Tab,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Add as AddIcon,
  AccountBalance as PensionIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { supabase } from '../../../lib/supabase';

interface Retraite {
  id: string;
  user_id: string;
  epargne_retraite: boolean;
  montant_epargne: number;
  complement_retraite: string;
  contrats_prevoyance: string[];
  created_at: string;
}

interface RetraiteComplementaire {
  id: string;
  user_id: string;
  type_produit_retraite: 'Contrat monosupport' | 'Contrat multisupport';
  libelle: string;
  numero: string;
  value: number;
  souscripteur: string;
  created_at: string;
}

const complementRetraiteOptions = [
  'PER',
  'PERP',
  'Madelin',
  'Article 83',
  'PERCO',
  'Autre'
];

const RetraiteListPage: React.FC = () => {
  const [retraites, setRetraites] = useState<Retraite[]>([]);
  const [complementaires, setComplementaires] = useState<RetraiteComplementaire[]>([]);
  const [currentRetraite, setCurrentRetraite] = useState<Retraite | null>(null);
  const [currentComplementaire, setCurrentComplementaire] = useState<RetraiteComplementaire | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openComplementaireModal, setOpenComplementaireModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch retraite data
        const { data: retraiteData, error: retraiteError } = await supabase
          .from('retraite')
          .select('*');

        // Fetch retraite complementaire data
        const { data: complementaireData, error: complementaireError } = await supabase
          .from('retraitecomplementaire')
          .select('*');

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (retraiteError) throw retraiteError;
        if (complementaireError) throw complementaireError;
        if (usersError) throw usersError;

        setRetraites(retraiteData || []);
        setComplementaires(complementaireData || []);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditRetraiteClick = (retraite: Retraite) => {
    setCurrentRetraite(retraite);
    setOpenEditModal(true);
  };

  const handleEditComplementaireClick = (complementaire: RetraiteComplementaire) => {
    setCurrentComplementaire(complementaire);
    setOpenComplementaireModal(true);
  };

  const handleNewRetraiteClick = () => {
    setCurrentRetraite({
      id: '',
      user_id: '',
      epargne_retraite: false,
      montant_epargne: 0,
      complement_retraite: '',
      contrats_prevoyance: [],
      created_at: new Date().toISOString()
    });
    setOpenEditModal(true);
  };

  const handleNewComplementaireClick = () => {
    setCurrentComplementaire({
      id: '',
      user_id: '',
      type_produit_retraite: 'Contrat monosupport',
      libelle: '',
      numero: '',
      value: 0,
      souscripteur: '',
      created_at: new Date().toISOString()
    });
    setOpenComplementaireModal(true);
  };

  const handleSaveRetraite = async () => {
    if (!currentRetraite) return;

    setLoading(true);
    try {
      if (!currentRetraite.id) {
        const { data, error } = await supabase
          .from('retraite')
          .insert([currentRetraite])
          .select()
          .single();

        if (error) throw error;
        
        setRetraites([data, ...retraites]);
        setSnackbar({
          open: true,
          message: 'Plan retraite créé avec succès',
          severity: 'success'
        });
      } else {
        const { error } = await supabase
          .from('retraite')
          .update(currentRetraite)
          .eq('id', currentRetraite.id);

        if (error) throw error;
        
        setRetraites(retraites.map(r => r.id === currentRetraite.id ? currentRetraite : r));
        setSnackbar({
          open: true,
          message: 'Plan retraite mis à jour',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error saving retraite:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveComplementaire = async () => {
    if (!currentComplementaire) return;

    setLoading(true);
    try {
      if (!currentComplementaire.id) {
        const { data, error } = await supabase
          .from('retraitecomplementaire')
          .insert([currentComplementaire])
          .select()
          .single();

        if (error) throw error;
        
        setComplementaires([data, ...complementaires]);
        setSnackbar({
          open: true,
          message: 'Contrat complémentaire créé avec succès',
          severity: 'success'
        });
      } else {
        const { error } = await supabase
          .from('retraitecomplementaire')
          .update(currentComplementaire)
          .eq('id', currentComplementaire.id);

        if (error) throw error;
        
        setComplementaires(complementaires.map(c => c.id === currentComplementaire.id ? currentComplementaire : c));
        setSnackbar({
          open: true,
          message: 'Contrat complémentaire mis à jour',
          severity: 'success'
        });
      }
      setOpenComplementaireModal(false);
    } catch (error) {
      console.error('Error saving complementaire:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la sauvegarde',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const idToDelete = currentRetraite?.id || currentComplementaire?.id;
    if (!idToDelete) return;

    setLoading(true);
    try {
      const tableName = currentRetraite ? 'retraite' : 'retraitecomplementaire';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', idToDelete);

      if (error) throw error;
      
      if (currentRetraite) {
        setRetraites(retraites.filter(r => r.id !== idToDelete));
      } else {
        setComplementaires(complementaires.filter(c => c.id !== idToDelete));
      }
      
      setSnackbar({
        open: true,
        message: 'Élément supprimé avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
      setOpenEditModal(false);
      setOpenComplementaireModal(false);
    }
  };

  const filteredRetraites = retraites.filter(retraite => {
    const userMatch = users.find(u => u.id === retraite.user_id);
    return (
      retraite.complement_retraite.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userMatch?.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (userMatch?.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const filteredComplementaires = complementaires.filter(complementaire => {
    const userMatch = users.find(u => u.id === complementaire.user_id);
    return (
      complementaire.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complementaire.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestion des retraites</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={tabValue === 0 ? handleNewRetraiteClick : handleNewComplementaireClick}
        >
          {tabValue === 0 ? 'Nouveau plan retraite' : 'Nouveau contrat'}
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Plans retraite" icon={<PensionIcon />} iconPosition="start" />
        <Tab label="Complémentaires" icon={<WorkIcon />} iconPosition="start" />
      </Tabs>

      <TextField
        fullWidth
        label="Rechercher"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading && !openEditModal && !openComplementaireModal ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tabValue === 0 ? (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Utilisateur</TableCell>
                      <TableCell>Épargne retraite</TableCell>
                      <TableCell>Montant épargne</TableCell>
                      <TableCell>Complément retraite</TableCell>
                      <TableCell>Contrats prévoyance</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRetraites.map((retraite) => (
                      <TableRow key={retraite.id}>
                        <TableCell>{getUserName(retraite.user_id)}</TableCell>
                        <TableCell>
                          <Chip
                            label={retraite.epargne_retraite ? 'Oui' : 'Non'}
                            color={retraite.epargne_retraite ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatCurrency(retraite.montant_epargne)}</TableCell>
                        <TableCell>{retraite.complement_retraite}</TableCell>
                        <TableCell>
                          {retraite.contrats_prevoyance?.map((contrat, index) => (
                            <Chip key={index} label={contrat} size="small" sx={{ m: 0.5 }} />
                          ))}
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditRetraiteClick(retraite)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Paper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Utilisateur</TableCell>
                      <TableCell>Type produit</TableCell>
                      <TableCell>Libellé</TableCell>
                      <TableCell>Numéro</TableCell>
                      <TableCell>Valeur</TableCell>
                      <TableCell>Souscripteur</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredComplementaires.map((complementaire) => (
                      <TableRow key={complementaire.id}>
                        <TableCell>{getUserName(complementaire.user_id)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={complementaire.type_produit_retraite} 
                            size="small" 
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>{complementaire.libelle}</TableCell>
                        <TableCell>{complementaire.numero}</TableCell>
                        <TableCell>{formatCurrency(complementaire.value)}</TableCell>
                        <TableCell>{complementaire.souscripteur}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditComplementaireClick(complementaire)}>
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
        </>
      )}

      {/* Modal for Retraite */}
      <Dialog 
        open={openEditModal} 
        onClose={() => setOpenEditModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {currentRetraite?.id ? 'Modifier le plan retraite' : 'Créer un nouveau plan retraite'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Utilisateur</InputLabel>
                <Select
                  label="Utilisateur"
                  value={currentRetraite?.user_id || ''}
                  onChange={(e) => currentRetraite && setCurrentRetraite({
                    ...currentRetraite,
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
              <FormControlLabel
                control={
                  <Switch
                    checked={currentRetraite?.epargne_retraite || false}
                    onChange={(e) => currentRetraite && setCurrentRetraite({
                      ...currentRetraite,
                      epargne_retraite: e.target.checked
                    })}
                  />
                }
                label="Épargne retraite"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Montant épargne (€)"
                type="number"
                value={currentRetraite?.montant_epargne || ''}
                onChange={(e) => currentRetraite && setCurrentRetraite({
                  ...currentRetraite,
                  montant_epargne: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Complément retraite</InputLabel>
                <Select
                  label="Complément retraite"
                  value={currentRetraite?.complement_retraite || ''}
                  onChange={(e) => currentRetraite && setCurrentRetraite({
                    ...currentRetraite,
                    complement_retraite: e.target.value
                  })}
                >
                  {complementRetraiteOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Contrats de prévoyance</InputLabel>
                <Select
                  multiple
                  label="Contrats de prévoyance"
                  value={currentRetraite?.contrats_prevoyance || []}
                  onChange={(e) => currentRetraite && setCurrentRetraite({
                    ...currentRetraite,
                    contrats_prevoyance: e.target.value as string[]
                  })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {complementRetraiteOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
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
          {currentRetraite?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Supprimer
            </Button>
          )}
          <Button 
            onClick={handleSaveRetraite}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for RetraiteComplementaire */}
      <Dialog 
        open={openComplementaireModal} 
        onClose={() => setOpenComplementaireModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {currentComplementaire?.id ? 'Modifier le contrat complémentaire' : 'Créer un nouveau contrat complémentaire'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Utilisateur</InputLabel>
                <Select
                  label="Utilisateur"
                  value={currentComplementaire?.user_id || ''}
                  onChange={(e) => currentComplementaire && setCurrentComplementaire({
                    ...currentComplementaire,
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
                <InputLabel>Type de produit</InputLabel>
                <Select
                  label="Type de produit"
                  value={currentComplementaire?.type_produit_retraite || 'Contrat monosupport'}
                  onChange={(e) => currentComplementaire && setCurrentComplementaire({
                    ...currentComplementaire,
                    type_produit_retraite: e.target.value as 'Contrat monosupport' | 'Contrat multisupport'
                  })}
                >
                  <MenuItem value="Contrat monosupport">Contrat monosupport</MenuItem>
                  <MenuItem value="Contrat multisupport">Contrat multisupport</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Libellé"
                value={currentComplementaire?.libelle || ''}
                onChange={(e) => currentComplementaire && setCurrentComplementaire({
                  ...currentComplementaire,
                  libelle: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Numéro"
                value={currentComplementaire?.numero || ''}
                onChange={(e) => currentComplementaire && setCurrentComplementaire({
                  ...currentComplementaire,
                  numero: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valeur (€)"
                type="number"
                value={currentComplementaire?.value || ''}
                onChange={(e) => currentComplementaire && setCurrentComplementaire({
                  ...currentComplementaire,
                  value: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Souscripteur"
                value={currentComplementaire?.souscripteur || ''}
                onChange={(e) => currentComplementaire && setCurrentComplementaire({
                  ...currentComplementaire,
                  souscripteur: e.target.value
                })}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenComplementaireModal(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          {currentComplementaire?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Supprimer
            </Button>
          )}
          <Button 
            onClick={handleSaveComplementaire}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete} 
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

export default RetraiteListPage;