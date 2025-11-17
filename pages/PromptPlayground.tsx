import React, { useState, useContext } from 'react';
import { AiServiceContext } from '../context/AiServiceContext';
import { generateText } from '../services/aiService';
import { Loader, AlertTriangle, Terminal } from 'lucide-react';

const PromptPlayground: React.FC = () => {
  const { apiKey } = useContext(AiServiceContext);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
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
    setResult('');

    const response = await generateText(apiKey, prompt);
    if (response.success) {
      setResult(response.text || '');
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  const PageHeader = () => (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-white">Prompt Playground</h1>
      <p className="text-gray-400 mt-2">A simple interface to experiment with prompts and see raw model output.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <PageHeader />

      <div className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
        <div>
          <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-2">
            Your Prompt
          </label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Write a haiku about a robot learning to paint."
            rows={5}
            className="w-full p-3 bg-base-300 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-secondary"
            disabled={!apiKey || isLoading}
          />
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
            'Generate'
          )}
        </button>

        {error && (
            <div className="flex items-center gap-3 text-error bg-red-900/50 p-3 rounded-lg border border-error">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium text-sm">{error}</p>
            </div>
        )}
        
        {result && (
            <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4 flex items-center gap-2">
                    <Terminal />
                    Model Output
                </h3>
                <pre className="bg-base-300 p-4 rounded-lg text-gray-300 whitespace-pre-wrap font-mono text-sm">{result}</pre>
            </div>
        )}
      </div>
    </div>
  );
};

export default PromptPlayground;
