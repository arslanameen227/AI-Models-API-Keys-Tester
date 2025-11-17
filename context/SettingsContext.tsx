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
      return storedSettings ? JSON.parse(storedSettings) : initialSettings;
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
          setSettings(JSON.parse(event.newValue));
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