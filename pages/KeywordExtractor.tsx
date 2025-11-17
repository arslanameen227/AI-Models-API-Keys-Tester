import React, { useState, useContext } from 'react';
import { AiServiceContext } from '../context/AiServiceContext';
import { generateText } from '../services/aiService';
import { Loader, AlertTriangle, Tags } from 'lucide-react';

const KeywordExtractor: React.FC = () => {
  const { apiKey } = useContext(AiServiceContext);
  const [text, setText] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    if (!apiKey) {
      setError('Please validate an API key in the Key Verifier first.');
      return;
    }
    if (!text.trim()) {
      setError('Text to analyze cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError('');
    setKeywords([]);
    
    const prompt = `Extract the most important keywords from the following text. Return them as a comma-separated list.\n\nText: "${text}"`;
    const response = await generateText(apiKey, prompt);
    
    if (response.success && response.text) {
      const extractedKeywords = response.text.split(',').map(kw => kw.trim()).filter(Boolean);
      setKeywords(extractedKeywords);
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">Keyword Extractor</h1>
        <p className="text-gray-400 mt-2">Pull out the most important keywords from a block of text.</p>
      </div>

      <div className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-2">
            Your Text
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            rows={8}
            className="w-full p-3 bg-base-300 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-secondary"
            disabled={!apiKey || isLoading}
          />
        </div>

        <button
          onClick={handleExtract}
          disabled={isLoading || !apiKey}
          className="w-full flex justify-center items-center py-3 px-4 bg-brand-primary text-white font-semibold rounded-md shadow-lg hover:bg-brand-secondary transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-3" />
              Extracting...
            </>
          ) : (
            'Extract Keywords'
          )}
        </button>

        {error && (
            <div className="flex items-center gap-3 text-error bg-red-900/50 p-3 rounded-lg border border-error">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium text-sm">{error}</p>
            </div>
        )}
        
        {keywords.length > 0 && (
            <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4 flex items-center gap-2">
                    <Tags />
                    Extracted Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                    {keywords.map((kw, index) => (
                        <span key={index} className="bg-brand-secondary/50 text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                            {kw}
                        </span>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default KeywordExtractor;
