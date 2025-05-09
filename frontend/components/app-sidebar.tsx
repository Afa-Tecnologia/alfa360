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
  Settings,
  CircleUserRound
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
import { User as UserType } from '@/types/auth';

const HideSession = process.env.NEXT_PUBLIC_CLOUDINARY_HIDE_SESSION === 'true';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navItems, setNavItems] = React.useState<any[]>([]);
  const [user, setUser] = React.useState<UserType>({id:0, name: '', email:'', perfil:''});

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storage = localStorage.getItem('auth-storage');
        if (!storage) return;

        const loggedUser = JSON.parse(storage).state?.user;
        if (!loggedUser) return;

        const user = await userService.getById(loggedUser.id);
        setUser(user)

        setNavItems([
          {
            title: 'Loja',
            url: '/dashboard',
            icon: House,
            isActive: true,
            items: [
              {
                title: 'Vender',
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
          {
            title: 'Configurações do PDV',
            url: '/dashboard',
            icon: Settings,
            isActive: true,
            items: [
              {
                title: 'Métodos de Pagamento',
                url: '/dashboard/metodos-pagamento',
              }
            ],
          },
        ]);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  const data = {
    user: {
      name: user?.name,
      email: user?.email,
      avatar: '',
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
