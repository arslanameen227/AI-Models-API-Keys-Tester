import React, { useState, useCallback, useContext, useEffect } from 'react';
import { TestStatus, Provider } from '../types';
import { verifyApiKey } from '../services/keyVerifier';
import { CheckCircle, XCircle, Loader, KeyRound, ChevronDown } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';
import { AiServiceContext } from '../context/AiServiceContext';


const KeyVerifier: React.FC = () => {
  // Fix: Destructure `providers` directly from context, not from `settings`.
  const { providers } = useContext(SettingsContext);
  const { setApiKey: setActiveApiKey } = useContext(AiServiceContext);

  const [selectedProvider, setSelectedProvider] = useState<Provider | undefined>(providers[0]);
  const [apiKey, setApiKey] = useState('');
  const [testStatus, setTestStatus] = useState<TestStatus>(TestStatus.IDLE);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Reset session key when provider changes
    setActiveApiKey(null);
  }, [selectedProvider, setActiveApiKey]);

  const handleProviderChange = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    setSelectedProvider(provider);
    setTestStatus(TestStatus.IDLE);
    setApiKey('');
  };

  const handleTestKey = useCallback(async () => {
    if (!selectedProvider) {
      setTestStatus(TestStatus.ERROR);
      setMessage('Please select a provider.');
      return;
    }
    if (!apiKey) {
      setTestStatus(TestStatus.ERROR);
      setMessage('API Key cannot be empty.');
      return;
    }

    setTestStatus(TestStatus.TESTING);
    setMessage(`Verifying ${selectedProvider.name} key...`);
    
    // Invalidate session key before test
    setActiveApiKey(null);
    
    const result = await verifyApiKey(selectedProvider, apiKey);

    if (result.valid) {
      setTestStatus(TestStatus.SUCCESS);
      setMessage(`${selectedProvider.name} API Key is valid and active for this session!`);
      // Set the key in context on success
      setActiveApiKey(apiKey);
    } else {
      setTestStatus(TestStatus.ERROR);
      setMessage(result.error || `Invalid ${selectedProvider.name} API Key.`);
    }
  }, [apiKey, selectedProvider, setActiveApiKey]);

  const ResultDisplay = () => {
    if (testStatus === TestStatus.IDLE) return null;

    let icon, colorClass, textColorClass;

    switch (testStatus) {
      case TestStatus.TESTING:
        icon = <Loader className="animate-spin h-6 w-6" />;
        colorClass = 'bg-blue-500/10 border-blue-500';
        textColorClass = 'text-blue-500 dark:text-blue-400';
        break;
      case TestStatus.SUCCESS:
        icon = <CheckCircle className="h-6 w-6" />;
        colorClass = 'bg-green-500/10 border-success';
        textColorClass = 'text-success';
        break;
      case TestStatus.ERROR:
        icon = <XCircle className="h-6 w-6" />;
        colorClass = 'bg-red-500/10 border-error';
        textColorClass = 'text-error';
        break;
      default:
        return null;
    }

    return (
      <div className={`mt-6 p-4 rounded-lg border flex items-center gap-4 transition-all duration-300 ${colorClass}`}>
        <div className={textColorClass}>{icon}</div>
        <p className={`font-medium ${textColorClass}`}>{message}</p>
      </div>
    );
  };
  
  const PageHeader = () => (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold">API Key Verifier</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
        A valid key is required to power the AI tools and content generators (e.g., for the blog and pages).
      </p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <PageHeader />
      
      {!providers || providers.length === 0 ? (
         <div className="bg-base-200-light dark:bg-base-200-dark p-8 rounded-xl shadow-2xl border border-base-300-light dark:border-base-300-dark text-center">
            <h2 className="text-2xl font-bold text-warning">No AI Providers Configured</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Please ask an administrator to add AI providers in the admin panel.</p>
        </div>
      ) : (
        <div className="bg-base-200-light dark:bg-base-200-dark p-6 sm:p-8 rounded-xl shadow-2xl border border-base-300-light dark:border-base-300-dark">
          <div className="space-y-6">
            <div>
              <label htmlFor="provider-select" className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-2">
                AI Provider
              </label>
              <div className="relative">
                {selectedProvider && <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <img src={selectedProvider.logo} alt={`${selectedProvider.name} logo`} className="h-6 w-6 object-contain" />
                </div>}
                <select
                  id="provider-select"
                  value={selectedProvider?.id || ''}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-base-300-light dark:bg-base-300-dark border border-gray-300 dark:border-gray-500 rounded-md appearance-none focus:ring-2 focus:ring-brand-secondary-light dark:focus:ring-brand-secondary-dark"
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {selectedProvider && (
              <div>
                <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="api-key-input"
                    type="password"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setTestStatus(TestStatus.IDLE);
                    }}
                    placeholder={selectedProvider.placeholder}
                    className="w-full pl-10 pr-4 py-3 bg-base-300-light dark:bg-base-300-dark border border-gray-300 dark:border-gray-500 rounded-md focus:ring-2 focus:ring-brand-secondary-light dark:focus:ring-brand-secondary-dark"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleTestKey}
              disabled={testStatus === TestStatus.TESTING || !selectedProvider}
              className="w-full flex justify-center items-center py-3 px-4 bg-brand-primary-light dark:bg-brand-primary-dark text-white font-semibold rounded-md shadow-lg hover:opacity-90 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {testStatus === TestStatus.TESTING ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-3" />
                  Verifying...
                </>
              ) : (
                'Verify Key'
              )}
            </button>
          </div>
          
          <ResultDisplay />
        </div>
      )}
    </div>
  );
};

export default KeyVerifier;