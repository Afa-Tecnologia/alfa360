import * as React from 'react';

const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );
//  const [isCollapsed, setIsCollapsed] = React.useState(false);
//   const [isMobileSideBar, setIsMobileSideBar] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

// export function useIsMobileSideBar() {
//     React.useEffect(() => {
//     const checkMobile = () => {
//       const isSmall = window.innerWidth < 1024;
//       setIsMobileSideBar(isSmall);
//       if (isSmall) setIsCollapsed(true);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);
// }