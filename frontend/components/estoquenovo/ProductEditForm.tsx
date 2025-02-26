// // 'use client';

// // import { useState, useEffect, FormEvent } from 'react';

// // import { Product, useProductStore, Variant } from '@/stores/productStore';
// // import { useUIStore } from '@/stores/uiStore';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// // } from '@/components/ui/dialog';
// // import { ScrollArea } from '@/components/ui/scroll-area';
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Trash2 } from 'lucide-react';
// // import SelectTipoProduto from '../estoque/SelectTipo';
// // import CategoriaListing from '../estoque/CategoriasListing';
// // import { CurrencyInput } from '../Reusable/CurrencyInput';
// // import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
// // import ImageUploader from '../estoque/CloudinaryUploader';

// // export default function EditProductForm() {
// //   const { isOpenEdit, editingProductId, closeForm } = useUIStore();
// //   const { products, updateProduct, setCurrentProduct } = useProductStore();

// //   const editingProduct = editingProductId
// //     ? products.find((p) => p.id === editingProductId)
// //     : null;

// //   const [name, setName] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [variants, setVariants] = useState<Variant[]>([]);
// //   const [tipo, setTipo] = useState<string>('');
// //   const [categoria, setCategoria] = useState<number | string>('');
// //   const [sellingPriceLocal, setSellingPriceLocal] = useState<number | string>(
// //     ''
// //   );
// //   const [purchasePriceLocal, setPurchasePriceLocal] = useState<number | string>(
// //     ''
// //   );
// //   const [quantity, setQuantity] = useState<number | string>('');
// //   const [brand, setBrand] = useState<string>('');

// //   useEffect(() => {
// //     if (editingProduct) {
// //       setCurrentProduct(editingProduct);
// //       setName(editingProduct.name);
// //       setDescription(editingProduct.description);
// //       setVariants(editingProduct.variants);
// //       setTipo(editingProduct.type);
// //       setCategoria(editingProduct.categoria_id);
// //       setSellingPriceLocal(editingProduct.selling_price);
// //       setPurchasePriceLocal(editingProduct.purchase_price);
// //       setQuantity(editingProduct.quantity);
// //       setBrand(editingProduct.brand);
// //     }
// //   }, [editingProduct, setCurrentProduct]);

// //   const addVariant = () => {
// //     setVariants([
// //       ...variants,
// //       { id: Date.now(), color: '', name: '', size: '', stock: 0, images: [] },
// //     ]);
// //   };

// //   const updateVariant = (index: number, field: string, value: any) => {
// //     const updatedVariants = [...variants];
// //     updatedVariants[index][field] = value;
// //     setVariants(updatedVariants);
// //   };

// //   const updateVariantImages = (index: number, images: string[]) => {
// //     const updatedVariants = [...variants];
// //     updatedVariants[index].images = images;
// //     setVariants(updatedVariants);
// //   };

// //   const removeVariant = (index: number) => {
// //     setVariants(variants.filter((_, i) => i !== index));
// //   };

// //   const handleCreateProduct = (e: FormEvent) => {
// //     e.preventDefault();
// //     if (!editingProductId) return;

// //     const productEdited: Product = {
// //       id: editingProductId,
// //       name,
// //       description,
// //       type: tipo,
// //       categoria_id: categoria || 0,
// //       brand: brand || '',
// //       selling_price: sellingPriceLocal || 0,
// //       purchase_price: purchasePriceLocal || 0,
// //       quantity: quantity || 0,
// //       variants,
// //     };

// //     console.log('Produto atualizado:', productEdited);
// //     updateProduct(productEdited);
// //     onClickClose();
// //   };

// //   const onClickClose = () => {
// //     setName('');
// //     setDescription('');
// //     setVariants([]);
// //     setCategoria('');
// //     setSellingPriceLocal('');
// //     setPurchasePriceLocal('');
// //     setQuantity('');
// //     setBrand('');
// //     setTipo('');
// //     closeForm();
// //   };

// //   return (
// //     <Dialog open={isOpenEdit} onOpenChange={(open) => !open && onClickClose()}>
// //       <DialogContent className="max-w-2xl max-h-svh overflow-y-auto gap-4">
// //         <DialogHeader>
// //           <DialogTitle>Editar Produto</DialogTitle>
// //         </DialogHeader>
// //         <form onSubmit={handleCreateProduct} className="space-y-4">
// //           <Input
// //             value={name}
// //             onChange={(e) => setName(e.target.value)}
// //             placeholder="Nome do Produto"
// //           />
// //           <Input
// //             value={description}
// //             onChange={(e) => setDescription(e.target.value)}
// //             placeholder="Descrição"
// //           />
// //           <SelectTipoProduto onChange={setTipo} />
// //           <CategoriaListing onChange={setCategoria} initialValue={categoria}/>
// //           <CurrencyInput
// //             label="Preço de Compra"
// //             onChange={setPurchasePriceLocal}
// //             value={purchasePriceLocal || 0}
// //           />
// //           <CurrencyInput
// //             label="Preço de Venda"
// //             onChange={setSellingPriceLocal}
// //             value={sellingPriceLocal || 0}
// //           />
// //           <ScrollArea className="h-5/6 overflow-y-auto">
// //             {variants.map((variant, index) => (
// //               <Card key={variant.id}>
// //                 <CardHeader className="flex justify-between items-center">
// //                   <CardTitle>
// //                     Variante {variant.color} {variant.size}
// //                   </CardTitle>
// //                   <Button
// //                     size="icon"
// //                     variant="destructive"
// //                     onClick={() => removeVariant(index)}
// //                   >
// //                     <Trash2 size={16} />
// //                   </Button>
// //                 </CardHeader>
// //                 <CardContent className="space-y-2">
// //                   <Input
// //                     value={variant.color}
// //                     onChange={(e) =>
// //                       updateVariant(index, 'color', e.target.value)
// //                     }
// //                     placeholder="Cor"
// //                   />
// //                   <Input
// //                     value={variant.size}
// //                     onChange={(e) =>
// //                       updateVariant(index, 'size', e.target.value)
// //                     }
// //                     placeholder="Tamanho"
// //                   />
// //                   <Input
// //                     type="number"
// //                     value={variant.stock}
// //                     onChange={(e) =>
// //                       updateVariant(index, 'stock', Number(e.target.value))
// //                     }
// //                     placeholder="Estoque"
// //                   />
// //                   <ImageUploader imageUrl={variant.images} onUpload={(images) => updateVariantImages(index, images)} />
// //                 </CardContent>
// //               </Card>
// //             ))}
// //             <Button onClick={addVariant} className="w-full">
// //               + Adicionar Variante
// //             </Button>
// //             <div className='flex flex-row gap-4 mt-8'>
// //               <Button type="submit">
// //                 Salvar Alterações
// //               </Button>
// //               <DialogClose asChild>
// //                 <Button variant="outline">Cancelar</Button>
// //               </DialogClose>
// //             </div>
// //           </ScrollArea>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }
// 'use client';

// import { useState, useEffect, FormEvent } from 'react';
// import { Product, useProductStore, Variant } from '@/stores/productStore';
// import { useUIStore } from '@/stores/uiStore';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Trash2 } from 'lucide-react';
// import SelectTipoProduto from './SelectTipo';
// import CategoriaListing from './CategoriasListing';
// import { CurrencyInput } from '../Reusable/CurrencyInput';
// import { DialogClose } from '@radix-ui/react-dialog';
// import ImageUploader from './CloudinaryUploader';
// import { Label } from '../ui/label';
// import { gerarNotificacao } from '@/utils/toast';
// import { api } from '@/app/api/api';

// export default function EditProductForm() {
//   const { isOpenEdit, editingProductId, closeForm } = useUIStore();
//   const { products, updateProduct, setCurrentProduct } = useProductStore();

//   const editingProduct = editingProductId
//     ? products.find((p) => p.id === editingProductId)
//     : null;

//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [variants, setVariants] = useState<Variant[]>([]);
//   const [code, setCode] = useState('');
//   const [tipo, setTipo] = useState<string>('');
//   const [categoria, setCategoria] = useState<number | string>('');
//   const [sellingPriceLocal, setSellingPriceLocal] = useState<number | string>(
//     ''
//   );
//   const [purchasePriceLocal, setPurchasePriceLocal] = useState<number | string>(
//     ''
//   );
//   const [quantity, setQuantity] = useState<number | string>('');
//   const [brand, setBrand] = useState<string>('');

//   useEffect(() => {
//     if (editingProduct) {
//       setCurrentProduct(editingProduct);
//       setName(editingProduct.name);
//       setDescription(editingProduct.description);
//       setVariants(editingProduct.variants);
//       setTipo(editingProduct.type);
//       setCategoria(editingProduct.categoria_id);
//       setSellingPriceLocal(editingProduct.selling_price);
//       setPurchasePriceLocal(editingProduct.purchase_price);
//       setQuantity(editingProduct.quantity);
//       setBrand(editingProduct.brand);
//     }
//   }, [editingProduct, setCurrentProduct]);

//   const addVariant = () => {
//     setVariants([
//       ...variants,
//       {
//         id: Date.now(),
//         color: '',
//         name: '',
//         size: '',
//         stock: 0,
//         images: [],
//         quantity: 0,
//       },
//     ]);
//   };

//   const updateVariant = (index: number, field: string, value: any) => {
//     const updatedVariants = [...variants];
//     updatedVariants[index][field] = value;
//     setVariants(updatedVariants);
//   };

//   const updateVariantImages = (index: number, images: string[]) => {
//     const updatedVariants = [...variants];
//     updatedVariants[index].images = images;
//     setVariants(updatedVariants);
//   };

//   const removeVariant = (index: number) => {
//     setVariants(variants.filter((_, i) => i !== index));
//   };

//   const handleCreateProduct = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!editingProductId) return;

//     const productEdited: Product = {
//       id: editingProductId,
//       name,
//       description,
//       type: tipo,
//       categoria_id: categoria || 0,
//       brand: brand || '',
//       selling_price: sellingPriceLocal || 0,
//       purchase_price: purchasePriceLocal || 0,
//       quantity: quantity || 0,
//       code: code,
//       variants: variants.map((variant) => ({
//         ...variant,
//         images: variant.images || [],
//         type: tipo.trim().toLowerCase(),
//         active: true,
//       })),
//     };

//     console.log('🔍 Produto enviado:', productEdited);

//     try {
//       const response = await api.put(`/produtos/${productEdited.id}`, productEdited);
//       gerarNotificacao('success', response.data.message);
//       updateProduct(response.data.produto);
//       onClickClose();
//     } catch (error) {
//       gerarNotificacao('error', 'Erro ao salvar produto');
//       console.log('❌ Erro na API:', error);
//     }
//   };

//   const onClickClose = () => {
//     setName('');
//     setDescription('');
//     setVariants([]);
//     setCategoria('');
//     setSellingPriceLocal('');
//     setPurchasePriceLocal('');
//     setQuantity('');
//     setBrand('');
//     setTipo('');
//     closeForm();
//   };

//   return (
//     <Dialog open={isOpenEdit} onOpenChange={(open) => !open && onClickClose()}>
//       <DialogContent className="max-w-2xl max-h-svh overflow-y-auto gap-4">
//         <DialogHeader>
//           <DialogTitle>Editar Produto</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleCreateProduct} className="flex flex-col gap-2">
//           <Label className="text-base font-semibold">Nome do Produto:</Label>
//           <Input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="p-4"
//           />
//           <Label className="text-base font-semibold">Descrição:</Label>
//           <Input
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="p-4"
//           />
//           <Label className="text-base font-semibold">Marca:</Label>
//           <Input
//             value={brand}
//             onChange={(e) => setBrand(e.target.value)}
//             className="p-4"
//           />
//           <Label className="text-base font-semibold">Código:</Label>
//           <Input
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             className="p-4"
//           />
//           <SelectTipoProduto
//             onChange={(value) => setTipo(value.trim().toLowerCase())}
//           />
//           <CategoriaListing onChange={setCategoria} />
//           <CurrencyInput
//             label="Preço de Compra"
//             onChange={(value) => setPurchasePriceLocal(value)}
//             value={purchasePriceLocal || 0}
//           />
//           <CurrencyInput
//             label="Preço de Venda"
//             onChange={(value) => setSellingPriceLocal(value)}
//             value={sellingPriceLocal || 0}
//           />

//           <ScrollArea className="h-5/6 overflow-y-auto">
//             {variants.map((variant, index) => (
//               <Card key={index} className="mb-4">
//                 <CardHeader className="flex justify-between items-center">
//                   <CardTitle>
//                     Variante {variant.color} {variant.size}
//                   </CardTitle>
//                   <Button
//                     size="icon"
//                     variant="destructive"
//                     onClick={() => removeVariant(index)}
//                   >
//                     <Trash2 size={16} />
//                   </Button>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <Input
//                       value={`Variante ${variant.color} ${variant.size}`}
//                       onChange={(e) =>
//                         updateVariant(index, 'name', e.target.value)
//                       }
//                       placeholder="Nome da Variante"
//                       readOnly={true}
//                       disabled={true}
//                     />
//                     <Input
//                       value={variant.color}
//                       onChange={(e) =>
//                         updateVariant(index, 'color', e.target.value)
//                       }
//                       placeholder="Cor"
//                     />
//                     <Input
//                       value={variant.size}
//                       onChange={(e) =>
//                         updateVariant(index, 'size', e.target.value)
//                       }
//                       placeholder="Tamanho"
//                     />
//                   </div>
//                   <Input
//                     type="number"
//                     value={variant.quantity}
//                     onChange={(e) =>
//                       updateVariant(index, 'quantity', Number(e.target.value))
//                     }
//                     placeholder="Estoque"
//                   />
//                   <ImageUploader
//                     images={variant.images}
//                     onUpload={(images) => updateVariantImages(index, images)}
//                   />
//                 </CardContent>
//               </Card>
//             ))}
//             <Button onClick={addVariant} className="w-full mb-4" type="button">
//               + Adicionar Variante
//             </Button>
//             <div className="flex flex-row gap-4 mt-8">
//               <Button type="submit">Salvar Alterações</Button>
//               <DialogClose asChild>
//                 <Button variant="outline">Cancelar</Button>
//               </DialogClose>
//             </div>
//           </ScrollArea>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Product, useProductStore, Variant } from '@/stores/productStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import SelectTipoProduto from './SelectTipo';
import CategoriaListing from './CategoriasListing';
import { CurrencyInput } from '../Reusable/CurrencyInput';
import { DialogClose } from '@radix-ui/react-dialog';
import ImageUploader from './CloudinaryUploader';
import { Label } from '../ui/label';
import { gerarNotificacao } from '@/utils/toast';
import { api } from '@/app/api/api';

export default function EditProductForm() {
  const { isOpenEdit, editingProductId, closeForm } = useUIStore();
  const { products, updateProduct, setCurrentProduct } = useProductStore();

  const editingProduct = editingProductId
    ? products.find((p) => p.id === editingProductId)
    : null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [variants, setVariants] = useState<Variant[]>([]);
  const [code, setCode] = useState('');
  const [tipo, setTipo] = useState<string>('');
  const [categoria, setCategoria] = useState<number | string>('');
  const [sellingPriceLocal, setSellingPriceLocal] = useState<number | string>('');
  const [purchasePriceLocal, setPurchasePriceLocal] = useState<number | string>('');
  const [quantity, setQuantity] = useState<number | string>('');
  const [brand, setBrand] = useState<string>('');

  useEffect(() => {
    if (editingProduct) {
      setCurrentProduct(editingProduct);
      setName(editingProduct.name || '');
      setDescription(editingProduct.description || '');
      setVariants(Array.isArray(editingProduct.variants) ? editingProduct.variants : []);
      setTipo(editingProduct.type || '');
      setCategoria(editingProduct.categoria_id || '');
      setSellingPriceLocal(editingProduct.selling_price || '');
      setPurchasePriceLocal(editingProduct.purchase_price || '');
      setQuantity(editingProduct.quantity || '');
      setBrand(editingProduct.brand || '');
      setCode(editingProduct.code || '');
    }
  }, [editingProduct, setCurrentProduct]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now(),
        color: '',
        name: '',
        size: '',
        stock: 0,
        images: [],
        quantity: 0,
      },
    ]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const updateVariantImages = (index: number, images: string[]) => {
    const updatedVariants = [...variants];
    updatedVariants[index].images = images;
    setVariants(updatedVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;

    const productEdited: Product = {
      id: editingProductId,
      name,
      description,
      type: tipo,
      categoria_id: Number(categoria) || 0,
      brand: brand || '',
      selling_price: Number(sellingPriceLocal) || 0,
      purchase_price: Number(purchasePriceLocal) || 0,
      quantity: Number(quantity) || 0,
      code: code,
      variants: variants.map((variant) => ({
        ...variant,
        images: variant.images || [],
        type: tipo.trim().toLowerCase(),
        active: true,
      })),
    };

    console.log('🔍 Produto enviado:', productEdited);

    try {
      const response = await api.put(`/produtos/${productEdited.id}`, productEdited);
      gerarNotificacao('success', response.data.message);
      updateProduct(response.data.produto);
      onClickClose();
    } catch (error: any) {
      console.error('❌ Erro na API:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao salvar produto';
      gerarNotificacao('error', errorMessage);
    }
  };

  const onClickClose = () => {
    setName('');
    setDescription('');
    setVariants([]);
    setCategoria('');
    setSellingPriceLocal('');
    setPurchasePriceLocal('');
    setQuantity('');
    setBrand('');
    setTipo('');
    closeForm();
  };

  return (
    <Dialog open={isOpenEdit} onOpenChange={(open) => !open && onClickClose()}>
      <DialogContent className="max-w-2xl max-h-svh overflow-y-auto gap-4">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateProduct} className="flex flex-col gap-2">
          <Label className="text-base font-semibold">Nome do Produto:</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="p-4" />

          <Label className="text-base font-semibold">Descrição:</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} className="p-4" />

          <Label className="text-base font-semibold">Marca:</Label>
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} className="p-4" />

          <Label className="text-base font-semibold">Código:</Label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} className="p-4" />

          <SelectTipoProduto initialValue={tipo} onChange={(value) => setTipo(value.trim().toLowerCase())} />
          <CategoriaListing initialValue={categoria || ''} onChange={setCategoria} />

          <CurrencyInput label="Preço de Compra" onChange={setPurchasePriceLocal} value={purchasePriceLocal || 0} />
          <CurrencyInput label="Preço de Venda" onChange={setSellingPriceLocal} value={sellingPriceLocal || 0} />

          <ScrollArea className="h-5/6 overflow-y-auto">
            {variants.map((variant, index) => (
              <Card key={index} className="mb-4">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>
                    Variante {variant.color} {variant.size}
                  </CardTitle>
                  <Button size="icon" variant="destructive" onClick={() => removeVariant(index)}>
                    <Trash2 size={16} />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input value={variant.color} onChange={(e) => updateVariant(index, 'color', e.target.value)} placeholder="Cor" />
                  <Input value={variant.size} onChange={(e) => updateVariant(index, 'size', e.target.value)} placeholder="Tamanho" />
                  <ImageUploader images={variant.images || []} onUpload={(images) => updateVariantImages(index, images)} />
                </CardContent>
              </Card>
            ))}
            <Button onClick={addVariant} className="w-full mb-4" type="button">+ Adicionar Variante</Button>
          </ScrollArea>
          <Button type="submit">Salvar Alterações</Button>
          <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
