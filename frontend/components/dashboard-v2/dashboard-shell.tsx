'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarNavigation } from '@/components/dashboard-v2/sidebar-navigation';
import { Header } from '@/components/dashboard-v2/header';
import { pageTitles } from '@/components/dashboard-v2/page-titles';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const isSmall = window.innerWidth < 1024;
      setIsMobile(isSmall);
      if (isSmall) setIsCollapsed(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const title = pageTitles[pathname] || 'Dashboard';

  return (
    <>
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <SidebarNavigation
        isCollapsed={isMobile ? !isMobileSidebarOpen : isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      <div className="flex flex-1 flex-col md:rounded-xl md:m-2 bg-background overflow-hidden">
        <Header
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          title={title}
        />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}
