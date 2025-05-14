'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import '../globals.css';
import { SidebarNavigation } from '@/components/dashboard-v2/sidebar-navigation';
import { Header } from '@/components/dashboard-v2/header';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import { getAuthToken } from '../api/auth';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const pageTitles: Record<string, string> = {
  '/dashboard-v2': 'Dashboard',
  '/dashboard-v2/vendas': 'Vendas',
  '/dashboard-v2/estoque': 'Estoque',
  '/dashboard-v2/categorias': 'Categorias',
  '/dashboard-v2/caixa': 'Caixa',
  '/dashboard-v2/relatorios': 'Relatórios',
  '/dashboard-v2/pedidos': 'Pedidos',
  '/dashboard-v2/clientes': 'Clientes',
  '/dashboard-v2/usuarios': 'Usuários',
  '/dashboard-v2/configuracoes': 'Configurações',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  

  // Verificar autenticação
  useEffect(() => {
    async function checkAuth() {
      const token = await getAuthToken();
      if (!token) {
        router.push('/login');
      }
    }
    checkAuth();
  }, []);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    // Checar no carregamento inicial
    checkMobile();

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkMobile);

    // Limpar listener ao desmontar
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
    <div className={cn('flex min-h-screen h-screen bg-background overflow-hidden', inter.variable)}>
      {/* Overlay para quando o menu mobile estiver aberto */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - desktop ou mobile */}
      <SidebarNavigation
        isCollapsed={isMobile ? !isMobileSidebarOpen : isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          title={title}
        />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
