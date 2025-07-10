import React, { useState, useEffect } from 'react';
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
  Select
} from '@mui/material';
import {
  Edit2 as EditIcon,
  Trash2 as DeleteIcon,
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
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
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
  }, []);

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setOpenEditModal(true);
    setIsEditing(true);
  };

  const handleNewUserClick = () => {
    setCurrentUser({
      id: '',
      last_name: '',
      first_name: '',
      power: 1,
      email: '',
      created_at: new Date().toISOString(),
      civilite: 'M.',
      date_naissance: '',
      part_fiscale: 1
    });
    setOpenEditModal(true);
    setIsEditing(true);
  };

  const handleSaveUser = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      if (!currentUser.id) {
        // New user
        const { data, error } = await supabase
          .from('users')
          .insert([currentUser])
          .select()
          .single();

        if (error) throw error;
        
        setUsers([data, ...users]);
        setSnackbar({
          open: true,
          message: 'User created successfully',
          severity: 'success'
        });
      } else {
        // Update existing user
        const { error } = await supabase
          .from('users')
          .update(currentUser)
          .eq('id', currentUser.id);

        if (error) throw error;
        
        setUsers(users.map(u => u.id === currentUser.id ? currentUser : u));
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success'
        });
      }
      setOpenEditModal(false);
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
      
      setUsers(users.filter(u => u.id !== currentUser.id));
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
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
      setOpenEditModal(false);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Users Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={16} />}
          onClick={handleNewUserClick}
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

      {loading && !openEditModal ? (
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
                      <IconButton onClick={() => handleEditClick(user)}>
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

      {/* Edit/Create User Modal */}
      <Dialog 
        open={openEditModal} 
        onClose={() => setOpenEditModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {currentUser?.id ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Title</InputLabel>
                <Select
                  label="Title"
                  value={currentUser?.civilite || 'M.'}
                  onChange={(e) => currentUser && setCurrentUser({
                    ...currentUser,
                    civilite: e.target.value as 'M.' | 'Mme' | 'Mlle'
                  })}
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
                type="number"
                value={currentUser?.power || ''}
                onChange={(e) => currentUser && setCurrentUser({
                  ...currentUser,
                  power: Number(e.target.value)
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={currentUser?.first_name || ''}
                onChange={(e) => currentUser && setCurrentUser({
                  ...currentUser,
                  first_name: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={currentUser?.last_name || ''}
                onChange={(e) => currentUser && setCurrentUser({
                  ...currentUser,
                  last_name: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={currentUser?.email || ''}
                onChange={(e) => currentUser && setCurrentUser({
                  ...currentUser,
                  email: e.target.value
                })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birth Date"
                type="date"
                value={currentUser?.date_naissance?.split('T')[0] || ''}
                onChange={(e) => currentUser && setCurrentUser({
                  ...currentUser,
                  date_naissance: e.target.value
                })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fiscal Part"
                type="number"
                value={currentUser?.part_fiscale || ''}
                onChange={(e) => currentUser && setCurrentUser({
                  ...currentUser,
                  part_fiscale: Number(e.target.value)
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
            Cancel
          </Button>
          {currentUser?.id && (
            <Button 
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={loading}
            >
              Delete
            </Button>
          )}
          <Button 
            onClick={handleSaveUser}
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
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteUser} 
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

export default UserManagement;