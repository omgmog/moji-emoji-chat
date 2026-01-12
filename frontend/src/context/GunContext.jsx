import { createContext, useContext, useEffect, useState } from 'react';
import Gun from 'gun';
import 'gun/lib/webrtc.js';

const GunContext = createContext(null);

export function GunProvider({ children }) {
  const [gun, setGun] = useState(null);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const gunInstance = Gun({
      peers: [import.meta.env.VITE_GUN_RELAY_URL || 'https://moji-relay.fly.dev/gun']
    });
    setGun(gunInstance);
    setStatus('connected');
  }, []);

  return (
    <GunContext.Provider value={{ gun, status }}>
      {children}
    </GunContext.Provider>
  );
}

export function useGun() {
  return useContext(GunContext);
}
