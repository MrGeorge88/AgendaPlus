import { useState, useEffect } from 'react';

/**
 * Hook para detectar media queries
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Establecer el valor inicial
    setMatches(media.matches);

    // Crear el listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Agregar el listener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback para navegadores más antiguos
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
};

/**
 * Hooks predefinidos para breakpoints comunes
 */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
export const useIsSmallScreen = () => useMediaQuery('(max-width: 640px)');
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1280px)');

/**
 * Hook para obtener información detallada del viewport
 */
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Establecer valores iniciales
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...viewport,
    isMobile: viewport.width <= 768,
    isTablet: viewport.width > 768 && viewport.width <= 1024,
    isDesktop: viewport.width > 1024,
    isSmall: viewport.width <= 640,
    isLarge: viewport.width >= 1280,
  };
};

/**
 * Hook para detectar orientación del dispositivo
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    // Establecer valor inicial
    handleOrientationChange();

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
};

/**
 * Hook para detectar si el dispositivo soporta touch
 */
export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
};
