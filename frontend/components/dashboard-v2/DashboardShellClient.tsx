'use client';

import { useEffect, useState } from 'react';
import { redirect, usePathname } from 'next/navigation';
import { SidebarNavigation } from '@/components/dashboard-v2/sidebar-navigation';
import { Header } from '@/components/dashboard-v2/header';
import { useIsMobile } from '@/hooks/use-mobile';
import { pageTitles } from '@/components/dashboard-v2/page-titles';
import { NavItem } from './dashboard-shell';
import { useUserLoader } from '@/hooks/use-user';
import { useUserDataStore } from '@/stores/use-data-store';
import {
  getFirstAccessiblePath,
  hasAccess,
  Role,
} from '@/lib/auth/route-access';
import { useRouter } from "next/navigation";

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: Role;
}
const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',

    roles: ['admin', 'gerente', 'super_admin'],
  },
  {
    label: 'Vendas',
    href: '/dashboard/vendas',

    roles: ['admin', 'vendedor', 'super_admin', 'gerente'],
  },
  {
    label: 'Caixa',
    href: '/dashboard/caixa',
    roles: ['admin', 'vendedor', 'super_admin', 'gerente'],
  },
  {
    label: 'Estoque',
    href: '/dashboard/estoque',

    roles: ['admin', 'vendedor', 'super_admin', 'gerente'],
  },
  {
    label: 'Etiquetas',
    href: '/dashboard/etiquetas',

    roles: ['admin', 'vendedor', 'super_admin', 'gerente'],
  },
  {
    label: 'Categorias',
    href: '/dashboard/categorias',
    roles: ['admin', 'gerente', 'super_admin'],
  },
  {
    label: 'Clientes',
    href: '/dashboard/clientes',
    

    roles: ['admin', 'super_admin', 'gerente'],
  },
  {
    label: 'Pedidos',
    href: '/dashboard/pedidos',

    roles: ['admin', 'vendedor', 'super_admin', 'gerente'],
  },
  {
    label: 'Relatórios',
    href: '/dashboard/relatorios',

    roles: ['admin', 'super_admin'],
  },
  {
    label: 'Usuários',
    href: '/dashboard/usuarios',
    roles: ['admin', 'super_admin'],
  },
  {
    label: 'Configurações',
    href: '/dashboard/configuracoes',

    roles: ['admin', 'super_admin'],
  },
  
];

interface DashboardShellClientProps {
  children: React.ReactNode;
  user: UserData; // recebido do server
}

export default function DashboardShellClient({
  children,
  user,
}: DashboardShellClientProps) {
  useUserLoader();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const pathname = usePathname();
  const isMobile = useIsMobile();

  const setUser = useUserDataStore((state) => state.setUser);
  const dataUser = useUserDataStore((state) => state.user);
const router = useRouter();
  useEffect(() => {
    const safeSetUser = () => {
      try {
        if (!dataUser && user && user.name && user.email && user.role) {
          setUser({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          });
        }
      } catch (error) {
        console.error('Erro ao tentar setar usuário ', error);
      }
    };
console.log(user);
    safeSetUser();
  }, [user, dataUser, setUser]);

  if (!dataUser) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#2248a3] dark:bg-[#101010]">
        <h1
          className="text-4xl font-extrabold text-white select-none
          animate-pulse
          tracking-widest
          drop-shadow-lg
          "
        >
          Alfa 360
        </h1>
      </div>
    );
  }

const currentPath = pathname; // pega a rota atual
  // 🚨 Impede loop ao entrar na página de acesso negado
  if (pathname === '/dashboard/unauthorized') {
    return (
      <div className="flex flex-1 flex-col rounded-xl md:m-2 bg-background overflow-hidden">
        <main className="flex-1 p-5 pb-8 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  const canAccess = hasAccess(pathname, dataUser.role);

  if (!canAccess) {
    const fallback = getFirstAccessiblePath(dataUser.role);
    if (fallback) {
       router.push('/dashboard/unauthorized?from=' + encodeURIComponent(currentPath));
    } else {
       redirect(`/dashboard/unauthorized?from=${encodeURIComponent(currentPath)}`);
    }
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const title = pageTitles[pathname] || 'Dashboard';
  const filteredMenuItems: NavItem[] = NAV_ITEMS.filter(
    (item) => dataUser?.role && item.roles.includes(dataUser?.role)
  );
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
        items={filteredMenuItems}
        isCollapsed={isMobile ? !isMobileSidebarOpen : isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        userData={dataUser}
        isLoading={false}
      />

      <div className="flex flex-1 flex-col rounded-xl md:m-2 bg-background overflow-hidden">
        <Header
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          title={title}
        />

        <main className="flex-1 p-5 pb-8 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}
