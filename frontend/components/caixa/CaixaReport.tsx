// 'use client';

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// export function CaixaReport() {
//   const { report } = useCaixaStore();

//   if (!report) return [];

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Relatório do Caixa</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-2">
//           <p>
//             <strong>Saldo Inicial:</strong> R${' '}
//             {Number(report.saldo_inicial).toFixed(2)}
//           </p>
//           <p>
//             <strong>Saldo Atual:</strong> R${' '}
//             {Number(report.saldo_final).toFixed(2)}
//           </p>
//           <p>
//             <strong>Total Entradas:</strong> R${' '}
//             {Number(report.total_entradas).toFixed(2)}
//           </p>
//           <p>
//             <strong>Total Saídas:</strong> R${' '}
//             {Number(report.total_saidas).toFixed(2)}
//           </p>
//           <div>
//             <strong>Por Forma de Pagamento:</strong>
//             {/* <ul className="list-disc list-inside">
//               {Object.entries(report.por_forma_pagamento).map(([method, value]) => (
//                 <li key={method}>
//                   {method}: R$ {(value as number).toFixed(2)}
//                 </li>
//               ))}
//             </ul> */}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
