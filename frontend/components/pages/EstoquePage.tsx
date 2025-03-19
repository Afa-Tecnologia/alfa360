// 'use client';
// import React, { use, useEffect, useState } from 'react';
// import { api } from '@/app/api/api';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { useForm } from 'react-hook-form';
// import EstoqueHeader from '../estoque/EstoqueHeadet';
// import { ProductEdit } from '../estoque/ProductEdit';
// import { Variant, IEstoque } from '@/types/estoque';
// import { Product } from '@/types/product';
// import { Product as ProducWithVariants } from '@/types/estoque';
// import { Input } from '../ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../ui/select';
// import { MdOutlineImageNotSupported } from 'react-icons/md';
// import Image from 'next/image';

// import { Label } from '../ui/label';
// import { useProductStore } from '@/stores/createProductStore';
// import { useUtilStore } from '@/stores/utilStore';

// export default function EstoquePage(props: IEstoque) {
//   const [products, setProducts] = useState<ProducWithVariants[]>([]);
//   const [mockProducts, setMockProducts] = useState<ProducWithVariants[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<ProducWithVariants[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   // const [isSheetOpen, setIsSheetOpen] = useState(false);
//   const [isLoading, setIsloading] = useState(true);

//   const [editingProduct, setEditingProduct] = useState<ProducWithVariants | null | any>(
//     null
//   );
//   const [searchQuery, setSearchQuery] = useState('');
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const { _setProducts, productStore, productsStore, setProductStore, setProductsStore, size, tipoProduto } =
//     useProductStore();

//   const {setIsSheetOpen, isSheetOpen} = useUtilStore();

//   const { register, handleSubmit, reset, setValue } = useForm<Variant>({
//     defaultValues: {
//       name: '',
//       type: '',
//       color: '',
//       size: '',
//       quantity: 0,
//       active: true,
//       selling_price: 0,
//     },
//   });

//   // useEffect(() => {
//   //   fetchProducts();
//   //   console.log('produtos'+ mockProducts)
//   // }, []);

//   useEffect(() => {
//     console.log('Tipo de produto:', tipoProduto);
//     console.log('Tamanho:', size);
    
//   }, [tipoProduto, size]);

//   // useEffect(() => {
//   //   filterProducts();
//   // }, [searchQuery, mockProducts]);

//   async function fetchProducts() {
//     const mock:ProducWithVariants[] = [
//       {
//         id:23,
//         name: 'Vestido de ceda longo',
//         description: 'Apenas um vestido longo de ceda',
//         total_stock: 14,
//         brand: 'Lesamis',
//         categoria_id: '1',
//         type: 'roupa',
//         variantes: [
//           {
//             id: 1740021023531,
//             id_product:23,
//             name: 'Vestido de ceda longo Verde P',
//             type: 'roupa',
//             quantity: 7,
//             color: 'Verde',
//             size: 'P',
//             selling_price: 233,
//             image_url:
//               'https://res.cloudinary.com/delwujvnn/image/upload/v1740020978/sxb1vwzatkatfefqhlb9.jpg',
//           },
//         ],

//       },
//       {
//         id:24,
//         name: 'Vestido de cetim',
//         description: 'Apenas um vestido longo de cetim',
//         categoria_id: '1',
//         type: 'roupa',
//         variantes: [
//           {
//             id_product:24,
//             id: 1740021023533,
//             name: 'Vestido de ceda longo Verde P',
//             type: 'roupa',
//             quantity: 7,
//             color: 'Verde',
//             size: 'P',
//             selling_price: 233,
//             image_url:
//               'https://res.cloudinary.com/delwujvnn/image/upload/v1740020978/sxb1vwzatkatfefqhlb9.jpg',
//           },
//           {
//             id: 1740021023539,
//             name: 'Vestido de ceda longo Verde G',
//             type: 'roupa',
//             quantity: 7,
//             color: 'Azul',
//             size: 'G',
//             selling_price: 233,
//             image_url:
//               'https://res.cloudinary.com/delwujvnn/image/upload/v1740020978/sxb1vwzatkatfefqhlb9.jpg',
//           }
//         ],

//       }
//     ];
//     // _setProducts(mock);
//     // setMockProducts(mock)
//     setProductsStore(mock);
//     setIsloading(false);
//     // try {
//     //   const response = await api.get('/produtos');
//     //   setProducts(response.data);
//     //   _setProducts(response.data);
//     //   setIsloading(false);
//     // } catch (error) {
//     //   toast.error('Erro ao carregar produtos.');
//     //   setIsloading(false);
//     // }
//   }

//   useEffect(() => {
//     fetchProducts();
//   }, []);  // Chama a função de mock apenas uma vez quando o componente monta

//   // Log no console para verificar se mockProducts foi atualizado corretamente
//   useEffect(() => {
//     console.log('mockProducts atualizados:', mockProducts);
//     console.log('mockProducts filtrados', filteredProducts);
//     console.log('produtos setados na store'+products)
//   }, [productsStore, filteredProducts]); 

//   useEffect(() => {
//     filterProducts();
//   }, [searchQuery, productsStore]);

//   const filterProducts = () => {
//     const filtered = productsStore.filter((product) =>
//       product.name?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredProducts(filtered)
    
//   };

//   const handleSheet = (product: ProducWithVariants | any) => {
//     setIsSheetOpen(true);
//     if (product === null) {
//       // Se for para criar um novo produto, limpa o produto editado
//       setProductStore({});
//       setEditingProduct({});
//     } else {
//       setProductStore(product);
//       setEditingProduct(product);
//     }
//   };

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(event.target.value);
//   };

//   const handleItemsPerPageChange = (value: number) => {
//     setItemsPerPage(value);
//     setCurrentPage(1);
//   };

//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   return (
//     <div className="container mx-auto p-4">
//       <Card>
//         <EstoqueHeader />
//         <div className="flex p-4">
//           <Button
//             onClick={() => handleSheet(null)} // Passar null para criar um novo produto
//             variant="secondary"
//             className="bg-blue-800 hover:bg-blue-600 text-slate-100 font-semibold"
//           >
//             Criar Produto
//           </Button>
//         </div>
//         <div className="w-full flex p-4 justify-between sm:w-full gap-4">
//           <Input
//             type="text"
//             placeholder="Pesquisar por nome do produto..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="w-full"
//           />
//           <div className="flex flex-col w-full justify-end">
//             <Select
//               value={itemsPerPage.toString()}
//               onValueChange={(value) => handleItemsPerPageChange(Number(value))}
//             >
//               <SelectTrigger className="w-16 text-slate-700">
//                 <SelectValue placeholder="Itens por página" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="10">10</SelectItem>
//                 <SelectItem value="20">20</SelectItem>
//                 <SelectItem value="30">30</SelectItem>
//               </SelectContent>
//             </Select>
//             <Label className=" text-xs text-slate-400"> Itens por página</Label>
//           </div>
//         </div>
//         <CardHeader>
//           <CardTitle className="text-xl font-bold">
//             Gerenciamento de Produtos
//           </CardTitle>
//         </CardHeader>
//         {isLoading ? (
//           'Caregando...'
//         ) : (
//           <CardContent className="cursor-pointer">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4">
//               {paginatedProducts.length > 0 ? (
//                 paginatedProducts.map((product, index) => (
                  
//                   <Card
//                     key={index}
//                     className={`p-4 text-wrap hover:bg-slate-50 flex flex-col justify-center items-center`}
//                   >
//                     <div className=" w-full flex flex-col text-center break-words whitespace-normal justify-center items-center">
//                       {product?.variantes[0]?.image_url ? (
//                         <div>
//                           <Image
//                             src={product?.variantes[0]?.image_url}
//                             alt={product?.name}
//                             width={100}
//                             height={100}
//                             className="h-6/12 object-cover mb-4 rounded-lg"
//                           />{' '}
//                         </div>
//                       ) : (
//                         <MdOutlineImageNotSupported size={100} />
//                       )}
//                       <CardTitle
//                         className=" hover:underline"
//                         onClick={() => handleSheet(product)}
//                       >
//                         {product.name}
//                       </CardTitle>
//                       <CardTitle>{product.selling_price} R$</CardTitle>
//                       <CardDescription>{product.description}</CardDescription>
//                       <CardTitle
//                         className={`
//                          text-sm font-thin
//                         ${product?.total_stock > 2 ? 'text-blue-700' : 'text-red-600'}`}
//                       >
//                         {product.total_stock} em estoque
//                       </CardTitle>
//                     </div>
//                   </Card>
//                 ))
//               ) : (
//                 <p>Não há produtos para exibir.</p>
//               )}
//             </div>
//           </CardContent>
//         )}
//         <div className="flex justify-between p-4">
//           <Button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             Página Anterior
//           </Button>
//           <Button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages}
//           >
//             Próxima Página
//           </Button>
//         </div>
//       </Card>
//       <ProductEdit product={productStore} isOpen={isSheetOpen} />
//     </div>
//   );
// }
