// src/pages/admin/articles/ArticleManagement.tsx

import React, { useState } from 'react';
import ArticleCreationForm from './ArticleCreationForm';
import ListeArticles from './ListeArticles';

const ArticleManagement: React.FC = () => {

  return (
    <div className="article-management">      
      <div className="creation-section">
        <ArticleCreationForm  />
      </div>
      
      <div className="list-section">
        <ListeArticles />
      </div>
    </div>
  );
};

export default ArticleManagement;