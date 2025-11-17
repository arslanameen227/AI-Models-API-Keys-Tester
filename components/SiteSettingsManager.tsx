import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Save, CheckCircle } from 'lucide-react';

const SiteSettingsManager: React.FC = () => {
  const { settings, updateSettings } = useContext(SettingsContext);
  const [siteTitle, setSiteTitle] = useState(settings.siteTitle);
  const [siteDescription, setSiteDescription] = useState(settings.siteDescription);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateSettings({ ...settings, siteTitle, siteDescription });
    setIsSaved(true);
  };

  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => setIsSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-300 mb-2">
          Site Title
        </label>
        <input
          id="siteTitle"
          type="text"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          className="w-full p-2 bg-base-300 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-secondary"
        />
      </div>
      <div>
        <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-300 mb-2">
          Site Description / Subtitle
        </label>
        <textarea
          id="siteDescription"
          value={siteDescription}
          onChange={(e) => setSiteDescription(e.target.value)}
          rows={3}
          className="w-full p-2 bg-base-300 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-secondary"
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-brand-primary text-white hover:bg-brand-secondary transition-colors"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
        {isSaved && (
          <div className="flex items-center gap-2 text-success animate-fade-in">
            <CheckCircle className="h-5 w-5" />
            <span>Saved!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteSettingsManager;