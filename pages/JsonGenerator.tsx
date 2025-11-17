import React, { useState, useContext } from 'react';
import { AiServiceContext } from '../context/AiServiceContext';
import { generateJson } from '../services/aiService';
import { Loader, AlertTriangle, Code } from 'lucide-react';

const JsonGenerator: React.FC = () => {
  const { apiKey } = useContext(AiServiceContext);
  const [prompt, setPrompt] = useState('');
  const [jsonResult, setJsonResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please validate an API key in the Key Verifier first.');
      return;
    }
    if (!prompt.trim()) {
      setError('Description cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError('');
    setJsonResult('');

    const response = await generateJson(apiKey, prompt);
    if (response.success && response.json) {
      try {
        // Format the JSON for better readability
        const parsed = JSON.parse(response.json);
        setJsonResult(JSON.stringify(parsed, null, 2));
      } catch (e) {
        // If parsing fails, show the raw output
        setJsonResult(response.json);
      }
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">JSON Generator</h1>
        <p className="text-gray-400 mt-2">Describe a data structure in plain English to get a valid JSON object.</p>
      </div>

      <div className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
        <div>
          <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-2">
            JSON Description
          </label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A user object with an ID, name, email, and a list of friends where each friend has a name and ID."
            rows={4}
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
            'Generate JSON'
          )}
        </button>

        {error && (
            <div className="flex items-center gap-3 text-error bg-red-900/50 p-3 rounded-lg border border-error">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium text-sm">{error}</p>
            </div>
        )}
        
        {jsonResult && (
            <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4 flex items-center gap-2">
                    <Code />
                    Generated JSON
                </h3>
                <pre className="bg-base-300 p-4 rounded-lg text-gray-300 whitespace-pre-wrap font-mono text-sm max-h-96 overflow-auto">{jsonResult}</pre>
            </div>
        )}
      </div>
    </div>
  );
};

export default JsonGenerator;
