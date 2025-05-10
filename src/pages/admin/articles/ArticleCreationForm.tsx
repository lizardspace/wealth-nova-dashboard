import { useState, useEffect } from 'react';
import { Save, Image, FileText, Calendar, Tag } from 'lucide-react';

export default function ArticleCreationForm() {
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

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // This would be replaced with your actual API call
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        showNotification('Failed to load categories', 'error');
      }
    };
    
    fetchCategories();
  }, []);

  // Generate slug from title
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
      
      // Create preview
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
      // Create FormData for file upload
      const articleData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'featured_image' && formData[key]) {
          articleData.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          articleData.append(key, formData[key]);
        }
      });

      // This would be replaced with your actual API call
      const response = await fetch('/api/articles', {
        method: 'POST',
        body: articleData,
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

      // Reset form after successful submission
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
      
      showNotification('Article created successfully!');
    } catch (error) {
      console.error('Error creating article:', error);
      showNotification('Failed to create article', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Article</h1>
      
      {notification.show && (
        <div className={`mb-4 p-3 rounded ${notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {notification.message}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Article title"
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
            placeholder="article-slug"
          />
          <p className="text-xs text-gray-500 mt-1">
            URL-friendly version of the title. Generated automatically but can be edited.
          </p>
        </div>
        
        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Author name"
          />
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
            Category
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
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief summary of the article"
          />
        </div>
        
        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <div className="flex items-center mb-2">
            <FileText className="mr-2 text-gray-500" size={20} />
            <span className="text-sm text-gray-500">Rich text editor</span>
          </div>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Article content"
          />
          <p className="text-xs text-gray-500 mt-1">
            In a production environment, this would be replaced with a rich text editor.
          </p>
        </div>
        
        {/* Featured Image */}
        <div>
          <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
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
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <img 
                src={preview} 
                alt="Preview" 
                className="h-48 w-auto object-cover rounded-md" 
              />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Images will be uploaded to the "article-images-human" bucket.
          </p>
        </div>
        
        {/* Publish Date */}
        <div>
          <label htmlFor="publish_date" className="block text-sm font-medium text-gray-700 mb-1">
            Publish Date
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
        
        {/* Publication Status */}
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
            Publish immediately
          </label>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="mr-2" size={18} />
                <span>Save Article</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}