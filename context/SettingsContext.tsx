import React, { createContext, useState, useEffect, useCallback } from 'react';
import { SiteSettings, Provider, BlogPost, Page, FileObject, User, Theme, MenuItem, AnalyticsData, Plugin } from '../types';
import { apiService } from '../services/apiService';

interface SettingsContextType {
  settings: SiteSettings | null;
  providers: Provider[];
  blogPosts: BlogPost[];
  pages: Page[];
  files: FileObject[];
  users: User[];
  themes: Theme[];
  menuItems: MenuItem[];
  analytics: AnalyticsData | null;
  plugins: Plugin[];
  isLoaded: boolean;
  apiError: string | null;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  updateProviders: (newProviders: Provider[]) => Promise<void>;
  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedDate'>) => Promise<BlogPost>;
  updateBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  addPage: (page: Omit<Page, 'id'>) => Promise<Page>;
  updatePage: (page: Page) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  addFile: (fileData: FormData) => Promise<FileObject>;
  deleteFile: (id: string) => Promise<void>;
  updateMenuItems: (items: MenuItem[]) => Promise<void>;
  updatePluginState: (id: string, action: 'install' | 'uninstall' | 'activate' | 'deactivate') => Promise<void>;
}

const emptyInitialState = {
    settings: null,
    providers: [],
    blogPosts: [],
    pages: [],
    files: [],
    users: [],
    themes: [],
    menuItems: [],
    analytics: null,
    plugins: [],
};

export const SettingsContext = createContext<SettingsContextType>({
  ...emptyInitialState,
  isLoaded: false,
  apiError: null,
  updateSettings: async () => {},
  updateProviders: async () => {},
  addBlogPost: async () => ({} as BlogPost),
  updateBlogPost: async () => {},
  deleteBlogPost: async () => {},
  addPage: async () => ({} as Page),
  updatePage: async () => {},
  deletePage: async () => {},
  addFile: async () => ({} as FileObject),
  deleteFile: async () => {},
  updateMenuItems: async () => {},
  updatePluginState: async () => {},
});

export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, setState] = useState(emptyInitialState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiError, setApiError] = useState<string|null>(null);

  const loadData = useCallback(async () => {
    try {
        const [settings, providers, blogPosts, pages, files, users, themes, menuItems, analytics, plugins] = await Promise.all([
            apiService.getSettings(),
            apiService.getProviders(),
            apiService.getBlogPosts(),
            apiService.getPages(),
            apiService.getFiles(),
            apiService.getUsers(),
            apiService.getThemes(),
            apiService.getMenuItems(),
            apiService.getAnalytics(),
            apiService.getPlugins(),
        ]);
        setState({ settings, providers, blogPosts, pages, files, users, themes, menuItems, analytics, plugins });
        setApiError(null);
    } catch(e: any) {
        console.error("Failed to load initial site data from backend:", e);
        setApiError(e.message || "Could not connect to the backend.");
    } finally {
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    const updated = await apiService.updateSettings(newSettings);
    setState(s => ({ ...s, settings: updated }));
  }, []);
  
  const updateProviders = useCallback(async (newProviders: Provider[]) => {
    const updated = await apiService.setProviders(newProviders);
    setState(s => ({ ...s, providers: updated }));
  }, []);

  const addBlogPost = useCallback(async (post: Omit<BlogPost, 'id'|'publishedDate'>) => {
    const newPost = await apiService.addBlogPost(post);
    setState(s => ({ ...s, blogPosts: [...s.blogPosts, newPost] }));
    return newPost;
  }, []);

  const updateBlogPost = useCallback(async (post: BlogPost) => {
    const updated = await apiService.updateBlogPost(post);
    setState(s => ({...s, blogPosts: s.blogPosts.map(p => p.id === updated.id ? updated : p)}));
  }, []);

  const deleteBlogPost = useCallback(async (id: string) => {
    await apiService.deleteBlogPost(id);
    setState(s => ({...s, blogPosts: s.blogPosts.filter(p => p.id !== id)}));
  }, []);
  
  const addPage = useCallback(async (page: Omit<Page, 'id'>) => {
    const newPage = await apiService.addPage(page);
    setState(s => ({ ...s, pages: [...s.pages, newPage] }));
    return newPage;
  }, []);

  const updatePage = useCallback(async (page: Page) => {
    const updated = await apiService.updatePage(page);
    setState(s => ({...s, pages: s.pages.map(p => p.id === updated.id ? updated : p)}));
  }, []);

  const deletePage = useCallback(async (id: string) => {
    await apiService.deletePage(id);
    setState(s => ({...s, pages: s.pages.filter(p => p.id !== id)}));
  }, []);

  const addFile = useCallback(async (fileData: FormData) => {
    const newFile = await apiService.addFile(fileData);
    setState(s => ({ ...s, files: [...s.files, newFile] }));
    return newFile;
  }, []);
  
  const deleteFile = useCallback(async (id: string) => {
    await apiService.deleteFile(id);
    setState(s => ({...s, files: s.files.filter(f => f.id !== id)}));
  }, []);

  const updateMenuItems = useCallback(async (items: MenuItem[]) => {
    const updated = await apiService.setMenuItems(items);
    setState(s => ({ ...s, menuItems: updated }));
  }, []);

  const updatePluginState = useCallback(async (id: string, action: 'install' | 'uninstall' | 'activate' | 'deactivate') => {
      await apiService.updatePluginState(id, action);
      // Refetch all plugins to get the latest state
      const updatedPlugins = await apiService.getPlugins();
      setState(s => ({...s, plugins: updatedPlugins }));
  }, []);

  const contextValue = {
    ...state,
    isLoaded,
    apiError,
    updateSettings,
    updateProviders,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addPage,
    updatePage,
    deletePage,
    addFile,
    deleteFile,
    updateMenuItems,
    updatePluginState,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};