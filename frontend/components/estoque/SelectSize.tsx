// import React, { useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { SIZE_CLOTHE, SIZE_SHOES } from '@/types/constants';
// import { useProductStore } from '@/stores/createProductStore';
// import { Check } from 'lucide-react';

// interface SizeSelectorsProps {
//   tipo_produto: string | null;
// }

// export default function SizeSelectors({ tipo_produto }: SizeSelectorsProps) {
//   const sizes = tipo_produto === 'roupa' ? SIZE_CLOTHE : SIZE_SHOES;
//   const title = tipo_produto === 'roupa' ? 'Tamanhos da Peça' : 'Tamanhos de Sapatos';
//   const { setSize, size } = useProductStore();

//   const handleSizeClick = (selectedSize: string) => {
//     setSize(selectedSize === size ? '' : selectedSize);
//   };

//   useEffect(() => {
//     setSize('');
//   }, [tipo_produto]);

//   return (
//     <div className='flex flex-col gap-4 mb-4'>
//       <h2 className="text-base font-semibold">{title}</h2>
//       <div className="flex flex-wrap">
//         {sizes.map((sizeOption) => {
//           const isSelected = size === sizeOption;
//           return (
//             <Button
//               key={sizeOption}
//               variant="outline"
//               onClick={() => handleSizeClick(sizeOption)}
//               className={`relative flex items-center justify-center mx-1 my-1 
//                 ${isSelected ? 'border-2 border-green-500' : ''}`}
//               aria-selected={isSelected}
//             >
//               {sizeOption}
//               {isSelected && <Check className="text-green-500 w-4 h-4 absolute top-0 right-0 m-1" />}
//             </Button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
