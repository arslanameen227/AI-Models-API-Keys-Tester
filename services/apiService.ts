import { SiteSettings, Provider, BlogPost, Page, FileObject, User, Theme, MenuItem, AnalyticsData, Plugin } from '../types';

const API_BASE_URL = 'http://localhost:8000/api'; // IMPORTANT: Configure this to your Symfony backend URL

class ApiService {
    private async _fetch(endpoint: string, options: RequestInit = {}): Promise<any> {
        const token = localStorage.getItem('authToken');
        const headers = new Headers(options.headers || {});
        
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }
        if (!(options.body instanceof FormData)) {
            headers.append('Content-Type', 'application/json');
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown API error occurred.' }));
            throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
        }

        // Handle responses with no content
        if (response.status === 204) {
            return null;
        }

        return response.json();
    }

    // --- Auth ---
    async login(username: string, password: string): Promise<{ token: string, user: User }> {
        // Symfony's JWT bundle often uses /api/login_check
        const response = await fetch(`${API_BASE_URL}/login_check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) throw new Error('Invalid credentials');
        return response.json();
    }
    
    async getMe(): Promise<User> {
        return this._fetch('/me'); // Assumes an endpoint that returns the current user
    }

    // --- Generic Getters ---
    getSettings = (): Promise<SiteSettings> => this._fetch('/settings');
    getProviders = (): Promise<Provider[]> => this._fetch('/providers');
    getBlogPosts = (): Promise<BlogPost[]> => this._fetch('/posts');
    getPages = (): Promise<Page[]> => this._fetch('/pages');
    getFiles = (): Promise<FileObject[]> => this._fetch('/files');
    getUsers = (): Promise<User[]> => this._fetch('/users');
    getThemes = (): Promise<Theme[]> => this._fetch('/themes');
    getMenuItems = (): Promise<MenuItem[]> => this._fetch('/menu-items');
    getAnalytics = (): Promise<AnalyticsData> => this._fetch('/analytics');
    getPlugins = (): Promise<Plugin[]> => this._fetch('/plugins');
    
    // --- Site Settings ---
    updateSettings = (updates: Partial<SiteSettings>): Promise<SiteSettings> => this._fetch('/settings', { method: 'PUT', body: JSON.stringify(updates) });
    
    // --- Providers ---
    setProviders = (providers: Provider[]): Promise<Provider[]> => this._fetch('/providers', { method: 'PUT', body: JSON.stringify(providers) });

    // --- Blog Posts ---
    addBlogPost = (postData: Omit<BlogPost, 'id' | 'publishedDate'>): Promise<BlogPost> => this._fetch('/posts', { method: 'POST', body: JSON.stringify(postData) });
    updateBlogPost = (post: BlogPost): Promise<BlogPost> => this._fetch(`/posts/${post.id}`, { method: 'PUT', body: JSON.stringify(post) });
    deleteBlogPost = (id: string): Promise<void> => this._fetch(`/posts/${id}`, { method: 'DELETE' });

    // --- Pages ---
    addPage = (pageData: Omit<Page, 'id'>): Promise<Page> => this._fetch('/pages', { method: 'POST', body: JSON.stringify(pageData) });
    updatePage = (page: Page): Promise<Page> => this._fetch(`/pages/${page.id}`, { method: 'PUT', body: JSON.stringify(page) });
    deletePage = (id: string): Promise<void> => this._fetch(`/pages/${id}`, { method: 'DELETE' });
    
    // --- Files ---
    addFile = (formData: FormData): Promise<FileObject> => this._fetch('/files', { method: 'POST', body: formData });
    deleteFile = (id: string): Promise<void> => this._fetch(`/files/${id}`, { method: 'DELETE' });

    // --- Menu Items ---
    setMenuItems = (items: MenuItem[]): Promise<MenuItem[]> => this._fetch('/menu-items', { method: 'PUT', body: JSON.stringify(items) });

    // --- Plugins ---
    updatePluginState = (id: string, action: 'install' | 'uninstall' | 'activate' | 'deactivate'): Promise<void> => {
        return this._fetch(`/plugins/${id}/${action}`, { method: 'POST' });
    }

    // --- AI Service Passthrough ---
    generateText = (prompt: string, systemInstruction?: string): Promise<{ success: boolean; text?: string; error?: string }> => {
        return this._fetch('/ai/generate-text', { method: 'POST', body: JSON.stringify({ prompt, systemInstruction }) });
    }
}

export const apiService = new ApiService();