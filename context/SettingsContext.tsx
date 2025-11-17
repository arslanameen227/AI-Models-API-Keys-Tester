import React, { createContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { initialSettings } from '../data/initialData';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: initialSettings,
  updateSettings: () => {},
});

export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const storedSettings = localStorage.getItem('siteSettings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        // Ensure all keys from initialSettings exist to prevent app crashes on data structure updates
        return { ...initialSettings, ...parsed };
      }
      return initialSettings;
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
      return initialSettings;
    }
  });

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    localStorage.setItem('siteSettings', JSON.stringify(newSettings));
  };
  
  // This effect syncs changes across multiple tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'siteSettings' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          setSettings({ ...initialSettings, ...parsed });
        } catch (error) {
            console.error("Failed to parse settings from storage event", error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};