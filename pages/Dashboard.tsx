import React, { useContext } from 'react';
import { AiServiceContext } from '../context/AiServiceContext';
import { tools } from '../data/tools';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { apiKey } = useContext(AiServiceContext);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-purple-500">
          Welcome to the AI Toolkit
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          A collection of powerful tools to interact with generative AI models, now powered by Pollinations AI.
        </p>
      </div>

      <div className="bg-base-200 p-6 rounded-xl border border-base-300 max-w-3xl mx-auto mb-10">
        <h2 className="text-xl font-semibold text-white mb-4">Getting Started</h2>
        {apiKey ? (
          <div className="flex items-center gap-3 text-success bg-green-900/50 p-4 rounded-lg border border-success">
            <CheckCircle className="h-6 w-6" />
            <p className="font-medium">API Key is active for this session. You're all set to use the tools!</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-warning bg-yellow-900/50 p-4 rounded-lg border border-warning">
            <AlertTriangle className="h-6 w-6" />
            <p className="font-medium">
              To use the AI tools, please go to the <strong>API Key Verifier</strong> and validate a key (e.g., for Pollinations AI).
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tools.filter(t => !['dashboard', 'admin'].includes(t.id)).map(tool => (
            <div key={tool.id} className="bg-base-200 p-5 rounded-lg border border-base-300 hover:border-brand-secondary hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-2">
                    <tool.icon className="h-6 w-6 text-brand-secondary" />
                    <h3 className="font-bold text-lg text-white">{tool.name}</h3>
                </div>
                <p className="text-sm text-gray-400">{tool.description}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
