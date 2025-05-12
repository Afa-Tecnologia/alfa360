'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  Tag,
  CreditCard,
} from 'lucide-react';

const actions = [
  {
    title: 'Nova Venda',
    icon: ShoppingCart,
    href: '/dashboard-v2/vendas',
    color:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    description: 'Iniciar uma nova venda',
  },
  {
    title: 'Estoque',
    icon: Package,
    href: '/dashboard-v2/estoque',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    description: 'Gerenciar produtos',
  },
  {
    title: 'Relatórios',
    icon: BarChart3,
    href: '/dashboard-v2/relatorios',
    color:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    description: 'Ver desempenho',
  },
  {
    title: 'Clientes',
    icon: Users,
    href: '/dashboard-v2/clientes',
    color:
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    description: 'Gerenciar clientes',
  },
  {
    title: 'Categorias',
    icon: Tag,
    href: '/dashboard-v2/categorias',
    color:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    description: 'Organizar produtos',
  },
  {
    title: 'Caixa',
    icon: CreditCard,
    href: '/dashboard-v2/caixa',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    description: 'Gerenciar caixa',
  },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col p-3 gap-2 border shadow-sm hover:shadow hover:bg-slate-50 dark:hover:bg-slate-900"
                onClick={() => router.push(action.href)}
              >
                <div className={cn('p-2 rounded-full', action.color)}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground text-center">
                  {action.description}
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
