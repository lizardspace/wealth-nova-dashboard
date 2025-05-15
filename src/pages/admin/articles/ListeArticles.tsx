import { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Calendar as CalendarIcon, Tag as TagIcon, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = 'https://xoxbpdkqvtulavbpfmgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGJwZGtxdnR1bGF2YnBmbWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0MjMsImV4cCI6MjA2MDMyNTQyM30.XVzmmTfjcMNDchCd7ed-jG3N8WoLuD3RyDZguyZh1EM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction utilitaire pour le formatage des dates
const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (error) {
        console.error('Erreur lors du formatage de la date:', error);
        return 'Date invalide';
    }
};

// Composant Modal de confirmation amélioré
const ConfirmationModal = ({ isOpen, onClose, onConfirm, articleTitle, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 ease-in-out"
                style={{
                    animation: "scaleIn 0.2s ease-out forwards",
                }}
            >
                <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {articleTitle ?
                                `Êtes-vous sûr de vouloir supprimer l'article "${articleTitle}" ?` :
                                "Êtes-vous sûr de vouloir supprimer cet article ?"}
                        </p>
                        <p className="text-xs text-red-500 mt-2">Cette action est irréversible.</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200 flex items-center"
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

export default function ListeArticles() {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const PAGE_SIZE = 10;

    // Récupérer les articles et les catégories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log('Chargement des catégories...');

                // Récupérer uniquement les catégories
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from('journal_categories')
                    .select('id, name');

                if (categoriesError) {
                    console.error('Erreur lors de la récupération des catégories:', categoriesError);
                    throw categoriesError;
                }

                setCategories(categoriesData || []);
            } catch (error) {
                console.error('Erreur lors du chargement des catégories:', error);
                showNotification('Échec du chargement des catégories', 'error');
            }
        };

        fetchCategories();
    }, []);

    // Récupération paginée des articles
    useEffect(() => {
        const fetchArticles = async () => {
            if (!hasMore && page > 0) return;

            try {
                setIsLoading(true);
                console.log(`Chargement des articles (page ${page + 1})...`);

                // Récupérer les articles avec pagination
                const { data: articlesData, error: articlesError } = await supabase
                    .from('journal_articles_human')
                    .select(`
            id,
            title,
            slug, 
            featured_image,
            publish_date,
            is_published,
            category_id
          `)
                    .order('publish_date', { ascending: false })
                    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

                if (articlesError) {
                    console.error('Erreur lors de la récupération des articles:', articlesError);
                    throw articlesError;
                }

                // Vérifier s'il y a d'autres articles à charger
                if (articlesData.length < PAGE_SIZE) {
                    setHasMore(false);
                }

                // Ajouter les nouveaux articles aux articles existants
                setArticles(prev => page === 0 ? articlesData : [...prev, ...articlesData]);
            } catch (error) {
                console.error('Erreur lors du chargement des articles:', error);
                showNotification('Échec du chargement des articles', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [page, hasMore]);

    const showNotification = (message, type = 'success') => {
        console.log(`Notification: ${message} (${type})`);
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleOpenDeleteModal = (article) => {
        setConfirmDelete(article);
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;

        try {
            setIsDeleting(true);
            console.log(`Tentative de suppression de l'article avec l'ID: ${confirmDelete.id}`);

            // Supprimer l'article
            const { error } = await supabase
                .from('journal_articles_human')
                .delete()
                .eq('id', confirmDelete.id);

            if (error) {
                console.error('Erreur lors de la suppression:', error);
                throw error;
            }

            console.log(`Article avec l'ID ${confirmDelete.id} supprimé avec succès`);

            // Mettre à jour la liste des articles localement sans recharger tous les articles
            setArticles(prev => prev.filter(article => article.id !== confirmDelete.id));
            showNotification('Article supprimé avec succès');

        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            showNotification('Échec de la suppression', 'error');
        } finally {
            setIsDeleting(false);
            setConfirmDelete(null);
        }
    };

    // Charger plus d'articles
    const loadMoreArticles = () => {
        if (!isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Non catégorisé';
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Liste des articles</h1>

            {notification.show && (
                <div
                    className={`mb-4 p-4 rounded-md flex items-center ${notification.type === 'error'
                        ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
                        : 'bg-green-50 text-green-700 border-l-4 border-green-500'
                        }`}
                    style={{ animation: "slideIn 0.3s ease-out" }}
                >
                    {notification.type === 'error' ? (
                        <AlertCircle className="h-5 w-5 mr-2" />
                    ) : (
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    )}
                    {notification.message}
                </div>
            )}

            {isLoading && page === 0 ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : articles.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucun article trouvé</p>
            ) : (
                <div className="space-y-4">
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Titre
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Catégorie
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
                                {articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {article.featured_image && (
                                                    <div className="flex-shrink-0 h-10 w-10 mr-4">
                                                        <img className="h-10 w-10 rounded-md object-cover" src={article.featured_image} alt="" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{article.title || 'Sans titre'}</div>
                                                    <div className="text-sm text-gray-500">/{article.slug || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <TagIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-900">
                                                    {getCategoryName(article.category_id)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-900">
                                                    {formatDate(article.publish_date)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {article.is_published ? 'Publié' : 'Brouillon'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <a
                                                    href={`/admin/article/${article.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors duration-200"
                                                    title="Voir"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </a>
                                                <a
                                                    href={`/admin/articles/edit/${article.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                                                    title="Modifier"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleOpenDeleteModal(article)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors duration-200 group relative"
                                                    title="Supprimer"
                                                    disabled={isLoading}
                                                >
                                                    <Trash2 className="h-4 w-4 transform group-hover:scale-110 transition-transform duration-200" />
                                                    <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bouton "Charger plus" */}
                    {hasMore && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={loadMoreArticles}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200"
                            >
                                {isLoading ? 'Chargement...' : 'Charger plus d\'articles'}
                            </button>
                        </div>
                    )}

                    {/* Indicateur de chargement pour pagination */}
                    {isLoading && page > 0 && (
                        <div className="flex justify-center mt-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de confirmation de suppression amélioré */}
            <ConfirmationModal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
                articleTitle={confirmDelete?.title}
                isLoading={isDeleting}
            />

            {/* Styles pour les animations */}
            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
        </div>
    );
}