import React, { useState, useMemo, useContext } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { tools } from './data/tools';
import Dashboard from './pages/Dashboard';
import BlogPost from './pages/BlogPost';
import DynamicPage from './pages/DynamicPage';
import { SettingsContext } from './context/SettingsContext';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string>('dashboard');
  const { settings } = useContext(SettingsContext);

  const ActiveComponent = useMemo(() => {
    // Dynamic routing for pages and blog posts
    if (activeToolId.startsWith('page:')) {
      const slug = activeToolId.split(':')[1];
      const page = settings.pages.find(p => p.slug === slug);
      return page ? () => <DynamicPage page={page} /> : () => <div>Page not found</div>;
    }
    if (activeToolId.startsWith('blog:')) {
      const slug = activeToolId.split(':')[1];
      const post = settings.blogPosts.find(p => p.slug === slug);
      return post ? () => <BlogPost post={post} /> : () => <div>Blog post not found</div>;
    }

    // Static tools
    const tool = tools.find(tool => tool.id === activeToolId);
    return tool ? tool.component : Dashboard;
  }, [activeToolId, settings.pages, settings.blogPosts]);

  return (
    <div className="min-h-screen flex font-sans">
      <Sidebar activeToolId={activeToolId} setActiveToolId={setActiveToolId} />
      
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Keyed component for smooth transitions */}
          <div key={activeToolId} className="animate-fade-in">
             <ActiveComponent />
          </div>
        </main>

        <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm border-t border-base-300-light dark:border-base-200-dark">
          <p>&copy; {new Date().getFullYear()} AI Framework. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;