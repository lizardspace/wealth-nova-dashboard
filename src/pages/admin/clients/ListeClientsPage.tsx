// src/components/AdminUserManagement.tsx
import React, { useState, useEffect } from 'react';
import { Search, Users, UserPlus, Edit, Trash2, Eye, Calendar, Mail } from 'lucide-react';
import { supabase } from './../../../lib/supabase';

interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  civilite?: string;
  date_naissance?: string;
  part_fiscale?: number;
  power?: number;
  created_at?: string;
  last_login?: string;
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    civilite: 'M.',
    date_naissance: '',
    part_fiscale: 1,
    power: 0
  });

  const fetchUsers = async () => {
    console.log('[fetchUsers] Début de la fonction');
    setLoading(true);
    try {
      console.log('[fetchUsers] Initialisation de la requête Supabase');
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' });

      console.log('[fetchUsers] Requête initiale:', query);

      if (searchTerm) {
        console.log('[fetchUsers] Ajout de la condition de recherche pour:', searchTerm);
        query = query.or(
          `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
        );
      }

      console.log('[fetchUsers] Requête après recherche:', query);

      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const from = (currentPage - 1) * usersPerPage;
      const to = from + usersPerPage - 1;
      query = query.range(from, to);

      console.log('[fetchUsers] Requête finale avant exécution:', query);

      const { data, error, count } = await query;

      console.log('[fetchUsers] Résultats de la requête:', { 
        data, 
        error, 
        count,
        searchTerm,
        currentPage,
        sortBy,
        sortOrder
      });

      if (error) {
        console.error('[fetchUsers] Erreur Supabase:', error);
        throw error;
      }

      console.log('[fetchUsers] Données reçues:', data);
      console.log('[fetchUsers] Nombre total d\'utilisateurs:', count);

      setUsers(data || []);
      setTotalUsers(count || 0);
      
      console.log('[fetchUsers] State après mise à jour:', {
        users: data,
        totalUsers: count
      });
    } catch (error) {
      console.error('[fetchUsers] Erreur complète:', error);
      console.error('[fetchUsers] Message d\'erreur:', error.message);
      console.error('[fetchUsers] Stack trace:', error.stack);
      alert('Erreur lors du chargement des utilisateurs: ' + error.message);
    } finally {
      setLoading(false);
      console.log('[fetchUsers] Chargement terminé');
    }
  };

  useEffect(() => {
    console.log('[useEffect] Déclenché', { 
      currentPage, 
      sortBy, 
      sortOrder, 
      searchTerm 
    });
    fetchUsers();
  }, [currentPage, sortBy, sortOrder, searchTerm]);

  console.log('[Rendu] Composant rendu', { 
    users, 
    loading, 
    searchTerm, 
    sortBy, 
    sortOrder, 
    currentPage,
    totalUsers
  });

  const handleSort = (column: string) => {
    console.log('[handleSort] Tri demandé pour la colonne:', column);
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const openModal = (mode: 'view' | 'edit' | 'create', user: User | null = null) => {
    console.log('[openModal] Ouverture modale', { mode, user });
    setModalMode(mode);
    if (user) {
      setSelectedUser(user);
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        civilite: user.civilite || 'M.',
        date_naissance: user.date_naissance || '',
        part_fiscale: user.part_fiscale || 1,
        power: user.power || 0
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        civilite: 'M.',
        date_naissance: '',
        part_fiscale: 1,
        power: 0
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    console.log('[closeModal] Fermeture modale');
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[handleSubmit] Soumission du formulaire', formData);
    try {
      if (modalMode === 'create') {
        console.log('[handleSubmit] Création nouvel utilisateur');
        const { error } = await supabase
          .from('users')
          .insert([formData]);
        if (error) throw error;
      } else if (modalMode === 'edit' && selectedUser) {
        console.log('[handleSubmit] Mise à jour utilisateur existant', selectedUser.id);
        const { error } = await supabase
          .from('users')
          .update(formData)
          .eq('id', selectedUser.id);
        if (error) throw error;
      }
      
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('[handleSubmit] Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde: ' + error.message);
    }
  };

  const handleDelete = async (userId: string) => {
    console.log('[handleDelete] Suppression demandée pour:', userId);
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
        fetchUsers();
      } catch (error) {
        console.error('[handleDelete] Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression: ' + error.message);
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                <p className="text-gray-600">Administrez les comptes utilisateurs de votre plateforme</p>
              </div>
            </div>
            <button
              onClick={() => openModal('create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Nouvel Utilisateur</span>
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou email..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Total: {totalUsers} utilisateurs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('civilite')}
                  >
                    Civilité
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('first_name')}
                  >
                    Prénom {sortBy === 'first_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('last_name')}
                  >
                    Nom {sortBy === 'last_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('email')}
                  >
                    Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('date_naissance')}
                  >
                    Date de naissance
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created_at')}
                  >
                    Inscription {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('last_login')}
                  >
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Chargement...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.civilite || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.first_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.last_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          {user.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {formatDate(user.date_naissance)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.last_login ? formatDate(user.last_login) : 'Jamais'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openModal('view', user)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Voir"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openModal('edit', user)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> à{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * usersPerPage, totalUsers)}
                    </span> sur{' '}
                    <span className="font-medium">{totalUsers}</span> résultats
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const page = i + Math.max(1, currentPage - 2);
                    return page <= totalPages ? (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded-md text-sm font-medium ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ) : null;
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === 'view' && 'Détails de l\'utilisateur'}
                  {modalMode === 'edit' && 'Modifier l\'utilisateur'}
                  {modalMode === 'create' && 'Nouvel utilisateur'}
                </h3>
              </div>

              <div className="px-6 py-4">
                {modalMode === 'view' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono">{selectedUser?.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Civilité</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser?.civilite || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prénom</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser?.first_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser?.last_name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser?.date_naissance)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Part fiscale</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser?.part_fiscale || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Niveau d'accès</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser?.power || 0}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date d'inscription</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser?.created_at)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dernière connexion</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedUser?.last_login ? formatDate(selectedUser.last_login) : 'Jamais'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Civilité</label>
                      <select
                        value={formData.civilite}
                        onChange={(e) => setFormData({ ...formData, civilite: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="M.">M.</option>
                        <option value="Mme">Mme</option>
                        <option value="Mlle">Mlle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prénom</label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                      <input
                        type="date"
                        value={formData.date_naissance}
                        onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Part fiscale</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.part_fiscale}
                        onChange={(e) => setFormData({ ...formData, part_fiscale: parseFloat(e.target.value) || 0 })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Niveau d'accès</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.power}
                        onChange={(e) => setFormData({ ...formData, power: parseInt(e.target.value) || 0 })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {modalMode === 'create' ? 'Créer' : 'Sauvegarder'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;