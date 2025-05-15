import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Save, ArrowLeft, Calendar, Trash2, Image as ImageIcon, Tag as TagIcon, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Import dynamique de l'éditeur pour éviter les erreurs côté serveur
const Editor = dynamic(() => import('../components/Editor'), { ssr: false });

// Initialisation du client Supabase
const supabaseUrl = 'https://xoxbpdkqvtulavbpfmgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGJwZGtxdnR1bGF2YnBmbWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0MjMsImV4cCI6MjA2MDMyNTQyM30.XVzmmTfjcMNDchCd7ed-jG3N8WoLuD3RyDZguyZh1EM';
const supabase = createClient(supabaseUrl, supabaseKey);

const ModifierArticle = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [article, setArticle] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    publish_date: new Date().toISOString().split('T')[0],
    is_published: false,
    category_id: null
  });
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [contentChanged, setContentChanged] = useState(false);
  
  // Récupérer les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('journal_categories')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        showNotification('Échec du chargement des catégories', 'error');
      }
    };
    
    fetchCategories();
  }, []);
  
  // Récupérer les données de l'article lorsque l'ID est disponible
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        console.log(`Chargement de l'article avec l'ID: ${id}...`);
        
        const { data, error } = await supabase
          .from('journal_articles_human')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setArticle(data);
          setImagePreview(data.featured_image || '');
          console.log('Article chargé avec succès:', data);
        } else {
          showNotification('Article non trouvé', 'error');
          router.push('/admin/articles');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error);
        showNotification('Erreur lors du chargement de l\'article', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, router]);
  
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setArticle(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setContentChanged(true);
  };
  
  const handleEditorChange = (content) => {
    setArticle(prev => ({ ...prev, content }));
    setContentChanged(true);
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Vérifier le type et la taille du fichier
      if (!file.type.startsWith('image/')) {
        showNotification('Veuillez sélectionner une image', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        showNotification('L\'image est trop volumineuse (max 5MB)', 'error');
        return;
      }
      
      // Créer un aperçu local
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `journal_images/${fileName}`;
      
      // Télécharger l'image vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Obtenir l'URL publique de l'image
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      setArticle(prev => ({ ...prev, featured_image: publicUrl }));
      setContentChanged(true);
      showNotification('Image téléchargée avec succès');
      
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      showNotification('Échec du téléchargement de l\'image', 'error');
    }
  };
  
  const generateSlug = () => {
    const slug = article.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
      
    setArticle(prev => ({ ...prev, slug }));
  };
  
  const handleSave = async () => {
    if (!article.title) {
      showNotification('Le titre est requis', 'error');
      return;
    }
    
    if (!article.slug) {
      generateSlug();
    }
    
    try {
      setIsSaving(true);
      console.log('Sauvegarde de l\'article...');
      
      const { error } = await supabase
        .from('journal_articles_human')
        .update({
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          featured_image: article.featured_image,
          publish_date: article.publish_date,
          is_published: article.is_published,
          category_id: article.category_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      showNotification('Article sauvegardé avec succès');
      setContentChanged(false);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showNotification('Échec de la sauvegarde', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Avertissement avant de quitter la page si des modifications non sauvegardées
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (contentChanged) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [contentChanged]);
  
  // Confirmation avant de naviguer si des modifications non sauvegardées
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (contentChanged && !window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter cette page?')) {
        router.events.emit('routeChangeError');
        throw 'Navigation annulée';  // Annule la navigation
      }
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [contentChanged, router]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Notification */}
      {notification.show && (
        <div 
          className={`mb-4 p-4 rounded-md flex items-center ${
            notification.type === 'error' 
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
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => router.push('/admin/articles')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'article</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
              contentChanged 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-600'
            } transition-colors duration-200`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Sauvegarde...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Sauvegarder</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale - Éditeur */}
        <div className="lg:col-span-2 space-y-6">
          {/* Titre */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={article.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Titre de l'article"
            />
          </div>
          
          {/* Slug */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug (URL)
              </label>
              <button
                type="button"
                onClick={generateSlug}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Générer depuis le titre
              </button>
            </div>
            <input
              type="text"
              id="slug"
              name="slug"
              value={article.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="slug-de-l-article"
            />
          </div>
          
          {/* Extrait */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Extrait / Résumé
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={article.excerpt || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brève description de l'article"
            ></textarea>
          </div>
          
          {/* Éditeur de contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenu
            </label>
            <div className="border border-gray-300 rounded-md">
              <Editor 
                initialValue={article.content} 
                onChange={handleEditorChange} 
              />
            </div>
          </div>
        </div>
        
        {/* Colonne latérale - Paramètres */}
        <div className="space-y-6">
          {/* Statut de publication */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">État de publication</h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={article.is_published}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
                Publier cet article
              </label>
            </div>
            
            <div className="mb-4">
              <label htmlFor="publish_date" className="block text-sm font-medium text-gray-700 mb-1">
                Date de publication
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="publish_date"
                  name="publish_date"
                  value={article.publish_date ? article.publish_date.substring(0, 10) : ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
          
          {/* Catégorie */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="mb-4 flex items-center">
              <TagIcon className="h-5 w-5 mr-2 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-800">Catégorie</h3>
            </div>
            <select
              id="category_id"
              name="category_id"
              value={article.category_id || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Sans catégorie --</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Image mise en avant */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="mb-4 flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-800">Image mise en avant</h3>
            </div>
            
            {imagePreview ? (
              <div className="relative mb-4">
                <img 
                  src={imagePreview} 
                  alt="Aperçu" 
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setArticle(prev => ({ ...prev, featured_image: '' }));
                    setContentChanged(true);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mb-4 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">Aucune image sélectionnée</p>
              </div>
            )}
            
            <label className="block">
              <span className="sr-only">Choisir une image</span>
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </label>
            <p className="mt-2 text-xs text-gray-500">JPG, PNG ou GIF. 5MB maximum.</p>
          </div>
          
          {/* Informations sur l'article */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Informations</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><span className="font-medium">ID:</span> {article.id}</p>
              <p><span className="font-medium">Créé le:</span> {new Date(article.created_at).toLocaleDateString('fr-FR')}</p>
              <p>
                <span className="font-medium">Modifié le:</span> {article.updated_at ? new Date(article.updated_at).toLocaleDateString('fr-FR') : 'Jamais'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Styles pour les animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ModifierArticle;