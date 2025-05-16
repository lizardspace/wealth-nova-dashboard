import { useState, useEffect } from 'react';
import { Save, Image, FileText, Calendar, Tag, Bold, Italic, List, Code, Link } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { EditorState, RichUtils, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Initialisation du client Supabase
const supabaseUrl = 'https://xoxbpdkqvtulavbpfmgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGJwZGtxdnR1bGF2YnBmbWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0MjMsImV4cCI6MjA2MDMyNTQyM30.XVzmmTfjcMNDchCd7ed-jG3N8WoLuD3RyDZguyZh1EM';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function FormulaireCreationArticle() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '', // Contiendra le HTML généré depuis l'éditeur
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

  // Générer le slug à partir du titre
  useEffect(() => {
    const generatedSlug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setFormData(prev => ({ ...prev, slug: generatedSlug }));
  }, [formData.title]);

  // Mise à jour du champ content avec le HTML généré par Draft.js
  useEffect(() => {
    const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setFormData(prev => ({ ...prev, content: contentHtml }));
  }, [editorState]);

  // Charger du HTML existant dans l'éditeur (utile pour l'édition)
  const loadContentToEditor = (htmlContent) => {
    const contentBlock = htmlToDraft(htmlContent);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditorStateChange = (state) => {
    setEditorState(state);
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
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
      // Upload de l'image si elle existe
      let imageUrl = null;
      if (formData.featured_image) {
        const fileExt = formData.featured_image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `article-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('article-images-human')
          .upload(filePath, formData.featured_image);

        if (uploadError) throw uploadError;

        // Récupérer l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('article-images-human')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      // Enregistrement de l'article dans Supabase
      const { data, error } = await supabase
        .from('journal_articles_human')
        .insert([{
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content, // HTML généré par Draft.js
          featured_image: imageUrl,
          category_id: formData.category_id || null,
          author: formData.author || null,
          publish_date: formData.publish_date,
          is_published: formData.is_published
        }])
        .select();

      if (error) throw error;

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
      setEditorState(EditorState.createEmpty());
      setPreview(null);
      
      showNotification('Article créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      showNotification(`Échec de la création de l'article: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration de la barre d'outils de l'éditeur
  const toolbarOptions = {
    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'history'],
    inline: {
      options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
    },
    blockType: {
      options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
    },
    list: {
      options: ['unordered', 'ordered'],
    },
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
        
        {/* Contenu avec Draft.js */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Contenu
          </label>
          <div className="flex items-center mb-2">
            <FileText className="mr-2 text-gray-500" size={20} />
            <span className="text-sm text-gray-500">Éditeur de texte enrichi</span>
          </div>
          <div className="border border-gray-300 rounded-md">
            <Editor
              editorState={editorState}
              onEditorStateChange={handleEditorStateChange}
              handleKeyCommand={handleKeyCommand}
              toolbar={toolbarOptions}
              wrapperClassName="w-full"
              editorClassName="px-4 py-2 min-h-[300px]"
              placeholder="Contenu de l'article"
            />
          </div>
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
        
        {/* Aperçu du HTML généré (pour débogage, peut être supprimé en production) */}
        <div className="border-t pt-4">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-gray-700">Aperçu du HTML généré</summary>
            <div className="mt-2 p-3 bg-gray-50 rounded overflow-auto max-h-40">
              <pre className="text-xs">{formData.content}</pre>
            </div>
          </details>
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