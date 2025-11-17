import React, { useState, useContext } from 'react';
import { AiServiceContext } from '../context/AiServiceContext';
import { generateText } from '../services/aiService';
import { Loader, AlertTriangle, Sparkles, FileEdit } from 'lucide-react';

const ContentRewriter: React.FC = () => {
  const { apiKey } = useContext(AiServiceContext);
  const [text, setText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRewrite = async () => {
    if (!apiKey) {
      setError('Please validate an API key in the Key Verifier first.');
      return;
    }
    if (!text.trim()) {
      setError('Text to rewrite cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError('');
    setRewrittenText('');
    
    const prompt = `Rewrite the following text in a clear and engaging way. Maintain the original meaning but use different wording.\n\n---\n\n${text}`;
    const response = await generateText(apiKey, prompt);
    
    if (response.success) {
      setRewrittenText(response.text || '');
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">Content Rewriter</h1>
        <p className="text-gray-400 mt-2">Paraphrase and enhance your text for better clarity and impact.</p>
      </div>

      <div className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <FileEdit />
            Original Text
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here..."
            rows={8}
            className="w-full p-3 bg-base-300 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-secondary"
            disabled={!apiKey || isLoading}
          />
        </div>

        <button
          onClick={handleRewrite}
          disabled={isLoading || !apiKey}
          className="w-full flex justify-center items-center py-3 px-4 bg-brand-primary text-white font-semibold rounded-md shadow-lg hover:bg-brand-secondary transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-3" />
              Rewriting...
            </>
          ) : (
             <div className="flex items-center gap-2"><Sparkles /> Rewrite Content</div>
          )}
        </button>

        {error && (
            <div className="flex items-center gap-3 text-error bg-red-900/50 p-3 rounded-lg border border-error">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium text-sm">{error}</p>
            </div>
        )}
        
        {rewrittenText && (
            <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
                    Rewritten Version
                </h3>
                <div className="bg-base-300 p-4 rounded-lg text-gray-300 whitespace-pre-wrap">{rewrittenText}</div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ContentRewriter;
