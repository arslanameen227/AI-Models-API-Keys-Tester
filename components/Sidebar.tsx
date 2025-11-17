import React, { useContext, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { tools } from '../data/tools';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import { BotMessageSquare, File, Rss, HelpCircle } from 'lucide-react';

interface SidebarProps {
  activeToolId: string;
  setActiveToolId: (id: string) => void;
}

// FIX: Added SidebarProps to correctly type the component's props.
const Sidebar: React.FC<SidebarProps> = ({ activeToolId, setActiveToolId }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const { settings, pages, menuItems, plugins } = useContext(SettingsContext);

  const getIcon = (iconName: string): React.ElementType => {
    // @ts-ignore
    return LucideIcons[iconName] || HelpCircle;
  }

  const visibleMenuItems = useMemo(() => {
    const coreNavItems = menuItems
      .filter(item => item.isVisible)
      .map(item => {
        let icon: React.ElementType = HelpCircle;
        let id = item.id;
        if (item.type === 'page') {
            const page = pages.find(p => p.id === item.id);
            if (!page) return null;
            id = `page:${page.slug}`;
            icon = File;
        } else if (item.type === 'blog-index') {
            id = 'blog';
            icon = Rss;
        } else {
            const tool = tools.find(t => t.id === item.id);
            if(tool) icon = tool.icon;
        }
        return { ...item, finalId: id, icon };
      })
      .filter(Boolean);

    const pluginNavItems = plugins
        .filter(p => p.isActive && p.addsTool)
        .map((p, index) => {
            const tool = p.addsTool!;
            return {
                id: tool.id,
                name: tool.name,
                finalId: tool.id,
                icon: getIcon(tool.iconName),
                order: 1000 + index, // Place plugin items after core items
            };
        });

    const allItems = [...coreNavItems, ...pluginNavItems];

    return allItems
      .filter(item => item.id !== 'admin' || isLoggedIn) // Hide admin panel if not logged in
      .sort((a, b) => a.order - b.order);
  }, [menuItems, pages, plugins, isLoggedIn]);


  const renderNavItem = (id: string, name: string, icon: React.ElementType) => (
    <button
      key={id}
      onClick={() => setActiveToolId(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
        activeToolId === id
          ? 'bg-brand-primary text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-base-200 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {React.createElement(icon, { className: "h-5 w-5 flex-shrink-0" })}
      <span className="truncate">{name}</span>
    </button>
  );
  
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-base-100 border-r border-base-300 flex-col hidden md:flex">
      <div className="flex items-center justify-center h-16 border-b border-base-300">
        <BotMessageSquare className="h-8 w-8 text-brand-secondary" />
        <h1 className="text-xl font-bold ml-2 text-base-content">{settings?.siteTitle || 'AI Framework'}</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleMenuItems.map(item => item ? renderNavItem(item.finalId, item.name, item.icon) : null)}
      </nav>
    </aside>
  );
};

export default Sidebar;