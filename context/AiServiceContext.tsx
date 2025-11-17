import React, { createContext, useState, ReactNode } from 'react';

interface AiServiceContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
}

export const AiServiceContext = createContext<AiServiceContextType>({
  apiKey: null,
  setApiKey: () => {},
});

export const AiServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  return (
    <AiServiceContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </AiServiceContext.Provider>
  );
};
