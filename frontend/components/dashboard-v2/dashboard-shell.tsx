import { userService } from '@/services/userService';
import DashboardShellClient from './DashboardShellClient';



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

   const user = await userService.getUser();
  
 
  return (
    <DashboardShellClient user={user}>
      {children}
    </DashboardShellClient>
  );
}
