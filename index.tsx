import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { AiServiceProvider } from './context/AiServiceContext';
import { ThemeProvider } from './context/ThemeContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <AiServiceProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AiServiceProvider>
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>
);