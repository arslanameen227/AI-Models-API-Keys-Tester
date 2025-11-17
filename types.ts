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

export interface SiteSettings {
    siteTitle: string;
    siteDescription: string;
    providers: Provider[];
    blogPosts: BlogPost[];
    pages: Page[];
    files: FileObject[];
}

export interface Tool {
  id: string;
  name: string;
  icon: React.ElementType;
  component: React.ComponentType;
  description: string;
  isExternal?: boolean;
}