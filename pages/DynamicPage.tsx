import React, { useEffect } from 'react';
import { Page as PageType } from '../types';

// A simple markdown to HTML converter
const renderMarkdown = (markdown: string) => {
    return markdown
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 list-disc">$1</li>')
        .split('\n').map(line => line.startsWith('<li') ? line : `<p class="mb-4">${line}</p>`).join('');
};

interface DynamicPageProps {
  page: PageType;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ page }) => {

  // Update document head for SEO
  useEffect(() => {
    document.title = page.seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', page.seo.description);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = page.seo.description;
      document.head.appendChild(newMeta);
    }
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 pb-4 border-b border-base-300-light dark:border-base-300-dark">
        <h1 className="text-4xl font-bold">{page.title}</h1>
      </header>

      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }}
      />
    </div>
  );
};

export default DynamicPage;