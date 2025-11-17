import React, { useContext, useState } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { BlogPost } from '../types';
import { Plus, Trash2, Edit, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import PostEditorModal from './PostEditorModal';

const BlogManager: React.FC = () => {
  const { blogPosts, deleteBlogPost } = useContext(SettingsContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  const handleOpenAddModal = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleRemovePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlogPost(id);
      } catch (error) {
        alert(`Failed to delete post: ${error}`);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Blog Posts</h3>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-brand-primary text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Add New Post
        </button>
      </div>

      <div className="space-y-3">
        {blogPosts.length > 0 ? (
          blogPosts.map(post => (
            <div key={post.id} className="bg-base-200 p-4 rounded-lg flex items-center justify-between hover:bg-base-300 transition-colors group">
              <div>
                <p className="font-medium text-base-content">{post.title}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                   <span>/{post.slug}</span>
                   <span className="flex items-center gap-1">
                     {post.status === 'published' ? <Eye className="h-3 w-3 text-success"/> : <EyeOff className="h-3 w-3 text-warning"/>}
                     {post.status}
                   </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEditModal(post)} className="text-gray-500 hover:text-brand-secondary transition-colors">
                  <Edit className="h-5 w-5" />
                </button>
                <button onClick={() => handleRemovePost(post.id)} className="text-gray-500 hover:text-error transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-base-200/50 p-6 rounded-lg text-center border-2 border-dashed border-base-300">
            <AlertTriangle className="mx-auto h-10 w-10 text-warning mb-3" />
            <p className="font-medium text-base-content">No blog posts found.</p>
            <p className="text-sm text-gray-500">Click "Add New Post" to get started.</p>
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <PostEditorModal 
            post={editingPost}
            onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BlogManager;