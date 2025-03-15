import { Badge } from '../ui/badge';
import { api } from '@/app/api/api';
import { IStatus } from '@/types/caixa';
import { useEffect, useState } from 'react';

interface IStatusCaixaBadge {
  getStatus?: (value: any) => void
}

export default function StatusCaixaBadge({ getStatus }: IStatusCaixaBadge) {
  const [status, setStatus] = useState<Partial<IStatus>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get('/caixa/status');
        setStatus(data.data); // Atualiza o estado com os dados da API
        if (getStatus) {
          getStatus(data.data); // Passa o status atualizado para o componente pai
        }
      } catch (e) {
        console.log(e);
      }
    };
  
    fetchData();
  }, []); // Adiciona `getStatus` no array de dependências, caso o mesmo mude
  

  return (
    <>
      {status?.status === 'open' && (
        <Badge
          variant="outline"
          className="status-badge bg-green-50 text-green-600 border-green-200"
        >
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-subtle"></span>
          CAIXA ABERTO
        </Badge>
      )}

      {!status?.status && (
        <Badge
          variant="outline"
          className="status-badge bg-red-50 text-red-600 border-red-200"
        >
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle"></span>
          CAIXA FECHADO
        </Badge>
      )}
    </>
  );
}
