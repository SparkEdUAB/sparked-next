'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

export const useScreenDetector = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  const handleWindowSizeChange = useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let resizeTimer: NodeJS.Timeout;
    const debouncedResizeHandler = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleWindowSizeChange, 100);
    };

    window.addEventListener('resize', debouncedResizeHandler);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, [handleWindowSizeChange]);

  const screenInfo = useMemo(() => {
    const isMobile = width <= 768;
    const isTablet = width <= 1024;
    const isDesktop = width > 1024;
    const smallerDevices = width <= 420;

    return {
      isMobile,
      isTablet,
      isDesktop,
      isDeviceMobile: smallerDevices,
    };
  }, [width]);

  return screenInfo;
};
