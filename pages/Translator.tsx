import React, { useState, useContext } from 'react';
import { AiServiceContext } from '../context/AiServiceContext';
import { generateText } from '../services/aiService';
import { Loader, AlertTriangle, Languages, ArrowRightLeft } from 'lucide-react';

const languages = [
  "English", "Spanish", "French", "German", "Chinese (Simplified)", 
  "Japanese", "Korean", "Russian", "Arabic", "Hindi", "Italian", "Portuguese"
];

const Translator: React.FC = () => {
  const { apiKey } = useContext(AiServiceContext);
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!apiKey) {
      setError('Please validate an API key in the Key Verifier first.');
      return;
    }
    if (!text.trim()) {
      setError('Text to translate cannot be empty.');
      return;
    }
     if (sourceLang === targetLang) {
      setError('Source and target languages cannot be the same.');
      return;
    }

    setIsLoading(true);
    setError('');
    setTranslation('');
    
    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Only return the translated text, with no extra explanations or phrases like "Here is the translation:".\n\nText: "${text}"`;
    const response = await generateText(apiKey, prompt);
    
    if (response.success) {
      setTranslation(response.text || '');
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">Language Translator</h1>
        <p className="text-gray-400 mt-2">Translate text between different languages.</p>
      </div>

      <div className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="source-lang" className="block text-sm font-medium text-gray-300 mb-2">From</label>
                <select id="source-lang" value={sourceLang} onChange={e => setSourceLang(e.target.value)} className="w-full p-3 bg-base-300 rounded-md border border-gray-600">
                    {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="target-lang" className="block text-sm font-medium text-gray-300 mb-2">To</label>
                <select id="target-lang" value={targetLang} onChange={e => setTargetLang(e.target.value)} className="w-full p-3 bg-base-300 rounded-md border border-gray-600">
                    {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
            </div>
        </div>

        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-2">
            Text to Translate
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text here..."
            rows={5}
            className="w-full p-3 bg-base-300 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-secondary"
            disabled={!apiKey || isLoading}
          />
        </div>

        <button
          onClick={handleTranslate}
          disabled={isLoading || !apiKey}
          className="w-full flex justify-center items-center py-3 px-4 bg-brand-primary text-white font-semibold rounded-md shadow-lg hover:bg-brand-secondary transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-3" />
              Translating...
            </>
          ) : (
            <div className="flex items-center gap-2"><Languages /> Translate</div>
          )}
        </button>

        {error && (
            <div className="flex items-center gap-3 text-error bg-red-900/50 p-3 rounded-lg border border-error">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium text-sm">{error}</p>
            </div>
        )}
        
        {translation && (
            <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">
                    Translation Result
                </h3>
                <div className="bg-base-300 p-4 rounded-lg text-gray-300 whitespace-pre-wrap">{translation}</div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Translator;
