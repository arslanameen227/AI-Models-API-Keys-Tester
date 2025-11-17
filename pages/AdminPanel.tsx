import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldOff } from 'lucide-react';
import ModelManager from '../components/ModelManager';
import SiteSettingsManager from '../components/SiteSettingsManager';
import BlogManager from '../components/BlogManager';
import PageManager from '../components/PageManager';
import FileManager from '../components/FileManager';

type AdminTab = 'models' | 'settings' | 'blog' | 'pages' | 'files';

const AdminPanel: React.FC = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<AdminTab>('blog');

  if (!isLoggedIn) {
    return (
      <div className="bg-base-200-light dark:bg-base-200-dark p-8 rounded-xl shadow-2xl border border-base-300-light dark:border-base-300-dark text-center text-warning flex flex-col items-center gap-4 animate-fade-in">
        <ShieldOff className="h-12 w-12" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400">You must be logged in as an administrator to view this page.</p>
      </div>
    );
  }
  
  const TabButton: React.FC<{tabId: AdminTab; label: string}> = ({ tabId, label}) => (
     <button
        onClick={() => setActiveTab(tabId)}
        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
          activeTab === tabId
            ? 'border-brand-primary-light dark:border-brand-primary-dark text-brand-primary-light dark:text-brand-primary-dark'
            : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        {label}
      </button>
  );

  return (
    <div className="bg-base-100-light dark:bg-base-200-dark p-4 sm:p-6 rounded-xl shadow-2xl border border-base-300-light dark:border-base-300-dark animate-fade-in max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>
      
      <div className="border-b border-base-300-light dark:border-base-300-dark mb-6">
        <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto">
          <TabButton tabId="blog" label="Blog Posts" />
          <TabButton tabId="pages" label="Pages" />
          <TabButton tabId="files" label="File Manager" />
          <TabButton tabId="models" label="AI Providers" />
          <TabButton tabId="settings" label="Site Settings" />
        </nav>
      </div>
      
      <div>
        {activeTab === 'blog' && <BlogManager />}
        {activeTab === 'pages' && <PageManager />}
        {activeTab === 'files' && <FileManager />}
        {activeTab === 'models' && <ModelManager />}
        {activeTab === 'settings' && <SiteSettingsManager />}
      </div>
    </div>
  );
};

export default AdminPanel;