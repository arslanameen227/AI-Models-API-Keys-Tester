import React, { useEffect } from 'react';
import { BlogPost as BlogPostType } from '../types';
import { Calendar, User } from 'lucide-react';

// A simple markdown to HTML converter
const renderMarkdown = (markdown: string) => {
    // This is a very basic implementation. A real app would use a library like 'marked' or 'react-markdown'.
    return markdown
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 list-disc">$1</li>')
        .split('\n').map(line => line.startsWith('<li') ? line : `<p class="mb-4">${line}</p>`).join('');
};


interface BlogPostProps {
  post: BlogPostType;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {

  // Update document head for SEO
  useEffect(() => {
    document.title = post.seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', post.seo.description);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = post.seo.description;
      document.head.appendChild(newMeta);
    }
  }, [post]);

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{post.title}</h1>
        <div className="flex justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.publishedDate).toLocaleDateString()}</span>
          <span className="flex items-center gap-2"><User size={14} /> By {post.author}</span>
        </div>
      </header>
      
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />
    </article>
  );
};

export default BlogPost;