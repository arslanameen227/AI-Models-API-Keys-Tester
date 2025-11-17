import React from 'react';

export interface Provider {
  id: string;
  name: string;
  logo: string;
  placeholder: string;
  prefix?: string; // Used for mock validation
  validationUrl?: string; // URL for real API validation
  authHeader?: string; // e.g., 'Authorization' or 'X-Api-Key'
  authScheme?: string; // e.g., 'Bearer'
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

export interface SiteSettings {
    siteTitle: string;
    siteDescription: string;
    providers: Provider[];
}

export interface Tool {
  id: string;
  name: string;
  icon: React.ElementType;
  component: React.ComponentType;
  description: string;
  isExternal?: boolean;
}
