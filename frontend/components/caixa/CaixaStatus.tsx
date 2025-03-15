// import { useCaixaStore } from '@/stores/caixaStore';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { IStatus } from '@/types/auth';


// interface ICaixa {
//   status?: IStatus;
//   valor_inicial?: number;
//   children?: React.ReactElement;
// }
// export function CaixaStatus(props:ICaixa) {
//   const { status } = useCaixaStore();

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Status do Caixa</CardTitle>
//       </CardHeader>
//       <CardContent>
//           {status.isOpen && <p className=" text-green-700 text-2xl">
//             Caixa aberto (ID: ${status.id})
//           </p>}
//           {!status.isOpen && <p className=" text-red-600 text-2xl">Caixa Fechado</p>}
//       </CardContent>
//     </Card>
//   );
// }
