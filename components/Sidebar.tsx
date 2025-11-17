import React, { useContext } from 'react';
import { tools } from '../data/tools';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import { BotMessageSquare, File, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeToolId: string;
  setActiveToolId: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeToolId, setActiveToolId }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const { settings } = useContext(SettingsContext);

  const filteredTools = tools.filter(tool => tool.id !== 'admin' || isLoggedIn);
  const publishedPages = settings.pages.filter(page => page.status === 'published');

  const renderNavItem = (id: string, name: string, icon: React.ElementType) => (
    <button
      key={id}
      onClick={() => setActiveToolId(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
        activeToolId === id
          ? 'bg-brand-primary-light dark:bg-brand-primary-dark text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-base-200-light dark:hover:bg-base-300-dark hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {React.createElement(icon, { className: "h-5 w-5 flex-shrink-0" })}
      <span className="truncate">{name}</span>
    </button>
  );

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-base-100-light dark:bg-base-200-dark border-r border-base-300-light dark:border-base-300-dark flex-col hidden md:flex">
      <div className="flex items-center justify-center h-16 border-b border-base-300-light dark:border-base-300-dark">
        <BotMessageSquare className="h-8 w-8 text-brand-secondary-light dark:text-brand-secondary-dark" />
        <h1 className="text-xl font-bold ml-2 text-gray-800 dark:text-white">AI Framework</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tools</h3>
        {filteredTools.map(tool => renderNavItem(tool.id, tool.name, tool.icon))}

        {publishedPages.length > 0 && (
           <div className="pt-4">
             <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pages</h3>
             {publishedPages.map(page => renderNavItem(`page:${page.slug}`, page.title, File))}
           </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;