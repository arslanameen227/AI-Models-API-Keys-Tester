import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import { SettingsProvider } from './context/SettingsContext';
import Sidebar from './components/Sidebar';
import { tools } from './data/tools';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string>('dashboard');

  const ActiveToolComponent = useMemo(() => {
    return tools.find(tool => tool.id === activeToolId)?.component;
  }, [activeToolId]);

  return (
    <div className="min-h-screen bg-base-100 flex font-sans text-base-content">
      <Sidebar activeToolId={activeToolId} setActiveToolId={setActiveToolId} />
      
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {ActiveToolComponent ? <ActiveToolComponent /> : <div>Tool not found</div>}
        </main>

        <footer className="text-center p-4 text-gray-500 text-sm border-t border-base-200">
          <p>&copy; {new Date().getFullYear()} AI Toolkit. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;