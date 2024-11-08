import { useEffect, useState } from 'react';

type BreakpointKeys = 'isMobile' | 'isTablet' | 'isDesktop' | 'isWidescreen';

type BreakpointValues = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWidescreen: boolean;
};

const breakpoints: Record<BreakpointKeys, string> = {
  isMobile: '(max-width: 639px)',
  isTablet: '(min-width: 640px) and (max-width: 1023px)',
  isDesktop: '(min-width: 1024px) and (max-width: 1279px)',
  isWidescreen: '(min-width: 1280px)',
};

export function useBreakpoint(): BreakpointValues {
  const [breakpointState, setBreakpointState] = useState<BreakpointValues>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isWidescreen: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryLists = Object.keys(breakpoints).map(key => ({
      key: key as BreakpointKeys,
      mql: window.matchMedia(breakpoints[key as BreakpointKeys]),
    }));

    // Function to update state based on active breakpoints
    const updateBreakpointState = () => {
      const newState: BreakpointValues = {
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        isWidescreen: false,
      };

      mediaQueryLists.forEach(({ key, mql }) => {
        if (mql.matches) {
          newState[key] = true;
        }
      });

      setBreakpointState(newState);
    };

    // Initial check
    updateBreakpointState();

    // Event listener for each media query
    const handleChange = () => updateBreakpointState();

    mediaQueryLists.forEach(({ mql }) => mql.addEventListener('change', handleChange));

    // Cleanup listeners on unmount
    return () =>
      mediaQueryLists.forEach(({ mql }) => mql.removeEventListener('change', handleChange));
  }, []);

  return breakpointState;
}
