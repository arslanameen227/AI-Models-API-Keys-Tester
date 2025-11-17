import React, { useContext, useState } from 'react';
import { SeoMeta } from '../types';
import { Sparkles, Loader } from 'lucide-react';
import { AiServiceContext } from '../context/AiServiceContext';
import { generateSeoMeta } from '../services/aiService';

interface SeoManagerProps {
  seo: SeoMeta;
  onSeoChange: (newSeo: SeoMeta) => void;
  content: string; // The page or blog post content to base SEO on
}

const SeoManager: React.FC<SeoManagerProps> = ({ seo, onSeoChange, content }) => {
  const { apiKey } = useContext(AiServiceContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSeo = async () => {
    if (!apiKey) {
      setError('An active API key is required to generate SEO data.');
      return;
    }
    if (!content) {
        setError('Content is required to generate SEO data.');
        return;
    }

    setIsLoading(true);
    setError('');

    const response = await generateSeoMeta(apiKey, content);
    if (response.success && response.data) {
      onSeoChange({ title: response.data.title, description: response.data.description });
    } else {
      setError(response.error || 'Failed to generate SEO data.');
    }
    setIsLoading(false);
  };
  
  return (
    <div className="space-y-4 p-4 border-t border-base-300-light dark:border-base-300-dark">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg">SEO Settings</h4>
        <button
          onClick={handleGenerateSeo}
          disabled={isLoading || !apiKey}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? <Loader className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          Generate with AI
        </button>
      </div>
      
      {error && <p className="text-sm text-error">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Meta Title</label>
        <input
          type="text"
          value={seo.title}
          onChange={(e) => onSeoChange({ ...seo, title: e.target.value })}
          className="w-full p-2 bg-base-200-light dark:bg-base-300-dark rounded-md border border-gray-300 dark:border-gray-600"
          maxLength={60}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{seo.title.length}/60</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">Meta Description</label>
        <textarea
          value={seo.description}
          onChange={(e) => onSeoChange({ ...seo, description: e.target.value })}
          rows={3}
          className="w-full p-2 bg-base-200-light dark:bg-base-300-dark rounded-md border border-gray-300 dark:border-gray-600"
          maxLength={160}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{seo.description.length}/160</p>
      </div>
    </div>
  );
};

export default SeoManager;