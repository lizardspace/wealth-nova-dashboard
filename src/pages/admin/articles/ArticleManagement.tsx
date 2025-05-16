import React, { useState } from 'react';
import ArticleCreationForm from './ArticleCreationForm';
import ListeArticles from './ListeArticles';

const ArticleManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'creation' | 'liste'>('creation');
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Onglets de navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`mr-4 py-2 px-4 font-medium text-sm rounded-t-lg ${
            activeTab === 'creation' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('creation')}
        >
          Créer un article
        </button>
        <button
          className={`mr-4 py-2 px-4 font-medium text-sm rounded-t-lg ${
            activeTab === 'liste' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('liste')}
        >
          Liste des articles
        </button>
      </div>

      {/* Affichage du composant actif */}
      {activeTab === 'creation' ? (
        <div className="creation-section mb-12">
          <ArticleCreationForm />
        </div>
      ) : (
        <div className="list-section">
          <ListeArticles />
        </div>
      )}
    </div>
  );
};

export default ArticleManagement;