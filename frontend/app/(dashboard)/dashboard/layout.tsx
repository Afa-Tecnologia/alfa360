// app/dashboard/layout.tsx
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import DashboardShell from '@/components/dashboard-v2/dashboard-shell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={cn(
      'flex min-h-screen h-screen bg-[#2248a3] dark:bg-[#101010] overflow-hidden',
      inter.variable
    )}>
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
