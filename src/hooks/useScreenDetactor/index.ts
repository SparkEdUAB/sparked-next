'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

export const useScreenDetector = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [isDeviceMobile, setIsDeviceMobile] = useState(false);

  const handleWindowSizeChange = useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || (window as any).opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsDeviceMobile(mobileRegex.test(userAgent));
    };

    checkMobileDevice();

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

    return {
      isMobile,
      isTablet,
      isDesktop,
      isDeviceMobile,
      isMobileOrMobileDevice: isMobile || isDeviceMobile,
    };
  }, [width, isDeviceMobile]);

  return screenInfo;
};
