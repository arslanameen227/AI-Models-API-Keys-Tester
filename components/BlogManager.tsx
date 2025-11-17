import React, { useContext, useState } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { BlogPost } from '../types';
import { Plus, Trash2, Edit, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const BlogManager: React.FC = () => {
  const { settings, updateSettings } = useContext(SettingsContext);
  
  const handleRemovePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const updatedPosts = settings.blogPosts.filter(p => p.id !== id);
      updateSettings({ ...settings, blogPosts: updatedPosts });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Blog Posts</h3>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-brand-primary-light dark:bg-brand-primary-dark text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Add New Post
        </button>
      </div>

      <div className="space-y-3">
        {settings.blogPosts.length > 0 ? (
          settings.blogPosts.map(post => (
            <div key={post.id} className="bg-base-200-light dark:bg-base-300-dark p-4 rounded-lg flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group">
              <div>
                <p className="font-medium">{post.title}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                   <span>/{post.slug}</span>
                   <span className="flex items-center gap-1">
                     {post.status === 'published' ? <Eye className="h-3 w-3 text-success"/> : <EyeOff className="h-3 w-3 text-warning"/>}
                     {post.status}
                   </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-500 dark:text-gray-400 hover:text-brand-secondary-light dark:hover:text-brand-secondary-dark transition-colors">
                  <Edit className="h-5 w-5" />
                </button>
                <button onClick={() => handleRemovePost(post.id)} className="text-gray-500 dark:text-gray-400 hover:text-error transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-base-200-light/50 dark:bg-base-300-dark/50 p-6 rounded-lg text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <AlertTriangle className="mx-auto h-10 w-10 text-warning mb-3" />
            <p className="font-medium">No blog posts found.</p>
            <p className="text-sm text-gray-500">Click "Add New Post" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManager;