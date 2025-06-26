'use client';

import { useState, useEffect, JSX } from 'react';
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
  LucideProps,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logout } from '@/lib/auth/logout-server';
import type { LucideIcon } from 'lucide-react';
interface SidebarNavigationProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  items: {
    label: string;
    href: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    roles: string[];
  }[];
  userData: any;
}
export interface UserType {
  id: number;
  uuid: string;
  name: string;
  email: string;
  tenant_id: number;
  role: string;
}
export interface GetUserType {
  user: UserType;
}

type NavHref =
  | '/dashboard'
  | '/dashboard/vendas'
  | '/dashboard/estoque'
  | '/dashboard/pedidos'
  | '/dashboard/relatorios'
  | '/dashboard/usuarios'
  | '/dashboard/configuracoes';

const ICONS_MAP: Record<NavHref, LucideIcon> = {
  '/dashboard': Home,
  '/dashboard/vendas': ShoppingCart,
  '/dashboard/estoque': Package,
  '/dashboard/pedidos': ShoppingCart,
  '/dashboard/relatorios': BarChart3,
  '/dashboard/usuarios': Users,
  '/dashboard/configuracoes': Settings,
};

export function SidebarNavigation({
  isCollapsed,
  toggleSidebar,
  isMobile,
  items,
  userData,
}: SidebarNavigationProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    redirect('/login');
  };

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
              <span className="text-xl font-bold">ALFA 360</span>
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
            {items.map((item) => {
            const Icon = ICONS_MAP[item.href as keyof typeof ICONS_MAP];
              return (
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
                  {Icon && (
                    <Icon
                      className={cn('h-5 w-5', isCollapsed ? '' : 'mr-3')}
                    />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* footer */}
        <div className="mt-auto  p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {userData?.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {userData?.user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-white/60 truncate">
                {userData?.user?.email || ''}
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
            <span className="text-xl font-bold">ALFA 360</span>
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
          {items.map((item) => {
            const Icon = ICONS_MAP[item.href as keyof typeof ICONS_MAP];
            return (
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
                {Icon && (
                  <Icon className={cn('h-5 w-5', isCollapsed ? '' : 'mr-3')} />
                )}
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto  p-4">
        {isCollapsed ? (
          <div className="flex justify-center">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {userData?.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {userData?.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {userData?.user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-white/60 truncate">
                {userData?.user?.email || ''}
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
