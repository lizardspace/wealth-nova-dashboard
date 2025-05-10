// src/components/routes/BlogRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ArticleCreationForm from '@/pages/admin/articles/ArticleCreationForm';

const BlogRoutes = () => {
  return (
    <Routes>
      <Route index element={<ArticleCreationForm />} />
      <Route path="nouveau" element={<ArticleCreationForm />} />
      <Route path="categories" element={<div>Gestion des catégories</div>} />
      <Route path="commentaires" element={<div>Gestion des commentaires</div>} />
    </Routes>
  );
};

export default BlogRoutes;