import { useEffect, useState } from 'react';

export const useScreenDetector = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;
  const isTable = width <= 1024;
  const isDesktop = width > 1024;

  return { isMobile, isTable, isDesktop };
};
