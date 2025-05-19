import React, { useState } from 'react';
import VideoCreationForm from './VideoCreationForm';
import ListeVideos from './ListeVideos';

const VideoManagement: React.FC = () => {
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
          Ajouter une vidéo
        </button>
        <button
          className={`mr-4 py-2 px-4 font-medium text-sm rounded-t-lg ${
            activeTab === 'liste' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('liste')}
        >
          Liste des vidéos
        </button>
      </div>

      {/* Affichage du composant actif */}
      {activeTab === 'creation' ? (
        <div className="creation-section mb-12">
          <VideoCreationForm />
        </div>
      ) : (
        <div className="list-section">
          <ListeVideos />
        </div>
      )}
    </div>
  );
};

export default VideoManagement;