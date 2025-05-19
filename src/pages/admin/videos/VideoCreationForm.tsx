import { useState, useEffect } from 'react';
import { Save, Calendar, Tag, Link as LinkIcon, Youtube } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = 'https://xoxbpdkqvtulavbpfmgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGJwZGtxdnR1bGF2YnBmbWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0MjMsImV4cCI6MjA2MDMyNTQyM30.XVzmmTfjcMNDchCd7ed-jG3N8WoLuD3RyDZguyZh1EM';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function VideoCreationForm() {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    youtube_id: '',
    youtube_url: '',
    category_id: '',
    duration_seconds: 0,
    publish_date: new Date().toISOString().split('T')[0],
    is_featured: false,
    is_published: true
  });
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Récupérer les catégories depuis Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('journal_categories')
          .select('id, name, color, slug')
          .order('name', { ascending: true });

        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        showNotification('Échec du chargement des catégories', 'error');
      }
    };
    
    fetchCategories();
  }, []);

  // Extraire l'ID YouTube depuis l'URL
  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Si l'URL YouTube change, extraire l'ID
    if (name === 'youtube_url') {
      const youtubeId = extractYoutubeId(value);
      if (youtubeId) {
        setFormData(prev => ({
          ...prev,
          youtube_id: youtubeId,
          thumbnail_url: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
        }));
      }
    }
  };

  const showNotification = (message: string, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation de l'ID YouTube
      if (!formData.youtube_id) {
        throw new Error('URL YouTube invalide');
      }

      // Enregistrement de la vidéo dans Supabase
      const { data, error } = await supabase
        .from('journal_videos')
        .insert([{
          title: formData.title,
          excerpt: formData.excerpt,
          youtube_id: formData.youtube_id,
          youtube_url: formData.youtube_url,
          category_id: formData.category_id || null,
          duration_seconds: formData.duration_seconds,
          publish_date: formData.publish_date,
          thumbnail_url: `https://i.ytimg.com/vi/${formData.youtube_id}/hqdefault.jpg`,
          is_featured: formData.is_featured,
          is_published: formData.is_published
        }])
        .select();

      if (error) throw error;

      // Réinitialiser le formulaire après soumission réussie
      setFormData({
        title: '',
        excerpt: '',
        youtube_id: '',
        youtube_url: '',
        category_id: '',
        duration_seconds: 0,
        publish_date: new Date().toISOString().split('T')[0],
        is_featured: false,
        is_published: true
      });
      
      showNotification('Vidéo enregistrée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de la vidéo:', error);
      showNotification(`Échec de l'enregistrement: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Ajouter une nouvelle vidéo</h1>
      
      {notification.show && (
        <div className={`mb-4 p-3 rounded ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {notification.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Titre de la vidéo"
          />
        </div>
        
        {/* URL YouTube */}
        <div>
          <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-1">
            URL YouTube*
          </label>
          <div className="flex items-center">
            <Youtube className="mr-2 text-red-500" size={20} />
            <input
              type="url"
              id="youtube_url"
              name="youtube_url"
              value={formData.youtube_url}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          {formData.youtube_id && (
            <p className="text-xs text-gray-500 mt-1">
              ID YouTube détecté: {formData.youtube_id}
            </p>
          )}
        </div>
        
        {/* Aperçu de la vidéo */}
        {formData.youtube_id && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aperçu
            </label>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-64 rounded-md"
                src={`https://www.youtube.com/embed/${formData.youtube_id}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        
        {/* Extrait */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Description courte
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Description de la vidéo"
          />
        </div>
        
        {/* Catégorie */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <div className="flex items-center">
            <Tag className="mr-2 text-gray-500" size={20} />
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Durée */}
        <div>
          <label htmlFor="duration_seconds" className="block text-sm font-medium text-gray-700 mb-1">
            Durée (secondes)
          </label>
          <input
            type="number"
            id="duration_seconds"
            name="duration_seconds"
            value={formData.duration_seconds}
            onChange={handleInputChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Date de publication */}
        <div>
          <label htmlFor="publish_date" className="block text-sm font-medium text-gray-700 mb-1">
            Date de publication
          </label>
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-500" size={20} />
            <input
              type="date"
              id="publish_date"
              name="publish_date"
              value={formData.publish_date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
              Mettre en avant
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_published"
              name="is_published"
              checked={formData.is_published}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
              Publier immédiatement
            </label>
          </div>
        </div>
        
        {/* Bouton de soumission */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Enregistrement...</span>
            ) : (
              <>
                <Save className="mr-2" size={18} />
                <span>Enregistrer la vidéo</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}