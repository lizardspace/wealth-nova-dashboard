import { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Calendar as CalendarIcon, Tag as TagIcon, AlertCircle, Youtube } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

// Initialisation du client Supabase
const supabaseUrl = 'https://xoxbpdkqvtulavbpfmgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGJwZGtxdnR1bGF2YnBmbWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0MjMsImV4cCI6MjA2MDMyNTQyM30.XVzmmTfjcMNDchCd7ed-jG3N8WoLuD3RyDZguyZh1EM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction utilitaire pour le formatage des dates
const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non définie';
    try {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (error) {
        console.error('Erreur lors du formatage de la date:', error);
        return 'Date invalide';
    }
};

// Composant Modal de confirmation
const ConfirmationModal = ({ isOpen, onClose, onConfirm, videoTitle, isLoading }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    videoTitle?: string;
    isLoading: boolean;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {videoTitle ?
                                `Êtes-vous sûr de vouloir supprimer la vidéo "${videoTitle}" ?` :
                                "Êtes-vous sûr de vouloir supprimer cette vidéo ?"}
                        </p>
                        <p className="text-xs text-red-500 mt-2">Cette action est irréversible.</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Suppression...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ListeVideos() {
    const [videos, setVideos] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [confirmDelete, setConfirmDelete] = useState<any>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 10;

    // Récupérer les catégories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('journal_categories')
                    .select('id, name');

                if (error) throw error;

                setCategories(data || []);
            } catch (error) {
                console.error('Erreur lors de la récupération des catégories:', error);
                showNotification('Échec du chargement des catégories', 'error');
            }
        };

        fetchCategories();
    }, []);

    // Récupération paginée des vidéos
    useEffect(() => {
        const fetchVideos = async () => {
            if (!hasMore && page > 0) return;

            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('journal_videos')
                    .select(`
                        id,
                        title,
                        youtube_id,
                        youtube_url,
                        publish_date,
                        is_published,
                        is_featured,
                        category_id,
                        duration_seconds,
                        thumbnail_url
                    `)
                    .order('publish_date', { ascending: false })
                    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

                if (error) throw error;

                if (data.length < PAGE_SIZE) {
                    setHasMore(false);
                }

                setVideos(prev => page === 0 ? data : [...prev, ...data]);
            } catch (error) {
                console.error('Erreur lors du chargement des vidéos:', error);
                showNotification('Échec du chargement des vidéos', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideos();
    }, [page, hasMore]);

    const showNotification = (message: string, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleOpenDeleteModal = (video: any) => {
        setConfirmDelete(video);
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;

        try {
            setIsDeleting(true);
            const { error } = await supabase
                .from('journal_videos')
                .delete()
                .eq('id', confirmDelete.id);

            if (error) throw error;

            setVideos(prev => prev.filter(video => video.id !== confirmDelete.id));
            showNotification('Vidéo supprimée avec succès');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            showNotification('Échec de la suppression', 'error');
        } finally {
            setIsDeleting(false);
            setConfirmDelete(null);
        }
    };

    const loadMoreVideos = () => {
        if (!isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Non catégorisé';
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Liste des vidéos</h1>

            {notification.show && (
                <div className={`mb-4 p-4 rounded-md flex items-center ${notification.type === 'error' 
                    ? 'bg-red-50 text-red-700 border-l-4 border-red-500' 
                    : 'bg-green-50 text-green-700 border-l-4 border-green-500'}`}>
                    {notification.message}
                </div>
            )}

            {isLoading && page === 0 ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : videos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune vidéo trouvée</p>
            ) : (
                <div className="space-y-4">
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vidéo
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Catégorie
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Durée
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {videos.map((video) => (
                                    <tr key={video.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-16 w-28 mr-4 relative">
                                                    <img 
                                                        className="h-16 w-28 rounded-md object-cover" 
                                                        src={video.thumbnail_url} 
                                                        alt="Miniature" 
                                                    />
                                                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                                                        {formatDuration(video.duration_seconds)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{video.title}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <Youtube className="h-4 w-4 mr-1 text-red-500" />
                                                        {video.youtube_id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <TagIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-900">
                                                    {getCategoryName(video.category_id)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDuration(video.duration_seconds)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-900">
                                                    {formatDate(video.publish_date)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${video.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {video.is_published ? 'Publié' : 'Brouillon'}
                                            </span>
                                            {video.is_featured && (
                                                <span className="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    À la une
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <a
                                                    href={video.youtube_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                    title="Voir"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </a>
                                                <Link
                                                    to={`/admin/videos/edit/${video.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                                                    title="Modifier"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleOpenDeleteModal(video)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                    title="Supprimer"
                                                    disabled={isLoading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={loadMoreVideos}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                {isLoading ? 'Chargement...' : 'Charger plus de vidéos'}
                            </button>
                        </div>
                    )}

                    {isLoading && page > 0 && (
                        <div className="flex justify-center mt-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </div>
            )}

            <ConfirmationModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
                videoTitle={confirmDelete?.title}
                isLoading={isDeleting}
            />
        </div>
    );
}