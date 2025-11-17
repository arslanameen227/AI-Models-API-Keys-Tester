import React, { useState, useMemo, useContext } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BlogPost from './pages/BlogPost';
import DynamicPage from './pages/DynamicPage';
import { SettingsContext } from './context/SettingsContext';
import { tools } from './data/tools';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string>('dashboard');
  const { pages, blogPosts, menuItems, plugins, isLoaded, apiError } = useContext(SettingsContext);

  const ActiveComponent = useMemo(() => {
    if (!isLoaded) {
      return () => <div className="flex justify-center items-center h-full"><p>Loading framework...</p></div>;
    }
    
    // Display API connection error globally
    if(apiError){
        return () => (
            <div className="bg-error/10 text-error p-6 rounded-lg text-center border border-error">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                <h2 className="text-2xl font-bold">Backend Connection Error</h2>
                <p className="mt-2">Could not connect to the backend server. Please ensure it is running and accessible.</p>
                <pre className="mt-4 text-sm bg-error/10 p-2 rounded-md">{apiError}</pre>
            </div>
        )
    }

    // Dynamic routing for pages and blog posts
    if (activeToolId.startsWith('page:')) {
      const slug = activeToolId.split(':')[1];
      const page = pages.find(p => p.slug === slug);
      return page ? () => <DynamicPage page={page} /> : () => <div>Page not found</div>;
    }
    if (activeToolId.startsWith('blog:')) {
      const slug = activeToolId.split(':')[1];
      const post = blogPosts.find(p => p.slug === slug);
      return post ? () => <BlogPost post={post} /> : () => <div>Blog post not found</div>;
    }

    // Static and Plugin-based tools
    const allTools = [
        ...tools,
        // Add tools from active plugins
        ...plugins
            .filter(p => p.isActive)
            .map(p => p.addsTool)
            .filter(Boolean)
            .map(t => ({...t!, component: tools.find(st => st.id === t!.componentId)?.component || Dashboard }))
    ];

    const tool = allTools.find(tool => tool.id === activeToolId);
    return tool ? tool.component : Dashboard;
  }, [activeToolId, pages, blogPosts, plugins, isLoaded, apiError]);

  return (
    <div className="min-h-screen flex font-sans">
      <Sidebar activeToolId={activeToolId} setActiveToolId={setActiveToolId} />
      
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div key={activeToolId} className="animate-fade-in">
             <ActiveComponent />
          </div>
        </main>

        <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm border-t border-base-300">
          <p>&copy; {new Date().getFullYear()} AI Framework. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;