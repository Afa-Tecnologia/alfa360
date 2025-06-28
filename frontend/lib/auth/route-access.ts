// lib/auth/route-access.ts

export type Role = 'admin' | 'vendedor' | 'gerente' | 'super_admin';

interface NavItem {
  label: string;
  href: string;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', roles: [ 'gerente', 'super_admin'] },
  { label: 'Vendas', href: '/dashboard/vendas', roles: [ 'vendedor', 'super_admin', 'gerente'] },
  { label: 'Caixa', href: '/dashboard/caixa', roles: [ 'vendedor', 'super_admin', 'gerente'] },
  { label: 'Estoque', href: '/dashboard/estoque', roles: ['admin', 'vendedor', 'super_admin', 'gerente'] },
  { label: 'Categorias', href: '/dashboard/categorias', roles: ['admin', 'gerente', 'super_admin'] },
  { label: 'Pedidos', href: '/dashboard/pedidos', roles: ['admin', 'vendedor', 'super_admin', 'gerente'] },
  { label: 'Relatórios', href: '/dashboard/relatorios', roles: ['admin', 'super_admin'] },
  { label: 'Usuários', href: '/dashboard/usuarios', roles: ['admin', 'super_admin'] },
  { label: 'Configurações', href: '/dashboard/configuracoes', roles: ['admin', 'super_admin'] },
];

// Verifica se o usuário tem acesso à rota
export function hasAccess(path: string, role: Role): boolean {
  // Filtra todos os que são prefixo de path
  const matchingItems = NAV_ITEMS.filter(nav => path.startsWith(nav.href));

  if (matchingItems.length === 0) return false;

  // Pega o item com href mais longo, ou seja, o mais específico
  const item = matchingItems.reduce((prev, curr) =>
    curr.href.length > prev.href.length ? curr : prev
  );

  return item.roles.includes(role);
}


// Retorna a primeira rota que o usuário tem permissão
export function getFirstAccessiblePath(role: Role): string | null {
  const item = NAV_ITEMS.find((nav) => nav.roles.includes(role));
  return item?.href || null;
}
