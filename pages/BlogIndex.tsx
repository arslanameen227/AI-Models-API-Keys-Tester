import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Calendar, User } from 'lucide-react';

const BlogIndex: React.FC = () => {
  // Fix: Destructure `blogPosts` directly from context, not from `settings`.
  const { blogPosts } = useContext(SettingsContext);
  
  // In a real app, you might want pagination. For now, just show published posts.
  const publishedPosts = blogPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Our Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
          Latest news, insights, and updates from the AI Framework team.
        </p>
      </div>

      <div className="space-y-10">
        {publishedPosts.length > 0 ? (
          publishedPosts.map(post => (
            <div key={post.id} className="bg-base-100-light dark:bg-base-200-dark p-6 rounded-xl border border-base-300-light dark:border-base-300-dark hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-bold mb-2">
                {/* In a real router, this would be a <Link> component */}
                <a href={`#blog:${post.slug}`} className="hover:text-brand-primary-light dark:hover:text-brand-primary-dark transition-colors">{post.title}</a>
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.publishedDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><User size={14} /> {post.author}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {post.seo.description}
              </p>
              <a href={`#blog:${post.slug}`} className="font-semibold text-brand-primary-light dark:text-brand-primary-dark hover:underline">
                Read more &rarr;
              </a>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No blog posts have been published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogIndex;