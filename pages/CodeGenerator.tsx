import React, { useState, useContext } from 'react';
import { AiServiceContext } from '../context/AiServiceContext';
import { generateText } from '../services/aiService';
import { Loader, AlertTriangle, Code } from 'lucide-react';

const languages = ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust", "HTML", "CSS"];

const CodeGenerator: React.FC = () => {
  const { apiKey } = useContext(AiServiceContext);
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('Python');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please validate an API key in the Key Verifier first.');
      return;
    }
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError('');
    setCode('');
    
    const fullPrompt = `Generate a code snippet in ${language} for the following task. Only return the code block, with no extra explanations or introductions.\n\nTask: "${prompt}"`;
    const response = await generateText(apiKey, fullPrompt);
    
    if (response.success && response.text) {
      // Clean up markdown code block fences
      const cleanedCode = response.text.replace(/^```(?:\w+\n)?/, '').replace(/```$/, '');
      setCode(cleanedCode.trim());
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">Code Generator</h1>
        <p className="text-gray-400 mt-2">Describe a task and get a code snippet in your chosen language.</p>
      </div>

      <div className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-2">
              Task Description
            </label>
            <input
              id="prompt-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A function to reverse a string"
              className="w-full p-3 bg-base-300 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-secondary"
              disabled={!apiKey || isLoading}
            />
          </div>
          <div>
            <label htmlFor="language-select" className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select id="language-select" value={language} onChange={e => setLanguage(e.target.value)} className="w-full p-3 bg-base-300 rounded-md border border-gray-600">
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !apiKey}
          className="w-full flex justify-center items-center py-3 px-4 bg-brand-primary text-white font-semibold rounded-md shadow-lg hover:bg-brand-secondary transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-3" />
              Generating...
            </>
          ) : (
            'Generate Code'
          )}
        </button>

        {error && (
            <div className="flex items-center gap-3 text-error bg-red-900/50 p-3 rounded-lg border border-error">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium text-sm">{error}</p>
            </div>
        )}
        
        {code && (
            <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4 flex items-center gap-2">
                    <Code />
                    Generated Code
                </h3>
                <pre className="bg-base-300 p-4 rounded-lg text-gray-300 whitespace-pre-wrap font-mono text-sm max-h-96 overflow-auto">
                  <code>{code}</code>
                </pre>
            </div>
        )}
      </div>
    </div>
  );
};

export default CodeGenerator;
