import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Save, ArrowLeft, Calendar, Trash2, Image as ImageIcon, Tag as TagIcon, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const supabaseUrl = 'https://xoxbpdkqvtulavbpfmgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGJwZGtxdnR1bGF2YnBmbWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0MjMsImV4cCI6MjA2MDMyNTQyM30.XVzmmTfjcMNDchCd7ed-jG3N8WoLuD3RyDZguyZh1EM';
const supabase = createClient(supabaseUrl, supabaseKey);

const ModifierArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [article, setArticle] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    publish_date: new Date().toISOString().split('T')[0],
    is_published: false,
    category_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [contentChanged, setContentChanged] = useState(false);

  // Convert HTML content to EditorState
  const htmlToEditorState = (html: string) => {
    if (!html) return EditorState.createEmpty();
    
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  };

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
        console.error('Error loading categories:', error);
        showNotification('Failed to load categories', 'error');
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('journal_articles_human')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setArticle(data);
          setImagePreview(data.featured_image || '');
          setEditorState(htmlToEditorState(data.content));
        } else {
          showNotification('Article not found', 'error');
          navigate('/admin/articles');
        }
      } catch (error) {
        console.error('Error loading article:', error);
        showNotification('Error loading article', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [id, navigate]);

  const showNotification = (message: string, type: string = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setArticle(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setContentChanged(true);
  };

  const handleEditorChange = (editorState: EditorState) => {
    setEditorState(editorState);
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setArticle(prev => ({ ...prev, content }));
    setContentChanged(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Image is too large (max 5MB)', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `journal_images/${fileName}`;
      
      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file);
        
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      setArticle(prev => ({ ...prev, featured_image: publicUrl }));
      setContentChanged(true);
      showNotification('Image uploaded successfully');
      
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('Failed to upload image', 'error');
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
    setContentChanged(true);
  };

  const handleSave = async () => {
    if (!article.title) {
      showNotification('Title is required', 'error');
      return;
    }
    
    if (!article.slug) generateSlug();
    
    try {
      setIsSaving(true);
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
      
      showNotification('Article saved successfully');
      setContentChanged(false);
      navigate('/admin/articles');
      
    } catch (error) {
      console.error('Error saving article:', error);
      showNotification('Failed to save article', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (contentChanged) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [contentChanged]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {notification.show && (
        <div className={`mb-4 p-4 rounded-md flex items-center ${
          notification.type === 'error' 
            ? 'bg-red-50 text-red-700 border-l-4 border-red-500' 
            : 'bg-green-50 text-green-700 border-l-4 border-green-500'
        }`}>
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

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/admin/articles')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Article</h1>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
            contentChanged 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-600'
          }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={article.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Article title"
            />
          </div>
          
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
                Generate from title
              </button>
            </div>
            <input
              type="text"
              id="slug"
              name="slug"
              value={article.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="article-slug"
            />
          </div>
          
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt/Summary
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={article.excerpt || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief article description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <div className="border border-gray-300 rounded-md min-h-[400px]">
              <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                toolbar={{
                  options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'image', 'remove', 'history'],
                  inline: { 
                    options: ['bold', 'italic', 'underline', 'strikethrough'],
                    bold: { className: 'custom-bold-class' },
                    italic: { className: 'custom-italic-class' },
                  },
                  blockType: {
                    options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
                  },
                  list: { 
                    options: ['unordered', 'ordered'],
                    unordered: { className: 'custom-ul-class' },
                    ordered: { className: 'custom-ol-class' },
                  },
                  textAlign: { 
                    options: ['left', 'center', 'right'],
                    left: { className: 'custom-align-left' },
                    center: { className: 'custom-align-center' },
                    right: { className: 'custom-align-right' },
                  },
                  link: { 
                    options: ['link'],
                    link: { className: 'custom-link-class' },
                  },
                  image: {
                    uploadEnabled: true,
                    uploadCallback: async (file) => {
                      try {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                        const filePath = `journal_images/${fileName}`;
                        
                        const { error } = await supabase.storage
                          .from('images')
                          .upload(filePath, file);
                          
                        if (error) throw error;
                        
                        const { data: { publicUrl } } = supabase.storage
                          .from('images')
                          .getPublicUrl(filePath);
                        
                        return { data: { link: publicUrl } };
                      } catch (error) {
                        console.error('Error uploading image:', error);
                        showNotification('Failed to upload image', 'error');
                        return { data: { link: '' } };
                      }
                    },
                    inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                    alt: { present: true, mandatory: false },
                    defaultSize: { height: 'auto', width: '100%' }
                  }
                }}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class px-4"
                toolbarClassName="toolbar-class border-t-0 border-l-0 border-r-0 bg-gray-50"
                placeholder="Write your content here..."
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Publication Status</h3>
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
                Publish this article
              </label>
            </div>
            
            <div className="mb-4">
              <label htmlFor="publish_date" className="block text-sm font-medium text-gray-700 mb-1">
                Publication Date
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
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="mb-4 flex items-center">
              <TagIcon className="h-5 w-5 mr-2 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-800">Category</h3>
            </div>
            <select
              id="category_id"
              name="category_id"
              value={article.category_id || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- No category --</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="mb-4 flex items-center">
              <ImageIcon className="h-5 w-5 mr-2 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-800">Featured Image</h3>
            </div>
            
            {imagePreview ? (
              <div className="relative mb-4">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setArticle(prev => ({ ...prev, featured_image: '' }));
                    setContentChanged(true);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mb-4 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">No image selected</p>
              </div>
            )}
            
            <label className="block">
              <span className="sr-only">Choose image</span>
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
            <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Information</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><span className="font-medium">ID:</span> {article.id}</p>
              <p><span className="font-medium">Created:</span> {new Date(article.created_at).toLocaleDateString()}</p>
              <p>
                <span className="font-medium">Updated:</span> {article.updated_at ? new Date(article.updated_at).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifierArticle;