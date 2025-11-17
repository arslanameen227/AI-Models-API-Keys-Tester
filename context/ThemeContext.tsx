import React, { createContext, useState, useEffect, ReactNode, useMemo, useContext } from 'react';
import { Theme } from '../types';
import { SettingsContext } from './SettingsContext';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  activeTheme: Theme | null;
  setActiveTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  setThemeMode: () => {},
  activeTheme: null,
  setActiveTheme: () => {}
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings, themes, updateSettings, isLoaded } = useContext(SettingsContext);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [activeTheme, setActiveThemeState] = useState<Theme | null>(null);

  // Initialize theme mode
  useEffect(() => {
    const storedTheme = localStorage.getItem('themeMode') as ThemeMode | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialMode = storedTheme || (prefersDark ? 'dark' : 'light');
    setThemeModeState(initialMode);
    document.documentElement.classList.toggle('dark', initialMode === 'dark');
  }, []);
  
  // Set active theme from settings once loaded
  useEffect(() => {
      if (isLoaded && settings.activeThemeId) {
          const themeFromDb = themes.find(t => t.id === settings.activeThemeId);
          if (themeFromDb) {
              applyTheme(themeFromDb);
              setActiveThemeState(themeFromDb);
          }
      }
  }, [isLoaded, settings.activeThemeId, themes]);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    Object.keys(theme.colors.light).forEach(key => {
      root.style.setProperty(`--${key}`, theme.colors.light[key]);
    });
    Object.keys(theme.colors.dark).forEach(key => {
      root.style.setProperty(`--${key}`, theme.colors.dark[key]);
    });
  };

  const setThemeMode = (newThemeMode: ThemeMode) => {
    localStorage.setItem('themeMode', newThemeMode);
    setThemeModeState(newThemeMode);
    document.documentElement.classList.toggle('dark', newThemeMode === 'dark');
  };
  
  const setActiveTheme = (newTheme: Theme) => {
      applyTheme(newTheme);
      setActiveThemeState(newTheme);
      updateSettings({ activeThemeId: newTheme.id });
      // Also store in localStorage to prevent flicker on reload
      localStorage.setItem('activeTheme', JSON.stringify(newTheme));
  };
  
  const value = useMemo(() => ({ themeMode, setThemeMode, activeTheme, setActiveTheme }), [themeMode, activeTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
