import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Tab,
  Tabs,
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
  SelectChangeEvent
} from '@mui/material';
import {
  Edit2 as EditIcon,
  Trash2 as DeleteIcon,
  ArrowLeft as ArrowBackIcon,
  Save as SaveIcon,
  Plus as AddIcon
} from 'lucide-react';
import { supabase } from './../../../lib/supabase';

interface User {
  id: string;
  last_name: string;
  first_name: string;
  power: number;
  email: string;
  created_at: string;
  civilite: 'M.' | 'Mme' | 'Mlle';
  date_naissance: string;
  part_fiscale: number;
}

const UserManagement: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (id && id !== 'new') {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          setCurrentUser(data);
        } else if (!id) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          setUsers(data || []);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch users',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [id]);

  const handleSaveUser = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      if (isNewUser) {
        const { data, error } = await supabase
          .from('users')
          .insert([currentUser])
          .select()
          .single();

        if (error) throw error;
        
        setSnackbar({
          open: true,
          message: 'User created successfully',
          severity: 'success'
        });
        navigate(`/admin/users/${data.id}`);
      } else {
        const { error } = await supabase
          .from('users')
          .update(currentUser)
          .eq('id', currentUser.id);

        if (error) throw error;
        
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success'
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save user',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', currentUser.id);

      if (error) throw error;
      
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      navigate('/admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete user',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !currentUser && id) {
    return <Typography>Loading user data...</Typography>;
  }

  if (id) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/admin/users')} sx={{ mr: 1 }}>
            <ArrowBackIcon size={20} />
          </IconButton>
          <Typography variant="h4">
            {isNewUser ? 'New User' : `${currentUser?.first_name} ${currentUser?.last_name}`}
          </Typography>
          
          {!isEditing && !isNewUser && (
            <Box sx={{ ml: 'auto' }}>
              <Button
                variant="contained"
                startIcon={<EditIcon size={16} />}
                onClick={() => setIsEditing(true)}
                sx={{ mr: 2 }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon size={16} />}
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>

        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Profile" />
          <Tab label="Related Data" />
          <Tab label="Activity" />
        </Tabs>

        {tabValue === 0 && (
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Title</InputLabel>
                  <Select
                    label="Title"
                    name="civilite"
                    value={currentUser?.civilite || 'M.'}
                    onChange={(e) => currentUser && setCurrentUser({
                      ...currentUser,
                      civilite: e.target.value as 'M.' | 'Mme' | 'Mlle'
                    })}
                    disabled={!isEditing}
                  >
                    <MenuItem value="M.">Mr.</MenuItem>
                    <MenuItem value="Mme">Mrs.</MenuItem>
                    <MenuItem value="Mlle">Miss</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Power Level"
                  name="power"
                  type="number"
                  value={currentUser?.power || ''}
                  onChange={(e) => currentUser && setCurrentUser({
                    ...currentUser,
                    power: Number(e.target.value)
                  })}
                  margin="normal"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={currentUser?.first_name || ''}
                  onChange={(e) => currentUser && setCurrentUser({
                    ...currentUser,
                    first_name: e.target.value
                  })}
                  margin="normal"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={currentUser?.last_name || ''}
                  onChange={(e) => currentUser && setCurrentUser({
                    ...currentUser,
                    last_name: e.target.value
                  })}
                  margin="normal"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={currentUser?.email || ''}
                  onChange={(e) => currentUser && setCurrentUser({
                    ...currentUser,
                    email: e.target.value
                  })}
                  margin="normal"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Birth Date"
                  name="date_naissance"
                  type="date"
                  value={currentUser?.date_naissance?.split('T')[0] || ''}
                  onChange={(e) => currentUser && setCurrentUser({
                    ...currentUser,
                    date_naissance: e.target.value
                  })}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fiscal Part"
                  name="part_fiscale"
                  type="number"
                  value={currentUser?.part_fiscale || ''}
                  onChange={(e) => currentUser && setCurrentUser({
                    ...currentUser,
                    part_fiscale: Number(e.target.value)
                  })}
                  margin="normal"
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => isNewUser ? navigate('/admin/users') : setIsEditing(false)}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon size={16} />}
                  onClick={handleSaveUser}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            )}
          </Paper>
        )}

        {tabValue === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Related Data
            </Typography>
            <Typography color="textSecondary">
              User related data would be displayed here
            </Typography>
          </Paper>
        )}

        {tabValue === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Activity
            </Typography>
            <Typography color="textSecondary">
              User activity logs would be displayed here
            </Typography>
          </Paper>
        )}

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleDeleteUser} 
              color="error"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={16} />}
          onClick={() => navigate('/admin/users/new')}
        >
          New User
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search Users"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <Typography>Loading users...</Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Power</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.civilite}</TableCell>
                    <TableCell>{user.power}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => navigate(`/admin/users/${user.id}`)}>
                        <EditIcon size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

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

export default UserManagement;