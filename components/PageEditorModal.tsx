import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { Page, SeoMeta } from '../types';
import { X, Save, Sparkles, Loader, Image } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';
import { AiServiceContext } from '../context/AiServiceContext';
import { generateText } from '../services/aiService';
import SeoManager from './SeoManager';
import FilePickerModal from './FilePickerModal';

interface PageEditorModalProps {
  page: Page | null;
  onClose: () => void;
}

const PageEditorModal: React.FC<PageEditorModalProps> = ({ page, onClose }) => {
  const isEditing = page !== null;
  const { addPage, updatePage } = useContext(SettingsContext);
  const { apiKey } = useContext(AiServiceContext);

  const [formData, setFormData] = useState<Omit<Page, 'id'>>({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    status: page?.status || 'draft',
    seo: page?.seo || { title: '', description: '' },
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFilePickerOpen, setFilePickerOpen] = useState(false);
  
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: slugify(newTitle),
    }));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSeoChange = (newSeo: SeoMeta) => {
    setFormData(prev => ({ ...prev, seo: newSeo }));
  };
  
  const handleGenerateContent = async () => {
      if (!apiKey || !formData.title) return;
      setIsGenerating(true);
      const prompt = `Write the content for a webpage titled "${formData.title}". Use Markdown for formatting.`;
      const res = await generateText(apiKey, prompt);
      if (res.success && res.text) {
          setFormData(prev => ({...prev, content: res.text}));
      }
      setIsGenerating(false);
  };
  
  const insertImage = (url: string, name: string) => {
    const markdownImage = `\n![${name}](${url})\n`;
    setFormData(prev => ({ ...prev, content: prev.content + markdownImage }));
    setFilePickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && page) {
      await updatePage({ ...formData, id: page.id });
    } else {
      await addPage(formData);
    }
    onClose();
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-base-100-light dark:bg-base-200-dark w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl border border-base-300-light dark:border-base-300-dark flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-base-300-light dark:border-base-300-dark">
          <h2 className="text-xl font-bold">{isEditing ? 'Edit Page' : 'Add New Page'}</h2>
          <button onClick={onClose}><X /></button>
        </header>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input name="title" value={formData.title} onChange={handleTitleChange} className="w-full p-2 bg-base-200-light dark:bg-base-300-dark rounded-md border border-gray-300 dark:border-gray-600" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2 bg-base-300-light dark:bg-base-200-dark rounded-md border border-gray-300 dark:border-gray-600" />
            </div>

            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium">Content (Markdown)</label>
                 <div className="flex gap-2">
                    <button type="button" onClick={() => setFilePickerOpen(true)} className="flex items-center gap-1.5 px-2 py-1 bg-gray-500 text-white rounded-md text-xs hover:bg-gray-600">
                      <Image size={14}/> Add Media
                    </button>
                    <button type="button" onClick={handleGenerateContent} disabled={!apiKey || !formData.title || isGenerating} className="flex items-center gap-1.5 px-2 py-1 bg-amber-500 text-white rounded-md text-xs disabled:bg-gray-400">
                        {isGenerating ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />} AI Generate
                    </button>
                 </div>
               </div>
              <textarea name="content" value={formData.content} onChange={handleChange} rows={12} className="w-full p-2 bg-base-200-light dark:bg-base-300-dark rounded-md border border-gray-300 dark:border-gray-600" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 bg-base-200-light dark:bg-base-300-dark rounded-md border border-gray-300 dark:border-gray-600">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          
          <SeoManager seo={formData.seo} onSeoChange={handleSeoChange} content={formData.content} />
          
          <footer className="flex justify-end p-4 border-t border-base-300-light dark:border-base-300-dark bg-base-200-light dark:bg-base-100-dark rounded-b-xl">
            <button type="submit" className="flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium bg-success text-white hover:opacity-90">
              <Save className="h-4 w-4" /> Save
            </button>
          </footer>
        </form>
      </div>
      {isFilePickerOpen && <FilePickerModal onClose={() => setFilePickerOpen(false)} onSelect={insertImage} />}
    </div>,
    document.getElementById('modal-root')!
  );
};

export default PageEditorModal;
