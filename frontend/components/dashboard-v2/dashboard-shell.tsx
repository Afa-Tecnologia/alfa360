// app/dashboard/layout.tsx (ou onde estiver seu layout)
import { use } from 'react';
import DashboardShellClient from './DashboardShellClient';
import { useUser } from '@/hooks/use-user';

import {
  Home,
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  Settings,
} from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles: string[];
}
const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
   
    roles: ['admin', 'gerente', 'vendedor'],
  },
  {
    label: 'Vendas',
    href: '/dashboard/vendas',
   
    roles: ['admin', 'vendedor'],
  },
  {
    label: 'Estoque',
    href: '/dashboard/estoque',

    roles: ['admin', 'vendedor'],
  },
  {
    label: 'Pedidos',
    href: '/dashboard/pedidos',
  
    roles: ['admin', 'vendedor'],
  },
  {
    label: 'Relatórios',
    href: '/dashboard/relatorios',
    
    roles: ['admin'],
  },
  { label: 'Usuários', href: '/usuarios', roles: ['admin'] },
  {
    label: 'Configurações',
    href: '/dashboard/configuracoes',
  
    roles: ['admin'],
  },
];

export default  function DashboardShell({ children }: DashboardShellProps) {
  const userData = use(useUser()); // hook cacheado que retorna dados do usuário

  // Filtra os itens do menu conforme o papel do usuário
  const filteredMenuItems: NavItem[] = NAV_ITEMS.filter((item) =>
    userData?.user?.role && item.roles.includes(userData.user.role)
  );

  return (
    <DashboardShellClient items={filteredMenuItems} userData={userData}>
      {children}
    </DashboardShellClient>
  );
}
