import { useState, useEffect } from 'react';
import { openRouter } from '../services/openrouter';

export function useOpenRouter() {
  const [state, setState] = useState(openRouter.getState());

  useEffect(() => {
    return openRouter.subscribe(setState);
  }, []);

  return {
    ...state,
    configure: (apiKey) => openRouter.configure(apiKey),
    connect: () => openRouter.connect(),
    disconnect: () => openRouter.disconnect(),
    fetchActivity: () => openRouter.fetchActivity(),
    fetchModels: () => openRouter.fetchModels(),
    logUsage: (...args) => openRouter.logUsage(...args),
  };
}
