import React, { useContext } from 'react';
import { tools } from '../data/tools';
import { AuthContext } from '../context/AuthContext';
import { BotMessageSquare } from 'lucide-react';

interface SidebarProps {
  activeToolId: string;
  setActiveToolId: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeToolId, setActiveToolId }) => {
  const { isLoggedIn } = useContext(AuthContext);

  const filteredTools = tools.filter(tool => tool.id !== 'admin' || isLoggedIn);

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-base-200 border-r border-base-300 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-base-300">
        <BotMessageSquare className="h-8 w-8 text-brand-secondary" />
        <h1 className="text-xl font-bold ml-2 text-white">AI Toolkit</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredTools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveToolId(tool.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeToolId === tool.id
                ? 'bg-brand-primary text-white'
                : 'text-gray-300 hover:bg-base-300 hover:text-white'
            }`}
          >
            <tool.icon className="h-5 w-5" />
            <span>{tool.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
