import { Badge } from '../ui/badge';
import { api } from '@/app/api/api';
import { IStatus } from '@/types/caixa';
import { useEffect, useState } from 'react';
import { useCaixaStore } from '@/stores/caixa-store';

interface IStatusCaixaBadge {
  getStatus?: (value: any) => void;
}

export default function StatusCaixaBadge({ getStatus }: IStatusCaixaBadge) {
  const [status, setStatus] = useState<Partial<IStatus>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get('/caixa/status');
        setStatus(data.data);
        if (getStatus) {
          getStatus(data.data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [getStatus]);

  if (status?.status === 'aberto') {
    return (
      <Badge
        variant="outline"
        className="status-badge bg-green-50 text-green-600 border-green-200"
      >
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-subtle mr-2"></span>
        CAIXA ABERTO
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="status-badge bg-red-50 text-red-600 border-red-200"
    >
      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle mr-2"></span>
      CAIXA FECHADO
    </Badge>
  );
}
