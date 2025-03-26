'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PackageSearch,
  PieChart,
  Settings2,
  SquareTerminal,
  Store,
  House,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useSearchParams } from 'next/navigation';
import { url } from 'inspector';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'LesAmis',
      logo: GalleryVerticalEnd,
      plan: 'Premium',
      url: '/dashboard',
    },
  ],
  navMain: [
    {
      title: 'Loja',
      url: '/dashboard',
      icon: House,
      isActive: true,
      items: [
        {
          title: 'Vendas',
          url: '/dashboard/vendas',
        },
        {
          title: 'Estoque',
          url: '/dashboard/estoque',
        },
        {
          title: 'Categorias',
          url: '/dashboard/categorias',
        },
        {
          title: 'Caixa',
          url: '/dashboard/caixa',
        },
        {
          title: 'Sangria',
          url: '#'
        },
        {
          title: 'Pedidos',
          url: '/dashboard/pedidos',
        },
        {
          title: 'Clientes',
          url: '/dashboard/clientes',
        },
        {
          title: 'Relatórios',
          url: '/dashboard/relatorios',
        }
      ],
    },
    {
      title: 'Ecommerce',
      url: '/dashboard/ecommerce-admin',
      icon: Store,
      isActive: true,
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard/ecommerce-admin',
        },
        {
          title: 'Pedidos',
          url: '/dashboard/ecommerce-admin/pedidos',
        },
        {
          title: 'Produtos',
          url: '/dashboard/ecommerce-admin/produtos',
        },
        {
          title: 'Estoque',
          url: '/dashboard/ecommerce-admin/estoque',
        },
        {
          title: 'Envios',
          url: '/dashboard/ecommerce-admin/envios',
        },
        {
          title: 'Clientes',
          url: '/dashboard/ecommerce-admin/clientes',
        },
        {
          title: 'Relatórios',
          url: '/dashboard/ecommerce-admin/relatorios',
        },
        {
          title: 'Configurações',
          url: '/dashboard/ecommerce-admin/configuracoes',
        },
      ],
    },
    {
      title: 'Configurações',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Configurações da loja',
          url: '#',
        },
        {
          title: 'Usuários do Sistema',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathRoute = useSearchParams();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
