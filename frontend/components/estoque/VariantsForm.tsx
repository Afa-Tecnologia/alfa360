// import { useProductStore } from '@/stores/createProductStore';
// import { Product } from '@/types/product';
// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { FaRegTrashAlt } from 'react-icons/fa';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from '@/components/ui/tooltip';
// import Image from 'next/image';
// import { MdOutlineImageNotSupported } from 'react-icons/md';
// import { HiPencilAlt } from 'react-icons/hi';
// import { Variant } from '@/types/estoque';
// import { useUtilStore } from '@/stores/utilStore';
// import ModalEditVariant from './ModalEditVariant';

// export default function VariantsForm() {
//   const {
//     variants,
//     addVariant,
//     removeVariant,
//     variant,
//     setVariant,
//     productStore,
//     setProductStore,
//   } = useProductStore();

//   const { setIsDialogOpen } = useUtilStore();
//   const [newVariant, setNewVariant] = useState({
//     name: '',
//     color: '',
//     size: '',
//     price: 0,
//     selling_price: 0,
//     stock: 0,
//     type: '',
//     active: false,
//   });

//   const [mock, setMock] = useState([
//     {
//       id: 1,
//       name: 'Camiseta Básica',
//       color: 'Preto',
//       size: 'M',
//       price: 49.9,
//       selling_price: 59.9,
//       quantity: 10,
//       type: 'Roupas',
//       active: true,
//       image_url:
//         'https://res.cloudinary.com/delwujvnn/image/upload/v1738611469/cld-sample-5.jpg',
//     },
//     {
//       id: 2,
//       name: 'Calça Jeans Slim',
//       color: 'Azul Claro',
//       size: '42',
//       price: 129.9,
//       selling_price: 149.9,
//       quantity: 5,
//       active: true,
//       image_url:
//         'https://res.cloudinary.com/delwujvnn/image/upload/v1738611469/cld-sample-4.jpg',
//     },
//     {
//       id: 3,
//       name: 'Tênis Esportivo',
//       color: 'Branco',
//       size: '41',
//       price: 199.9,
//       selling_price: 249.9,
//       quantity: 8,
//       active: true,
//       image_url:
//         'https://res.cloudinary.com/delwujvnn/image/upload/v1738611469/cld-sample-6.jpg',
//     },
//   ]);

//   const removeMock = (id: number | any) => {
//     // setMock((prevMock) => prevMock.filter((item) => item.id !== id));
//     removeVariant(id);
//   };
//   const handleAddVariant = () => {
//     if (
//       !newVariant.color ||
//       !newVariant.size ||
//       !newVariant.price ||
//       !newVariant.stock
//     ) {
//       alert('Preencha todos os campos');
//       return;
//     }

//     addVariant({ ...newVariant, id: Date.now() }); // Gerando um ID único
//     setNewVariant({
//       color: '',
//       size: '',
//       price: 0,
//       stock: 0,
//       active: false,
//       name: '',
//       type: '',
//       selling_price: 0,
//     });
//   };

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   const response = await fetch('http://127.0.0.1:8000/api/products', {
//   //     method: 'POST',
//   //     headers: { 'Content-Type': 'application/json' },
//   //     body: JSON.stringify({
//   //       name: productStore.name,
//   //       selling_price: productStore.selling_price,
//   //       purchase_price: productStore.purchase_price,
//   //       variants: variants.map((v) => ({
//   //         color: v.color,
//   //         size: v.size,
//   //         price: v.selling_price,
//   //         quantity: v.quantity,
//   //       })),
//   //     }),
//   //   });

//   //   const data = await response.json();
//   //   console.log('Produto criado:', data);
//   // };

//   const handleEditVariantInDialog = (variant: Variant) => {
//     setVariant(variant);
//     setIsDialogOpen(true)
//   };

//   return (
//     <Card className="shadow-lg rounded-xl p-4 bg-white">
//       <CardHeader>
//         <CardTitle className="text-lg font-semibold text-gray-800">
//           Variantes do Produto
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {variants?.length > 0 ? (
//           <div className="space-y-3">
//             {variants?.map((variant) => (
//               <div
//                 key={variant.id}
//                 className="flex p-3 bg-gray-100 rounded-lg shadow-sm flex-col text-xs gap-1 mb-4 break-words"
//               >
//                 <div>
//                   <p className="text-sm mb-6 font-semibold">
//                     {`${variant.name} - ${variant.color} - ${variant.size}`}
//                   </p>
//                 </div>
//                 <div className="flex flex-row gap-1">
//                   <p className="text-gray-800">Cor:</p> <b>{variant.color}</b>
//                   <p className="text-gray-800">Tamanho:</p>
//                   <b>{variant.size}</b>
//                 </div>
//                 <div className="flex flex-row gap-1">
//                   <p className="text-gray-800">Preço:</p> R$
//                   <b>{variant?.selling_price?.toFixed(2)}</b>
//                   <p className="text-gray-800">Estoque:</p>
//                   <b>{variant.quantity}</b>
//                 </div>
//                 <div className="relative">
//                   {variant.image_url ? (
//                     <div
//                       className="absolute right-0 bottom-0 bg-cover w-14 h-14 border-2 border-blue-500 border-dashed rounded-sm "
//                       style={{ backgroundImage: `url(${variant.image_url})` }}
//                     />
//                   ) : (
//                     <MdOutlineImageNotSupported
//                       size={50}
//                       className="absolute right-0 bottom-0"
//                     />
//                   )}
//                 </div>
//                 <div className='flex gap-2'>
//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger>
//                         <FaRegTrashAlt
//                           size={16}
//                           className=" text-red-600 cursor-pointer"
//                           onClick={() => removeMock(variant.id ? +variant.id : 0)}
//                         />
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>Deletar variante</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>

//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger>
//                         <div>
//                           <HiPencilAlt
//                             size={18}
//                             onClick={() => handleEditVariantInDialog(variant)}
//                             className=" text-green-700 cursor-pointer"
//                           />
//                         </div>
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>Editar variante</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>
//                   <ModalEditVariant />
//                 </div>
//               </div>
//             ))}
//           </div>
          
//         ) : (
//           <p className="text-gray-500 text-center mt-4">
//             Nenhuma variante adicionada.
//           </p>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
