import React, { useState, useContext } from 'react';
import { AiServiceContext } from '../context/AiServiceContext';
import { generateText } from '../services/aiService';
import { Loader, AlertTriangle, Smile, Frown, Meh } from 'lucide-react';

type Sentiment = 'Positive' | 'Negative' | 'Neutral' | null;

const SentimentAnalysis: React.FC = () => {
  const { apiKey } = useContext(AiServiceContext);
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState<Sentiment>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
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
    setSentiment(null);
    
    const prompt = `Analyze the sentiment of the following text. Respond with only one word: "Positive", "Negative", or "Neutral".\n\nText: "${text}"`;
    const response = await generateText(apiKey, prompt);
    
    if (response.success && response.text) {
      const result = response.text.trim();
      if (['Positive', 'Negative', 'Neutral'].includes(result)) {
        setSentiment(result as Sentiment);
      } else {
        setError('The model returned an unexpected sentiment value.');
      }
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  const SentimentDisplay = () => {
    if (!sentiment) return null;
    let icon, colorClass, text;

    switch (sentiment) {
      case 'Positive':
        icon = <Smile className="h-8 w-8" />;
        colorClass = 'text-success';
        text = 'Positive';
        break;
      case 'Negative':
        icon = <Frown className="h-8 w-8" />;
        colorClass = 'text-error';
        text = 'Negative';
        break;
      case 'Neutral':
        icon = <Meh className="h-8 w-8" />;
        colorClass = 'text-warning';
        text = 'Neutral';
        break;
    }

    return (
        <div className={`mt-6 p-4 rounded-lg bg-base-300 flex flex-col items-center gap-2 transition-all duration-300`}>
            <div className={colorClass}>{icon}</div>
            <p className={`font-bold text-xl ${colorClass}`}>{text}</p>
        </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">Sentiment Analysis</h1>
        <p className="text-gray-400 mt-2">Determine if a piece of text is positive, negative, or neutral.</p>
      </div>

      <div className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-2">
            Text to Analyze
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., I absolutely love this new product, it's the best thing I've bought all year!"
            rows={5}
            className="w-full p-3 bg-base-300 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-secondary"
            disabled={!apiKey || isLoading}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !apiKey}
          className="w-full flex justify-center items-center py-3 px-4 bg-brand-primary text-white font-semibold rounded-md shadow-lg hover:bg-brand-secondary transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-3" />
              Analyzing...
            </>
          ) : (
            'Analyze Sentiment'
          )}
        </button>

        {error && (
            <div className="flex items-center gap-3 text-error bg-red-900/50 p-3 rounded-lg border border-error">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium text-sm">{error}</p>
            </div>
        )}
        
        <SentimentDisplay />
      </div>
    </div>
  );
};

export default SentimentAnalysis;
