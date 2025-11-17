import React, { useState, useContext, useRef, useEffect } from 'react';
import { AiServiceContext } from '../context/AiServiceContext';
import { continueChat } from '../services/aiService';
import { Loader, AlertTriangle, User, Bot, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const ChatInterface: React.FC = () => {
  const { apiKey } = useContext(AiServiceContext);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async () => {
    if (!apiKey) {
      setError('Please validate an API key in the Key Verifier first.');
      return;
    }
    if (!input.trim()) return;

    const newUserMessage: Message = { role: 'user', parts: [{ text: input }] };
    const updatedHistory = [...history, newUserMessage];
    setHistory(updatedHistory);
    setInput('');
    setIsLoading(true);
    setError('');

    const response = await continueChat(apiKey, history, input);
    if (response.success) {
      const modelMessage: Message = { role: 'model', parts: [{ text: response.text || '' }] };
      setHistory([...updatedHistory, modelMessage]);
    } else {
      setError(response.error || 'An unknown error occurred.');
      // Remove the user message if the API call fails to avoid confusion
      setHistory(history);
    }
    setIsLoading(false);
  };
  
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto animate-fade-in">
        <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-white">Chat Interface</h1>
            <p className="text-gray-400 mt-2">Have a multi-turn conversation with the AI model.</p>
        </div>

        <div className="flex-1 bg-base-200 border border-base-300 rounded-xl p-4 flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {history.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="bg-brand-secondary h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"><Bot size={20} /></div>}
                        <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-800' : 'bg-base-300'}`}>
                            <p className="text-white whitespace-pre-wrap">{msg.parts[0].text}</p>
                        </div>
                         {msg.role === 'user' && <div className="bg-gray-600 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"><User size={20} /></div>}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start gap-3">
                         <div className="bg-brand-secondary h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"><Bot size={20} /></div>
                         <div className="max-w-lg p-3 rounded-lg bg-base-300 flex items-center">
                            <Loader className="animate-spin h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

             {error && (
                <div className="flex items-center gap-3 text-error bg-red-900/50 p-3 rounded-lg border border-error mt-4">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-medium text-sm">{error}</p>
                </div>
            )}

            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                    placeholder={apiKey ? "Type your message..." : "Please validate an API Key first"}
                    className="flex-1 p-3 bg-base-300 rounded-lg border border-gray-600 focus:ring-2 focus:ring-brand-secondary"
                    disabled={isLoading || !apiKey}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !apiKey || !input.trim()}
                    className="p-3 bg-brand-primary text-white font-semibold rounded-lg shadow-lg hover:bg-brand-secondary transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    <Send />
                </button>
            </div>
        </div>
    </div>
  );
};

export default ChatInterface;
