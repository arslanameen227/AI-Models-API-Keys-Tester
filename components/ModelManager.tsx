import React, { useContext, useState } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Provider } from '../types';
import { Plus, Trash2, Edit, AlertTriangle } from 'lucide-react';
import ProviderEditModal from './ProviderEditModal';

const ModelManager: React.FC = () => {
  const { settings, updateSettings } = useContext(SettingsContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  const handleOpenAddModal = () => {
    setEditingProvider(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (provider: Provider) => {
    setEditingProvider(provider);
    setIsModalOpen(true);
  };

  const handleSaveProvider = (providerToSave: Provider) => {
    let updatedProviders;
    if (editingProvider) { // Editing existing
        updatedProviders = settings.providers.map(p => p.id === providerToSave.id ? providerToSave : p);
    } else { // Adding new
        updatedProviders = [...settings.providers, providerToSave];
    }
    updateSettings({ ...settings, providers: updatedProviders });
    setIsModalOpen(false);
  };

  const handleRemoveProvider = (id: string) => {
    if (window.confirm('Are you sure you want to remove this provider? This action cannot be undone.')) {
        const updatedProviders = settings.providers.filter(p => p.id !== id);
        updateSettings({ ...settings, providers: updatedProviders });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-200">Configured AI Providers</h3>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-brand-primary text-white hover:bg-brand-secondary transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Provider
        </button>
      </div>

      <div className="space-y-3">
        {settings.providers.length > 0 ? (
            settings.providers.map(provider => (
            <div key={provider.id} className="bg-base-300 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors group">
                <div className="flex items-center gap-4">
                    <img src={provider.logo} alt={provider.name} className="h-8 w-8 object-contain bg-white rounded-full p-1" />
                    <span className="font-medium text-gray-200">{provider.name}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => handleOpenEditModal(provider)}
                        className="text-gray-400 hover:text-brand-secondary transition-colors"
                        aria-label={`Edit ${provider.name}`}
                    >
                        <Edit className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleRemoveProvider(provider.id)}
                        className="text-gray-400 hover:text-error transition-colors"
                        aria-label={`Remove ${provider.name}`}
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </div>
            ))
        ) : (
            <div className="bg-base-300/50 p-6 rounded-lg text-center border-2 border-dashed border-gray-600">
                <AlertTriangle className="mx-auto h-10 w-10 text-warning mb-3" />
                <p className="text-gray-400 font-medium">No providers configured.</p>
                <p className="text-sm text-gray-500">Click "Add New Provider" to get started.</p>
            </div>
        )}
      </div>

      {isModalOpen && (
        <ProviderEditModal 
            provider={editingProvider}
            onSave={handleSaveProvider}
            onClose={() => setIsModalOpen(false)}
            existingIds={settings.providers.map(p => p.id)}
        />
      )}
    </div>
  );
};

export default ModelManager;