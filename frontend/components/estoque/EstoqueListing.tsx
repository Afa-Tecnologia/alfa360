// 'use client';
// import { useEffect, useState } from 'react';
// import { api } from '@/app/api/api';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Dialog, DialogContent } from '@/components/ui/dialog';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';
// import { Product } from '@/types/product';
// import NoData from '../Semdados/NoData';
// import CategoriaListing from './CategoriasListing';
// import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
// import { Spinner } from '../spinner/Spinner';

// export default function EstoqueListing() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [selectedCategoria, setSelectedCategoria] = useState<any>(null);
//   const [isLoading, setIsloading] = useState(true);

//   const { register, handleSubmit, reset, setValue } = useForm<
//     Omit<Product, 'id'>
//   >({
//     defaultValues: {
//       name: '',
//       description: '',
//       purchase_price: 0,
//       selling_price: 0,
//       quantity: 0,
//       categoria_id: undefined,
//     },
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleSelectCategoria = (categoria: string) => {
//     setSelectedCategoria(categoria);
//     console.log('Categoria selecionada:', categoria);
//   };
//   async function fetchProducts() {
//     try {
//       const response = await api.get('/produtos');
//       setProducts(response.data);
//       setIsloading(false);
//     } catch (error) {
//       toast.error('Erro ao carregar produtos.');
//       setIsloading(false);
//     }
//   }

//   async function handleCreateOrUpdateProduct(data: Omit<Product, 'id'>) {
//     try {
//       if (editingProduct) {
//         await api.put(`/produtos/${editingProduct.id}`, data);
//         toast.success('Produto atualizado com sucesso!');
//       } else {
//         await api.post('/produtos', data);
//         toast.success('Produto criado com sucesso!');
//       }
//       setIsDialogOpen(false);
//       reset();
//       fetchProducts();
//     } catch (error) {
//       toast.error('Erro ao salvar produto.');
//     }
//   }

//   async function handleDeleteProduct(id: number) {
//     try {
//       await api.delete(`/produtos/${id}`);
//       toast.success('Produto excluído com sucesso!');
//       fetchProducts();
//     } catch (error) {
//       toast.error('Erro ao excluir produto.');
//     }
//   }

//   function openEditDialog(product: Product) {
//     setEditingProduct(product);
//     setIsDialogOpen(true);
//     Object.entries(product).forEach(([key, value]) =>
//       setValue(key as keyof Product, value)
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-xl font-bold">
//             Gerenciamento de Produtos
//           </CardTitle>
//         </CardHeader>

//         {isLoading ? (
//           <Spinner />
//         ) : (
//           <CardContent>
//             <Button
//               onClick={() => {
//                 setEditingProduct(null);
//                 setIsDialogOpen(true);
//                 reset();
//               }}
//               className="mb-4"
//             >
//               Novo Produto
//             </Button>
//             {products.length > 0 ? (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Nome</TableHead>
//                     <TableHead>Descrição</TableHead>
//                     <TableHead>Preço Compra</TableHead>
//                     <TableHead>Preço Venda</TableHead>
//                     <TableHead>Quantidade</TableHead>
//                     <TableHead>Categoria</TableHead>
//                     <TableHead>Ações</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {products.map((product) => (
//                     <TableRow key={product.id}>
//                       <TableCell>{product.name}</TableCell>
//                       <TableCell>{product.description}</TableCell>
//                       <TableCell>
//                         {product.purchase_price.toFixed(2)} R$
//                       </TableCell>
//                       <TableCell>
//                         {product.selling_price.toFixed(2)} R$
//                       </TableCell>
//                       <TableCell>{product.quantity}</TableCell>
//                       <TableCell>{product.categoria?.name}</TableCell>
//                       <TableCell>
//                         <Button onClick={() => openEditDialog(product)}>
//                           Editar
//                         </Button>
//                         <Button
//                           onClick={() => handleDeleteProduct(product.id)}
//                           className="ml-2"
//                           variant="destructive"
//                         >
//                           Excluir
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             ) : (
//               <NoData name="Produto" />
//             )}
//           </CardContent>
//         )}
//       </Card>

//       {/* Dialog for Creating/Editing Product */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogTitle className=" font-bold">
//             {' '}
//             (Criar / Editar) Produtos do Estoque
//           </DialogTitle>
//           <DialogDescription className=" text-sm text-slate-500">
//             Forneça as informações necessárias para o cadastro do produto.
//           </DialogDescription>
//           <form onSubmit={handleSubmit(handleCreateOrUpdateProduct)}>
//             <div className="mb-4">
//               <label className="block font-medium mb-1">Nome</label>
//               <input
//                 className="w-full border p-2"
//                 {...register('name')}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block font-medium mb-1">Descrição</label>
//               <input
//                 className="w-full border p-2"
//                 {...register('description')}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block font-medium mb-1">Preço de Compra</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 className="w-full border p-2"
//                 {...register('purchase_price')}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block font-medium mb-1">Preço de Venda</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 className="w-full border p-2"
//                 {...register('selling_price')}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block font-medium mb-1">Quantidade</label>
//               <input
//                 type="number"
//                 className="w-full border p-2"
//                 {...register('quantity')}
//                 required
//               />
//             </div>
//             <CategoriaListing selectCategoria={handleSelectCategoria} />
//             <div className="flex justify-end mt-4">
//               <Button type="submit">Salvar</Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
