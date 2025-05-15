'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Clock,
  Tag,
  CreditCard,
  Receipt,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userService } from '@/services/userService';
import { User as UserType } from '@/types/auth';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import { removeAuthToken, removeRefreshToken } from '@/app/api/auth';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard-v2',
    icon: Home,
  },
  {
    name: 'Vendas',
    href: '/dashboard-v2/vendas',
    icon: ShoppingCart,
  },
  {
    name: 'Estoque',
    href: '/dashboard-v2/estoque',
    icon: Package,
  },
  {
    name: 'Categorias',
    href: '/dashboard-v2/categorias',
    icon: Tag,
  },
  {
    name: 'Caixa',
    href: '/dashboard-v2/caixa',
    icon: CreditCard,
  },
  {
    name: 'Relatórios',
    href: '/dashboard-v2/relatorios',
    icon: BarChart3,
    adminOnly: true,
  },
  {
    name: 'Pedidos',
    href: '/dashboard-v2/pedidos',
    icon: Receipt,
  },
  {
    name: 'Clientes',
    href: '/dashboard-v2/clientes',
    icon: Users,
  },
  {
    name: 'Usuários',
    href: '/dashboard-v2/usuarios',
    icon: User,
    adminOnly: true,
  },
  {
    name: 'Configurações',
    href: '/dashboard-v2/configuracoes',
    icon: Settings,
  },
];

interface SidebarNavigationProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

export function SidebarNavigation({
  isCollapsed,
  toggleSidebar,
  isMobile,
}: SidebarNavigationProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();
  const deleteAuthStorage = useAuthStore((state) => state.deleteAuthStorage);

  // Buscar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storage = localStorage.getItem('auth-storage');
        if (!storage) return;

        const loggedUser = JSON.parse(storage).state?.user;
        if (!loggedUser) return;

        const userData = await userService.getById(loggedUser.id);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async() => {
    await removeAuthToken();
  await  removeRefreshToken();
  redirect('/login');
  };

  // Filtra os itens do menu com base no perfil do usuário
  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user?.perfil === 'admin'
  );

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  // Se for mobile, a sidebar será um drawer
  if (isMobile) {
    return (
      <motion.div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-[#2248a3] dark:bg-[#101010] text-white shadow-xl h-screen ',
          isCollapsed ? 'translate-x-[-100%]' : 'translate-x-0'
        )}
        initial="collapsed"
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex h-16 items-center justify-between  px-4 pt-2">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-xl font-bold">ALFA Manager</span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto py-4 px-4">
          <nav className="space-y-2">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-3 text-sm transition-colors',
                  pathname === item.href
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

{/* footer */}
        <div className="mt-auto  p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-white/60 truncate">
                {user?.email || ''}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex h-screen flex-col bg-[#2248a3] dark:bg-[#101010] text-white"
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex h-16 items-center justify-between  px-4 pt-2">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-bold">ALFA Manager</span>
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-white/10"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5 rotate-180" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="flex flex-col gap-2 px-2">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg transition-colors',
                isCollapsed ? 'justify-center p-3' : 'px-3 py-3',
                pathname === item.href
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className={cn('h-5 w-5', isCollapsed ? '' : 'mr-3')} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto  p-4">
        {isCollapsed ? (
          <div className="flex justify-center">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-white/60 truncate">
                {user?.email || ''}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
