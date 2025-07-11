import { userService } from '@/services/userService';
import DashboardShellClient from './DashboardShellClient';
import { useUserLoader } from '@/hooks/use-user';
import { getFirstAccessiblePath, hasAccess } from '@/lib/auth/route-access';
import { redirect } from 'next/navigation';


interface DashboardShellProps {
  children: React.ReactNode;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: string[];
}

export default async function DashboardShell({ children }: DashboardShellProps) {
  let user = null;

 
    user = await userService.getUser();
  
 
  return (
    <DashboardShellClient user={user}>
      {children}
    </DashboardShellClient>
  );
}
