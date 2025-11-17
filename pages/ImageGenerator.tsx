import React, { useState, useContext } from 'react';
import { AiServiceContext } from '../context/AiServiceContext';
import { generateImage } from '../services/aiService';
import { Loader, AlertTriangle, Image as ImageIcon } from 'lucide-react';

const ImageGenerator: React.FC = () => {
  const { apiKey } = useContext(AiServiceContext);
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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
    setImageUrl('');

    const response = await generateImage(apiKey, prompt);
    if (response.success && response.base64Image) {
      setImageUrl(`data:image/jpeg;base64,${response.base64Image}`);
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">Image Generator</h1>
        <p className="text-gray-400 mt-2">Create stunning images from text descriptions using Pollinations AI.</p>
      </div>

      <div className="bg-base-200 p-6 rounded-xl border border-base-300 space-y-4">
        <div>
          <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-2">
            Image Description
          </label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A cinematic shot of a raccoon in a library, wearing a monocle."
            rows={3}
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
            'Generate Image'
          )}
        </button>

        {error && (
            <div className="flex items-center gap-3 text-error bg-red-900/50 p-3 rounded-lg border border-error">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium text-sm">{error}</p>
            </div>
        )}
        
        <div className="mt-6">
            {(isLoading || imageUrl) && (
                <div className="aspect-square w-full bg-base-300 rounded-lg flex items-center justify-center border border-base-300">
                    {isLoading && <Loader className="animate-spin h-12 w-12 text-gray-400" />}
                    {imageUrl && !isLoading && <img src={imageUrl} alt="Generated" className="rounded-lg object-contain max-h-full max-w-full"/>}
                </div>
            )}
             {!isLoading && !imageUrl && (
                <div className="aspect-square w-full bg-base-300/50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-600">
                    <ImageIcon className="h-16 w-16 text-gray-500 mb-2" />
                    <p className="text-gray-500">Your generated image will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
