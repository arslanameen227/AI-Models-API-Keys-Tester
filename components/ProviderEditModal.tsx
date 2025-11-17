import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from '../types';
import { X, Save, Info } from 'lucide-react';

interface ProviderEditModalProps {
  provider: Provider | null; // null for adding, provider object for editing
  onSave: (provider: Provider) => void;
  onClose: () => void;
  existingIds: string[];
}

const ProviderEditModal: React.FC<ProviderEditModalProps> = ({ provider, onSave, onClose, existingIds }) => {
  const isEditing = provider !== null;
  const [formData, setFormData] = useState<Provider>(
    provider || {
      id: '',
      name: '',
      logo: '',
      placeholder: '',
      prefix: '',
      validationUrl: '',
      authHeader: 'Authorization',
      authScheme: 'Bearer',
    }
  );
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.logo || !formData.placeholder) {
      setError('Name, Logo URL, and Placeholder are required.');
      return;
    }

    let providerId = formData.id;
    if (!isEditing) {
        providerId = formData.name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        if (existingIds.includes(providerId)) {
            setError(`A provider with ID "${providerId}" already exists. Please choose a different name.`);
            return;
        }
    }
    
    onSave({ ...formData, id: providerId });
  };
  
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-base-200 w-full max-w-lg m-4 p-6 sm:p-8 rounded-xl shadow-2xl border border-base-300 relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X />
        </button>

        <h2 className="text-2xl font-bold text-center text-white mb-6">
          {isEditing ? 'Edit Provider' : 'Add New Provider'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Provider Name*</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-base-300 rounded-md border border-gray-600" placeholder="e.g., OpenAI" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Logo URL*</label>
                <input name="logo" value={formData.logo} onChange={handleChange} className="w-full p-2 bg-base-300 rounded-md border border-gray-600" placeholder="https://..." />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">API Key Placeholder*</label>
                <input name="placeholder" value={formData.placeholder} onChange={handleChange} className="w-full p-2 bg-base-300 rounded-md border border-gray-600" placeholder="Enter your API key (sk-...)" />
            </div>
            
            <hr className="border-gray-600" />
            <h3 className="font-semibold text-lg text-gray-200 pt-2">Validation Settings</h3>
            
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">API Key Prefix (for mock test)</label>
                <input name="prefix" value={formData.prefix} onChange={handleChange} className="w-full p-2 bg-base-300 rounded-md border border-gray-600" placeholder="e.g., sk-" />
                <p className="text-xs text-gray-500 mt-1">Used for basic validation if no Validation URL is provided.</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Validation URL (for real test)</label>
                <input name="validationUrl" value={formData.validationUrl} onChange={handleChange} className="w-full p-2 bg-base-300 rounded-md border border-gray-600" placeholder="https://api.example.com/v1/models" />
                <p className="text-xs text-gray-500 mt-1">If provided, the app will make a real API call to this GET endpoint to verify the key.</p>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Auth Header</label>
                    <input name="authHeader" value={formData.authHeader} onChange={handleChange} className="w-full p-2 bg-base-300 rounded-md border border-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Auth Scheme</label>
                    <input name="authScheme" value={formData.authScheme} onChange={handleChange} className="w-full p-2 bg-base-300 rounded-md border border-gray-600" placeholder="e.g., Bearer" />
                </div>
            </div>
            
            {error && <p className="text-sm text-error text-center">{error}</p>}
            
            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium bg-success text-white hover:opacity-90 transition-opacity"
                >
                    <Save className="h-4 w-4" /> Save
                </button>
            </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

export default ProviderEditModal;
