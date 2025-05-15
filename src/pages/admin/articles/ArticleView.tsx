import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Loader2, ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Initialisation du client Supabase
const supabaseUrl = 'https://xoxbpdkqvtulavbpfmgu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGJwZGtxdnR1bGF2YnBmbWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDk0MjMsImV4cCI6MjA2MDMyNTQyM30.XVzmmTfjcMNDchCd7ed-jG3N8WoLuD3RyDZguyZh1EM';
const supabase = createClient(supabaseUrl, supabaseKey);

const ArticleView = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const { data: articleData, error: articleError } = await supabase
                    .from('journal_articles_human')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (articleError) throw articleError;

                const { data: categoryData, error: categoryError } = await supabase
                    .from('journal_categories')
                    .select('name')
                    .eq('id', articleData.category_id)
                    .single();

                if (categoryError) throw categoryError;

                const data = {
                    ...articleData,
                    journal_categories: categoryData
                };

                if (!data) {
                    throw new Error('Article non trouvé');
                }

                setArticle(data);
            } catch (err) {
                console.error('Erreur lors du chargement de l\'article:', err);
                setError(err.message);
                toast.error('Erreur lors du chargement de l\'article');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        } catch (error) {
            console.error('Erreur de formatage de date:', error);
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <p className="text-gray-500">Article non trouvé</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <Toaster position="top-center" />

            <button
                onClick={() => window.history.back()}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour
            </button>

            <article className="prose prose-lg max-w-none">
                {article.featured_image && (
                    <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-auto rounded-lg mb-8 object-cover max-h-96"
                    />
                )}

                <header className="mb-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <div className="flex items-center mr-4">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(article.publish_date)}</span>
                        </div>
                        {article.journal_categories && (
                            <div className="flex items-center">
                                <Tag className="h-4 w-4 mr-1" />
                                <span>{article.journal_categories.name}</span>
                            </div>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {article.title}
                    </h1>

                    {article.excerpt && (
                        <p className="text-lg text-gray-600 mb-6">
                            {article.excerpt}
                        </p>
                    )}
                </header>

                <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>
        </div>
    );
};

export default ArticleView;