import { useState, useEffect } from 'react';
import { Save, Image, FileText, Calendar, Tag } from 'lucide-react';

export default function FormulaireCreationArticle() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: null,
    category_id: '',
    author: '',
    publish_date: new Date().toISOString().split('T')[0],
    is_published: false
  });
  
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Récupérer les catégories au chargement du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // À remplacer par votre appel API réel
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        showNotification('Échec du chargement des catégories', 'error');
      }
    };
    
    fetchCategories();
  }, []);

  // Générer le slug à partir du titre
  useEffect(() => {
    const generatedSlug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setFormData(prev => ({ ...prev, slug: generatedSlug }));
  }, [formData.title]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, featured_image: file }));
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Créer FormData pour l'upload de fichier
      const articleData = new FormData();
      
      // Ajouter tous les champs du formulaire
      Object.keys(formData).forEach(key => {
        if (key === 'featured_image' && formData[key]) {
          articleData.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          articleData.append(key, formData[key]);
        }
      });

      // À remplacer par votre appel API réel
      const response = await fetch('/api/articles', {
        method: 'POST',
        body: articleData,
      });

      if (!response.ok) {
        throw new Error('Échec de la création de l\'article');
      }

      // Réinitialiser le formulaire après soumission réussie
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: null,
        category_id: '',
        author: '',
        publish_date: new Date().toISOString().split('T')[0],
        is_published: false
      });
      setPreview(null);
      
      showNotification('Article créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      showNotification('Échec de la création de l\'article', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Créer un nouvel article</h1>
      
      {notification.show && (
        <div className={`mb-4 p-3 rounded ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {notification.message}
        </div>
      )}
      
      <div className="space-y-6">
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
            placeholder="Titre de l'article"
          />
        </div>
        
        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug*
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="titre-de-l-article"
          />
          <p className="text-xs text-gray-500 mt-1">
            Version adaptée pour les URLs. Généré automatiquement mais modifiable.
          </p>
        </div>
        
        {/* Auteur */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Auteur
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom de l'auteur"
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
        
        {/* Extrait */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Extrait
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Résumé court de l'article"
          />
        </div>
        
        {/* Contenu */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Contenu
          </label>
          <div className="flex items-center mb-2">
            <FileText className="mr-2 text-gray-500" size={20} />
            <span className="text-sm text-gray-500">Éditeur de texte enrichi</span>
          </div>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contenu de l'article"
          />
          <p className="text-xs text-gray-500 mt-1">
            Dans un environnement de production, ceci serait remplacé par un éditeur de texte enrichi.
          </p>
        </div>
        
        {/* Image à la une */}
        <div>
          <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-1">
            Image à la une
          </label>
          <div className="flex items-center mb-2">
            <Image className="mr-2 text-gray-500" size={20} />
            <input
              type="file"
              id="featured_image"
              name="featured_image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Aperçu :</p>
              <img 
                src={preview} 
                alt="Aperçu" 
                className="h-48 w-auto object-cover rounded-md" 
              />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Les images seront uploadées dans le bucket "article-images-human".
          </p>
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
        
        {/* Statut de publication */}
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
        
        {/* Bouton de soumission */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Enregistrement...</span>
            ) : (
              <>
                <Save className="mr-2" size={18} />
                <span>Enregistrer l'article</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}