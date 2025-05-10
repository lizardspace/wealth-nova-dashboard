import { useState, useEffect } from 'react';
import { Save, Tag, Hash, Palette } from 'lucide-react';

export default function CategoryCreationForm() {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '#3b82f6' // Default blue color
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [existingCategories, setExistingCategories] = useState([]);

  // Fetch existing categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // This would be replaced with your actual API call
        const response = await fetch('/api/categories');
        const data = await response.json();
        setExistingCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Generate slug from name
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

  // Common color options
  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Gray', value: '#6b7280' },
  ];

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim()) {
      showNotification('Category name is required', 'error');
      return;
    }
    
    // Check for duplicate names or slugs
    const nameExists = existingCategories.some(cat => 
      cat.name.toLowerCase() === formData.name.toLowerCase());
    const slugExists = existingCategories.some(cat => 
      cat.slug.toLowerCase() === formData.slug.toLowerCase());
    
    if (nameExists) {
      showNotification('A category with this name already exists', 'error');
      return;
    }
    
    if (slugExists) {
      showNotification('A category with this slug already exists', 'error');
      return;
    }
    
    setIsLoading(true);

    try {
      // This would be replaced with your actual API call
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      // Add new category to the existing categories list
      const newCategory = await response.json();
      setExistingCategories(prev => [...prev, newCategory]);

      // Reset form after successful submission
      setFormData({
        name: '',
        slug: '',
        color: '#3b82f6'
      });
      
      showNotification('Category created successfully!');
    } catch (error) {
      console.error('Error creating category:', error);
      showNotification('Failed to create category', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Tag className="mr-2 text-blue-600" size={24} />
        <h1 className="text-xl font-bold text-gray-800">Add New Category</h1>
      </div>
      
      {notification.show && (
        <div className={`mb-4 p-3 rounded ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {notification.message}
        </div>
      )}
      
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name*
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
              placeholder="Technology, Health, Fashion..."
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
            placeholder="category-slug"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL-friendly version of the name. Generated automatically but can be edited.
          </p>
        </div>
        
        {/* Color */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Color
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
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This color will be used to identify the category.
          </p>
        </div>

        {/* Preview */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="flex items-center">
            <span 
              className="inline-block w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: formData.color }}
            />
            <span className="font-medium">{formData.name || 'Category Name'}</span>
          </div>
        </div>
        
        {/* Existing Categories */}
        {existingCategories.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Existing Categories:</p>
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
        
        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Adding...</span>
            ) : (
              <>
                <Save className="mr-2" size={18} />
                <span>Add Category</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}