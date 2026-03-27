import { useState, useEffect } from 'react';
import { openClaw } from '../services/openclaw';

export function useOpenClaw() {
  const [state, setState] = useState(openClaw.getState());

  useEffect(() => {
    const unsub = openClaw.subscribe(setState);
    return unsub;
  }, []);

  return {
    ...state,
    connect: () => openClaw.connect(),
    disconnect: () => openClaw.disconnect(),
    configure: (url, key) => openClaw.configure(url, key),
    sendCommand: (cmd, ctx) => openClaw.sendCommand(cmd, ctx),
  };
}
