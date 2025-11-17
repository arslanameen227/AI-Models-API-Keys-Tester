import React from 'react';

export interface Provider {
  id: string;
  name:string;
  logo: string;
  placeholder: string;
  prefix?: string;
  validationUrl?: string;
  authHeader?: string;
  authScheme?: string;
}

export enum TestStatus {
  IDLE = 'IDLE',
  TESTING = 'TESTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface TestResult {
  valid: boolean;
  error?: string;
}

export interface SeoMeta {
  title: string;
  description: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string; // Markdown content
  author: string;
  publishedDate: string; // ISO 8601 format
  status: 'draft' | 'published';
  seo: SeoMeta;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string; // Markdown content
  status: 'draft' | 'published';
  seo: SeoMeta;
}

export interface FileObject {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  uploadedDate: string;
}

export interface User {
  id: string;
  username: string;
  // passwordHash is backend-only now
  role: 'admin' | 'editor';
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    light: { [key: string]: string };
    dark: { [key: string]: string };
  };
}

export interface MenuItem {
    id: string; // Corresponds to tool id or page slug
    name: string;
    type: 'tool' | 'page' | 'blog-index';
    isVisible: boolean;
    order: number;
}

export interface AnalyticsData {
  pageViews: { date: string; count: number }[];
  uniqueVisitors: { date: string; count: number }[];
}

export interface SiteSettings {
    siteTitle: string;
    siteDescription: string;
    activeThemeId: string;
}

// Represents a feature a plugin can add
export interface PluginTool {
    id: string;
    name: string;
    description: string;
    iconName: string; // e.g., 'ShieldCheck'
    componentId: string; // Maps to a pre-defined component in the frontend
}

export interface Plugin {
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
    isInstalled: boolean;
    isActive: boolean;
    addsTool?: PluginTool; // Describes a tool to add to the sidebar
}

export interface Database {
    settings: SiteSettings;
    providers: Provider[];
    blogPosts: BlogPost[];
    pages: Page[];
    files: FileObject[];
    users: User[];
    themes: Theme[];
    menuItems: MenuItem[];
    analytics: AnalyticsData;
    plugins: Plugin[];
}


export interface Tool {
  id: string;
  name: string;
  icon: React.ElementType;
  component: React.ComponentType;
  description: string;
  isExternal?: boolean;
}