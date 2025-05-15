// src/components/routes/BlogRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ArticleManagement from '@/pages/admin/articles/ArticleManagement';
import CategoryCreationForm from '@/pages/admin/articles/CategoryCreationForm';
import ArticleCreationForm from '@/pages/admin/articles/ArticleCreationForm';

const BlogRoutes = () => {
  return (
    <Routes>
      <Route index element={<ArticleCreationForm />} />
      <Route path="nouveau" element={<ArticleManagement />} />
      <Route path="categories" element={<CategoryCreationForm />} />
      <Route path="commentaires" element={<div>Gestion des commentaires</div>} />
    </Routes>
  );
};

export default BlogRoutes;