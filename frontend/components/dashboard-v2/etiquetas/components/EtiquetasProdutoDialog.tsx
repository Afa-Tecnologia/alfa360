// import React, { useState, useRef } from 'react';
// import { EtiquetaPreview } from './EtiquetaPreview';
// import { ImprimirEtiquetasButton } from './ImprimirEtiquetasButton';
// import { EtiquetaProduto, EtiquetaVariante } from '../types/etiqueta.types';
// import { MultiSelectVariants } from './MultiSelectVariants';

// interface EtiquetasProdutoDialogProps {
//   produto: EtiquetaProduto;
// }

// export default function EtiquetasProdutoDialog({
//   produto,
// }: EtiquetasProdutoDialogProps) {
//   // Configuração dinâmica de etiquetas
//   const [etiquetaWidth, setEtiquetaWidth] = useState(32); // mm
//   const [etiquetaHeight, setEtiquetaHeight] = useState(25); // mm
//   const [colunas, setColunas] = useState(3);
//   // Seleção de variantes e quantidades
//   const [variantesSelecionadas, setVariantesSelecionadas] = useState<
//     EtiquetaVariante[]
//   >([]);
//   const [quantidades, setQuantidades] = useState<Record<number, number>>(() => {
//     const q: Record<number, number> = {};
//     (produto.variants || []).forEach((v) => {
//       q[v.id] = v.quantity;
//     });
//     return q;
//   });
//   const printRef = useRef<HTMLDivElement>(null);

//   // Helpers para seleção
//   const handleSelecionarVariante = (variante: EtiquetaVariante) => {
//     setVariantesSelecionadas((prev) =>
//       prev.some((v) => v.id === variante.id)
//         ? prev.filter((v) => v.id !== variante.id)
//         : [...prev, variante]
//     );
//   };
//   const handleQuantidadeChange = (id: number, value: number) => {
//     setQuantidades((q) => ({ ...q, [id]: value }));
//   };
//   const variantesComQtd = variantesSelecionadas.filter(
//     (v) => (quantidades[v.id] ?? v.quantity) > 0
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-wrap gap-4 items-end mb-4">
//         <div>
//           <label className="block text-xs font-semibold mb-1">
//             Largura (mm)
//           </label>
//           <input
//             type="number"
//             min={10}
//             max={100}
//             value={etiquetaWidth}
//             onChange={(e) => setEtiquetaWidth(Number(e.target.value))}
//             className="border rounded px-2 py-1 w-20"
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-semibold mb-1">
//             Altura (mm)
//           </label>
//           <input
//             type="number"
//             min={10}
//             max={100}
//             value={etiquetaHeight}
//             onChange={(e) => setEtiquetaHeight(Number(e.target.value))}
//             className="border rounded px-2 py-1 w-20"
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-semibold mb-1">Colunas</label>
//           <input
//             type="number"
//             min={1}
//             max={10}
//             value={colunas}
//             onChange={(e) => setColunas(Number(e.target.value))}
//             className="border rounded px-2 py-1 w-20"
//           />
//         </div>
//       </div>
//       <div className="mb-4 w-6/12">
//         <div className="font-semibold mb-2">
//           Selecione as variantes para imprimir:
//         </div>
//         <MultiSelectVariants
//           options={
//             produto.variants?.map((v) => ({ value: v.id, label: v.name })) || []
//           }
//           value={variantesSelecionadas.map((v) => v.id)}
//           onChange={(ids) =>
//             setVariantesSelecionadas(
//               produto.variants.filter((v) => ids.includes(v.id))
//             )
//           }
//           placeholder="Selecione variantes..."
//         />
//       </div>
//       {variantesSelecionadas.length > 0 && (
//         <div className="mb-4">
//           <div className="font-semibold mb-2">
//             Quantidade de etiquetas por variante:
//           </div>
//           <table className="min-w-[400px] border rounded-md bg-background">
//             <thead>
//               <tr className="bg-muted">
//                 <th className="p-2 text-left">Variante</th>
//                 <th className="p-2 text-left">Estoque</th>
//                 <th className="p-2 text-left">Qtd. Etiquetas</th>
//               </tr>
//             </thead>
//             <tbody>
//               {variantesSelecionadas.map((variante) => (
//                 <tr key={variante.id} className="border-t">
//                   <td className="p-2">{variante.name}</td>
//                   <td className="p-2">{variante.quantity}</td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       min={0}
//                       max={variante.quantity}
//                       value={quantidades[variante.id] ?? variante.quantity}
//                       onChange={(e) =>
//                         handleQuantidadeChange(
//                           variante.id,
//                           Number(e.target.value)
//                         )
//                       }
//                       className="w-20 border rounded px-2 py-1"
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       {variantesComQtd.length > 0 && (
//         <div className="mt-4 flex flex-col items-center">
//           <div className="w-full max-h-[30vh] overflow-y-auto flex flex-wrap justify-center gap-2 max-w-[90vw] md:max-w-[700px]">
//             <div
//               ref={printRef}
//               className="w-full flex flex-wrap justify-center gap-2"
//             >
//               <EtiquetaPreview
//                 produtos={[produto]}
//                 variantes={variantesComQtd}
//                 quantidades={quantidades}
//                 etiquetaWidth={etiquetaWidth}
//                 etiquetaHeight={etiquetaHeight}
//               />
//             </div>
//           </div>
//           <div className="mt-4 sticky bottom-0 bg-background z-10 w-full flex justify-center max-w-[90vw] md:max-w-[700px]">
//             <ImprimirEtiquetasButton
//               printRef={printRef as React.RefObject<HTMLDivElement>}
//               etiquetaWidth={etiquetaWidth}
//               etiquetaHeight={etiquetaHeight}
//               colunas={colunas}
//               offsetX={}
//               offsetY={}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
