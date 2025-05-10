// src/components/routes/BlogRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ArticleCreationForm from '@/pages/admin/articles/ArticleCreationForm';
import CategoryCreationForm from '@/pages/admin/articles/CategoryCreationForm';

const BlogRoutes = () => {
  return (
    <Routes>
      <Route index element={<ArticleCreationForm />} />
      <Route path="nouveau" element={<ArticleCreationForm />} />
      <Route path="categories" element={<CategoryCreationForm />} />
      <Route path="commentaires" element={<div>Gestion des commentaires</div>} />
    </Routes>
  );
};

export default BlogRoutes;