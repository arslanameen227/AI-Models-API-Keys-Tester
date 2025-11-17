import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldOff } from 'lucide-react';
import ModelManager from '../components/ModelManager';
import SiteSettingsManager from '../components/SiteSettingsManager';

type AdminTab = 'models' | 'settings';

const AdminPanel: React.FC = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<AdminTab>('models');

  if (!isLoggedIn) {
    return (
      <div className="bg-base-200 p-8 rounded-xl shadow-2xl border border-base-300 text-center text-warning flex flex-col items-center gap-4 animate-fade-in">
        <ShieldOff className="h-12 w-12" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-400">You must be logged in as an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="bg-base-200 p-6 sm:p-8 rounded-xl shadow-2xl border border-base-300 animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Admin Panel</h2>
      
      <div className="border-b border-base-300 mb-6">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('models')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'models'
                ? 'border-brand-secondary text-brand-secondary'
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            Model Management
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'settings'
                ? 'border-brand-secondary text-brand-secondary'
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            Site Settings
          </button>
        </nav>
      </div>
      
      <div>
        {activeTab === 'models' && <ModelManager />}
        {activeTab === 'settings' && <SiteSettingsManager />}
      </div>
    </div>
  );
};

export default AdminPanel;
