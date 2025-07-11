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
import { supabase } from './../../../lib/supabase';

interface AssuranceVie {
  id: string;
  user_id: string;
  type_assurance: 'Contrat monosupport' | 'Contrat multisupport';
  libelle: string;
  numero: string;
  compagnie: string;
  date_acquisition: string;
  souscripteur: 'Personne 1' | 'Personne 2' | 'Commun';
  contrat_gere: boolean;
  somme_versee: number;
  fond_euros: number;
  unite_de_compte: number;
  value: number;
  epargne_annuelle: number;
  proprietaire: 'Personne 1' | 'Personne 2' | 'Commun';
  conjoint_part: number;
  conjoint_type: 'PP' | 'US' | 'NP -1' | 'NP -2';
  enfants_part: number;
  enfants_type: 'PP' | 'US' | 'NP -1' | 'NP -2';
  autres_part: number;
  autres_type: 'PP' | 'US' | 'NP -1' | 'NP -2';
  denouement: 'Décès 1' | 'Décés 2';
  rachat_part: number;
  created_at: string;
}

const AssuranceVieListPage: React.FC = () => {
  const [assurances, setAssurances] = useState<AssuranceVie[]>([]);
  const [currentAssurance, setCurrentAssurance] = useState<AssuranceVie | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  // Fetch assurances and users from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: assurancesData, error: assurancesError } = await supabase
          .from('assurancevie')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name');

        if (assurancesError) throw assurancesError;
        if (usersError) throw usersError;

        setAssurances(assurancesData || []);
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

  const handleEditClick = (assurance: AssuranceVie) => {
    setCurrentAssurance(assurance);
    setOpenEditModal(true);
    setIsEditing(true);
  };

  const handleNewAssuranceClick = () => {
    setCurrentAssurance({
      id: '',
      user_id: '',
      type_assurance: 'Contrat monosupport',
      libelle: '',
      numero: '',
      compagnie: '',
      date_acquisition: new Date().toISOString().split('T')[0],
      souscripteur: 'Personne 1',
      contrat_gere: false,
      somme_versee: 0,
      fond_euros: 0,
      unite_de_compte: 0,
      value: 0,
      epargne_annuelle: 0,
      proprietaire: 'Personne 1',
      conjoint_part: 0,
      conjoint_type: 'PP',
      enfants_part: 0,
      enfants_type: 'PP',
      autres_part: 0,
      autres_type: 'PP',
      denouement: 'Décès 1',
      rachat_part: 0,
      created_at: new Date().toISOString()
    });
    setOpenEditModal(true);
    setIsEditing(true);
  };

  const handleSaveAssurance = async () => {
    if (!currentAssurance) return;

    setLoading(true);
    try {
      if (!currentAssurance.id) {
        // New assurance
        const { data, error } = await supabase
          .from('assurancevie')
          .insert([currentAssurance])
          .select()
          .single();

        if (error) throw error;
        
        setAssurances([data, ...assurances]);
        setSnackbar({
          open: true,
          message: 'Assurance created successfully',
          severity: 'success'
        });
      } else {
        // Update existing assurance
        const { error } = await supabase
          .from('assurancevie')
          .update(currentAssurance)
          .eq('id', currentAssurance.id);

        if (error) throw error;
        
        setAssurances(assurances.map(a => a.id === currentAssurance.id ? currentAssurance : a));
        setSnackbar({
          open: true,
          message: 'Assurance updated successfully',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
    } catch (error) {
      console.error('Error saving assurance:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save assurance',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssurance = async () => {
    if (!currentAssurance) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('assurancevie')
        .delete()
        .eq('id', currentAssurance.id);

      if (error) throw error;
      
      setAssurances(assurances.filter(a => a.id !== currentAssurance.id));
      setSnackbar({
        open: true,
        message: 'Assurance deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting assurance:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete assurance',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
      setOpenEditModal(false);
    }
  };

  const filteredAssurances = assurances.filter(assurance =>
  assurance.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
  assurance.compagnie.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (users.find(u => u.id === assurance.user_id)?.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
  (users.find(u => u.id === assurance.user_id)?.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Assurances Vie</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={16} />}
          onClick={handleNewAssuranceClick}
        >
          New Assurance
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search Assurances"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading && !openEditModal ? (
        <Typography>Loading assurances...</Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Label</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssurances.map((assurance) => {
                  const user = users.find(u => u.id === assurance.user_id);
                  return (
                    <TableRow key={assurance.id}>
                      <TableCell>{user ? `${user.first_name} ${user.last_name}` : 'Unknown'}</TableCell>
                      <TableCell>{assurance.libelle}</TableCell>
                      <TableCell>{assurance.compagnie}</TableCell>
                      <TableCell>{assurance.type_assurance}</TableCell>
                      <TableCell>{assurance.value.toLocaleString()} €</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(assurance)}>
                          <EditIcon size={16} />
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

      {/* Edit/Create Assurance Modal */}
      <Dialog 
        open={openEditModal} 
        onClose={() => setOpenEditModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {currentAssurance?.id ? 'Edit Assurance' : 'Create New Assurance'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>User</InputLabel>
                <Select
                  label="User"
                  value={currentAssurance?.user_id || ''}
                  onChange={(e) => currentAssurance && setCurrentAssurance({
                    ...currentAssurance,
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
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={currentAssurance?.type_assurance || 'Contrat monosupport'}
                  onChange={(e) => currentAssurance && setCurrentAssurance({
                    ...currentAssurance,
                    type_assurance: e.target.value as 'Contrat monosupport' | 'Contrat multisupport'
                  })}
                >
                  <MenuItem value="Contrat monosupport">Monosupport</MenuItem>
                  <MenuItem value="Contrat multisupport">Multisupport</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Label"
                value={currentAssurance?.libelle || ''}
                onChange={(e) => currentAssurance && setCurrentAssurance({
                  ...currentAssurance,
                  libelle: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number"
                value={currentAssurance?.numero || ''}
                onChange={(e) => currentAssurance && setCurrentAssurance({
                  ...currentAssurance,
                  numero: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={currentAssurance?.compagnie || ''}
                onChange={(e) => currentAssurance && setCurrentAssurance({
                  ...currentAssurance,
                  compagnie: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Acquisition Date"
                type="date"
                value={currentAssurance?.date_acquisition?.split('T')[0] || ''}
                onChange={(e) => currentAssurance && setCurrentAssurance({
                  ...currentAssurance,
                  date_acquisition: e.target.value
                })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Subscriber</InputLabel>
                <Select
                  label="Subscriber"
                  value={currentAssurance?.souscripteur || 'Personne 1'}
                  onChange={(e) => currentAssurance && setCurrentAssurance({
                    ...currentAssurance,
                    souscripteur: e.target.value as 'Personne 1' | 'Personne 2' | 'Commun'
                  })}
                >
                  <MenuItem value="Personne 1">Person 1</MenuItem>
                  <MenuItem value="Personne 2">Person 2</MenuItem>
                  <MenuItem value="Commun">Common</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Managed Contract</InputLabel>
                <Select
                  label="Managed Contract"
                  value={currentAssurance?.contrat_gere ? 'true' : 'false'}
                  onChange={(e) => currentAssurance && setCurrentAssurance({
                    ...currentAssurance,
                    contrat_gere: e.target.value === 'true'
                  })}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount Paid"
                type="number"
                value={currentAssurance?.somme_versee || ''}
                onChange={(e) => currentAssurance && setCurrentAssurance({
                  ...currentAssurance,
                  somme_versee: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Euro Fund"
                type="number"
                value={currentAssurance?.fond_euros || ''}
                onChange={(e) => currentAssurance && setCurrentAssurance({
                  ...currentAssurance,
                  fond_euros: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unit Account"
                type="number"
                value={currentAssurance?.unite_de_compte || ''}
                onChange={(e) => currentAssurance && setCurrentAssurance({
                  ...currentAssurance,
                  unite_de_compte: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Value"
                type="number"
                value={currentAssurance?.value || ''}
                onChange={(e) => currentAssurance && setCurrentAssurance({
                  ...currentAssurance,
                  value: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Annual Savings"
                type="number"
                value={currentAssurance?.epargne_annuelle || ''}
                onChange={(e) => currentAssurance && setCurrentAssurance({
                  ...currentAssurance,
                  epargne_annuelle: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Owner</InputLabel>
                <Select
                  label="Owner"
                  value={currentAssurance?.proprietaire || 'Personne 1'}
                  onChange={(e) => currentAssurance && setCurrentAssurance({
                    ...currentAssurance,
                    proprietaire: e.target.value as 'Personne 1' | 'Personne 2' | 'Commun'
                  })}
                >
                  <MenuItem value="Personne 1">Person 1</MenuItem>
                  <MenuItem value="Personne 2">Person 2</MenuItem>
                  <MenuItem value="Commun">Common</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Add more fields as needed */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenEditModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          {currentAssurance?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Delete
            </Button>
          )}
          <Button 
            onClick={handleSaveAssurance}
            variant="contained"
            startIcon={<SaveIcon size={16} />}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this assurance? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAssurance} 
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
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

export default AssuranceVieListPage;