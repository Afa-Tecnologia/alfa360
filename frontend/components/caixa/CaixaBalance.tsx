// import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { useEffect, useState } from 'react';
// import { caixaService } from '@/utils/caixaService';
// import { IReports, IStatus } from '@/types/caixa';
// import { gerarNotificacao } from '@/utils/toast';

// interface ICaixaBalance {
//   status: IStatus;
// }
// export default function CaixaBalance({ status }: ICaixaBalance) {
//   const [balance, setBalance] = useState<IReports | any>([]);

//   const fetchBalance = async () => {
//     try {
//       console.log('no balance ' + JSON.stringify(status));
//       const response = await caixaService.getCaixaReport(status.id);
//       setBalance(response);
//     } catch (e: any) {
//       console.log(e);
//       gerarNotificacao('error', e.response?.data?.message);
//     }
//   };

//   useEffect(() => {
//     fetchBalance()
//   }, []);

//   return (
//    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Balanço Atual</CardTitle>
//           <DollarSign className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">
//             R$ {Number(balance.total_entradas) - Number(balance.total_saidas)}
//           </div>
//           <p className="text-xs text-muted-foreground">ID Do caixa: $2</p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">
//             Total de Entradas
//           </CardTitle>
//           <TrendingUp className="h-4 w-4 text-green-500" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-green-500">
//             R$ {Number(balance.total_entradas)}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
//           <TrendingDown className="h-4 w-4 text-red-500" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold text-red-500">
//             R$ {Number(balance.total_saidas)}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useEffect, useState } from 'react';
import { caixaService } from '@/utils/caixaService';
import { IReports, IStatus } from '@/types/caixa';
import { gerarNotificacao } from '@/utils/toast';
import { Skeleton } from '../ui/skeleton';// Importando o Skeleton

interface ICaixaBalance {
  status: IStatus;
}

export default function CaixaBalance({ status }: ICaixaBalance) {
  const [balance, setBalance] = useState<IReports | any>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar o carregamento

  const fetchBalance = async () => {
    try {
      console.log('no balance ' + JSON.stringify(status));
      const response = await caixaService.getCaixaReport(status.id);
      setBalance(response);
      setLoading(false); // Dados carregados, define como false
    } catch (e: any) {
      console.log(e);
      gerarNotificacao('error', e.response?.data?.message);
      setLoading(false); // Em caso de erro, também define como false
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [status]); // Atualiza quando o status mudar

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balanço Atual</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-32 bg-muted" />
          ) : (
            <div className="text-2xl font-bold">
              R$ {Number(balance.total_entradas) - Number(balance.total_saidas)}
            </div>
          )}
          <p className="text-xs text-muted-foreground">ID Do caixa: {status.id}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Entradas
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-32 bg-muted" />
          ) : (
            <div className="text-2xl font-bold text-green-500">
              R$ {Number(balance.total_entradas)}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-32 bg-muted" />
          ) : (
            <div className="text-2xl font-bold text-red-500">
              R$ {Number(balance.total_saidas)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

