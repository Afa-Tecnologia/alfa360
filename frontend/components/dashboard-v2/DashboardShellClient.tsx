'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarNavigation } from '@/components/dashboard-v2/sidebar-navigation';
import { Header } from '@/components/dashboard-v2/header';
import { useIsMobile } from '@/hooks/use-mobile';
import { pageTitles } from '@/components/dashboard-v2/page-titles';
import { NavItem } from './dashboard-shell';


interface DashboardShellClientProps {
  children: React.ReactNode;
  items: NavItem[];
  userData: any; // tipar conforme seu userData
}

export default function DashboardShellClient({
  children,
  items,
  userData,
}: DashboardShellClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const pathname = usePathname();
  const isMobile = useIsMobile();

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
        items={items}
        isCollapsed={isMobile ? !isMobileSidebarOpen : isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        userData={userData}
      />

      <div className="flex flex-1 flex-col rounded-xl md:m-2 bg-background overflow-hidden">
        <Header toggleSidebar={toggleSidebar} isMobile={isMobile} title={title} />

        <main className="flex-1 p-5 pb-8 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </>
  );
}
