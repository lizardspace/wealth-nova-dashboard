import { useState, useEffect } from 'react';
import { Save, Tag, Hash, Palette } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = 'https://xoxbpdkqvtulavbpfmgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGJwZGtxdnR1bGF2YnBmbWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0MjMsImV4cCI6MjA2MDMyNTQyM30.XVzmmTfjcMNDchCd7ed-jG3N8WoLuD3RyDZguyZh1EM';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function FormulaireCreationCategorie() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '#3b82f6' // Couleur bleue par défaut
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [existingCategories, setExistingCategories] = useState([]);

  // Récupérer les catégories existantes au montage du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('journal_categories')
          .select('id, name, color, slug')
          .order('name', { ascending: true });

        if (error) throw error;

        setExistingCategories(data || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Générer le slug à partir du nom
  useEffect(() => {
    const generatedSlug = formData.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    setFormData(prev => ({ ...prev, slug: generatedSlug }));
  }, [formData.name]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Options de couleurs communes
  const colorOptions = [
    { name: 'Bleu', value: '#3b82f6' },
    { name: 'Rouge', value: '#ef4444' },
    { name: 'Vert', value: '#10b981' },
    { name: 'Jaune', value: '#f59e0b' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Rose', value: '#ec4899' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Gris', value: '#6b7280' },
  ];

  const handleSubmit = async () => {
    // Validation de base
    if (!formData.name.trim()) {
      showNotification('Le nom de la catégorie est obligatoire', 'error');
      return;
    }

    // Vérification des doublons
    const nameExists = existingCategories.some(cat =>
      cat.name.toLowerCase() === formData.name.toLowerCase());
    const slugExists = existingCategories.some(cat =>
      cat.slug.toLowerCase() === formData.slug.toLowerCase());

    if (nameExists) {
      showNotification('Une catégorie avec ce nom existe déjà', 'error');
      return;
    }

    if (slugExists) {
      showNotification('Une catégorie avec ce slug existe déjà', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Enregistrement de la catégorie dans Supabase
      const { data, error } = await supabase
        .from('journal_categories')
        .insert([{
          name: formData.name,
          slug: formData.slug,
          color: formData.color
        }])
        .select();

      if (error) throw error;

      // Ajouter la nouvelle catégorie à la liste existante
      setExistingCategories(prev => [...prev, data[0]]);

      // Réinitialiser le formulaire après soumission réussie
      setFormData({
        name: '',
        slug: '',
        color: '#3b82f6'
      });

      showNotification('Catégorie créée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      showNotification(`Échec de la création de la catégorie: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Tag className="mr-2 text-blue-600" size={24} />
        <h1 className="text-xl font-bold text-gray-800">Ajouter une nouvelle catégorie</h1>
      </div>

      {notification.show && (
        <div className={`mb-4 p-3 rounded ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {notification.message}
        </div>
      )}

      <div className="space-y-4">
        {/* Nom */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la catégorie*
          </label>
          <div className="flex items-center">
            <Hash className="mr-2 text-gray-500" size={18} />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Technologie, Santé, Mode..."
            />
          </div>
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
            placeholder="nom-de-la-categorie"
          />
          <p className="text-xs text-gray-500 mt-1">
            Version adaptée pour les URLs. Généré automatiquement mais modifiable.
          </p>
        </div>

        {/* Couleur */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Couleur
          </label>
          <div className="flex items-center">
            <Palette className="mr-2 text-gray-500" size={18} />
            <input
              type="color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="h-10 w-16 p-0 border border-gray-300 rounded"
            />
            <div className="ml-2 flex flex-wrap gap-1">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className="w-6 h-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  aria-label={`Sélectionner la couleur ${color.name}`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cette couleur sera utilisée pour identifier la catégorie.
          </p>
        </div>

        {/* Aperçu */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Aperçu :</p>
          <div className="flex items-center">
            <span
              className="inline-block w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: formData.color }}
            />
            <span className="font-medium">{formData.name || 'Nom de la catégorie'}</span>
          </div>
        </div>

        {/* Catégories existantes */}
        {existingCategories.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Catégories existantes :</p>
            <div className="max-h-40 overflow-y-auto">
              {existingCategories.map((category, index) => (
                <div key={category.id || index} className="flex items-center py-1">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton de soumission */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Création en cours...</span>
            ) : (
              <>
                <Save className="mr-2" size={18} />
                <span>Ajouter la catégorie</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
