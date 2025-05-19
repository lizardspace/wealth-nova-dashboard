import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ArticleManagement from '@/pages/admin/articles/ArticleManagement';
import CategoryCreationForm from '@/pages/admin/articles/CategoryCreationForm';
import ArticleCreationForm from '@/pages/admin/articles/ArticleCreationForm';
import ModifierArticle from '@/pages/admin/articles/ModifierArticle';
import VideoManagement from '@/pages/admin/videos/VideoManagement';
import VideoCreationForm from '@/pages/admin/videos/VideoCreationForm';
import ModifierVideo from '@/pages/admin/videos/ModifierVideo';

const BlogRoutes = () => {
  return (
    <Routes>
      {/* Routes pour les articles */}
      <Route index element={<ArticleManagement />} />
      <Route path="nouveau" element={<ArticleManagement />} />
      <Route path="edit/:id" element={<ModifierArticle />} />
      <Route path="categories" element={<CategoryCreationForm />} />
      <Route path="commentaires" element={<div>Gestion des commentaires</div>} />

      {/* Routes pour les vidéos */}
      <Route path="videos" element={<VideoManagement />} />
      <Route path="videos/nouveau" element={<VideoCreationForm />} />
      <Route path="videos/edit/:id" element={<ModifierVideo />} />
    </Routes>
  );
};

export default BlogRoutes;