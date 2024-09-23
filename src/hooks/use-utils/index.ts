'use client';

import { useEffect, useState } from 'react';
import { INTERNET_CONNECTION_EVENTS } from './constants';

const useUtils = () => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener(INTERNET_CONNECTION_EVENTS.ONLINE, handleOnline);
    window.addEventListener(INTERNET_CONNECTION_EVENTS.OFFLINE, handleOffline);

    return () => {
      window.removeEventListener(INTERNET_CONNECTION_EVENTS.ONLINE, handleOnline);
      window.removeEventListener(INTERNET_CONNECTION_EVENTS.OFFLINE, handleOffline);
    };
  }, []);

  return {
    isOnline,
  };
};

export default useUtils;
