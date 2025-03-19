// 'use client';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Minus, Plus } from 'lucide-react';
// import { useState } from 'react';
// import { Label } from '../ui/label';
// // import { useProductStore } from '@/stores/createProductStore';

// // Componente reutilizável para a quantidade disponível
// export function QuantityInput({
//   label,
//   value,
//   onChange,
// }: {
//   label: string;
//   value: number;
//   onChange: (newValue: number) => void;
// }) {
//   const {addVariant, variants} = useProductStore();
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value;
//     if (newValue === '') {
//       onChange(0);
//     } else if (!isNaN(Number(newValue))) {
//       onChange(Math.max(0, Number(newValue)));
//     }
//   };

//   return (
//     <div className="flex flex-col gap-1">
//       <Label className="text-sm font-medium">{label}</Label>
//       <div className="flex items-center border rounded-md px-2 py-1.5 w-full justify-between">
//         <Button
//           variant="ghost"
//           size="icon"
//           type="button"
//           onClick={() => onChange(Math.max(0, value - 1))}
//         >
//           <Minus />
//         </Button>
//         <Input
//           type="text"
//           value={value === 0 ? '' : value}
//           onChange={handleInputChange}
//           className="w-16 text-center border-none focus:ring-0 focus:outline-none"
//         />
//         <Button
//           type="button"
//           variant="ghost"
//           size="icon"
//           onClick={() => onChange(value + 1)}
//         >
//           <Plus />
//         </Button>
//       </div>
//     </div>
//   );
// }
