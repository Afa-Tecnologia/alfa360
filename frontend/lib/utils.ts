import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Constrói uma URL com parâmetros de consulta
 */
export function getUrl(path: string, params?: URLSearchParams): string {
  if (!params || params.toString() === '') {
    return path;
  }

  return `${path}?${params.toString()}`;
}

/**
 * Formata uma data no formato padrão do sistema (dd/mm/yyyy HH:MM)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Limpa os cookies de autenticação e redireciona para a página de login
 * @param returnUrl URL para retornar após o login (opcional)
 */
export function clearAuthAndRedirect(returnUrl?: string): void {
  if (typeof document !== 'undefined') {
    // Limpar cookies de autenticação
    document.cookie =
      'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'jwt_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Limpar localStorage se estiver sendo usado
    localStorage.removeItem('auth_tokens');

    // Redirecionar para login
    if (typeof window !== 'undefined') {
      const redirectUrl = returnUrl
        ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
        : '/login';

      window.location.href = redirectUrl;
    }
  }
}
