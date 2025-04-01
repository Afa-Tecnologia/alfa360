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
  Building2,
  ChefHat,
  Receipt,
  PanelRight,
  ShoppingBasket,
  Users2,
  TagIcon,
  LayoutDashboard,
  ReceiptText,
  FileCog,
  User,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { userService } from '@/services/userService';

const HideSession = process.env.NEXT_PUBLIC_CLOUDINARY_HIDE_SESSION === 'true';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navItems, setNavItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storage = localStorage.getItem('auth-storage');
        if (!storage) return;

        const loggedUser = JSON.parse(storage).state?.user;
        if (!loggedUser) return;

        const user = await userService.getById(loggedUser.id);

        setNavItems([
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

              ...(user?.perfil === 'admin'
                ? [
                    {
                      title: 'Relatórios',
                      url: '/dashboard/relatorios',
                    },
                    {
                      title: 'Despesas',
                      url: '/dashboard/despesas',
                    },
                  ]
                : []),
              {
                title: 'Pedidos',
                url: '/dashboard/pedidos',
              },
              {
                title: 'Clientes',
                url: '/dashboard/clientes',
              },
              ...(user?.perfil === 'admin'
                ? [
                    {
                      title: 'Usuários do Sistema',
                      url: '/dashboard/usuarios',
                    },
                  ]
                : []),
            ],
          },
          ...(HideSession
            ? []
            : [
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
              ]),
        ]);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

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
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
