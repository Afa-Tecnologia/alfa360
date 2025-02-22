'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Product, useProductStore, Variant } from '@/stores/productStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import SelectTipoProduto from '../estoque/SelectTipo';
import CategoriaListing from '../estoque/CategoriasListing';
import { CurrencyInput } from '../Reusable/CurrencyInput';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';

export default function ProductForm() {
  const { isOpen, editingProductId, closeForm } = useUIStore();
  const {
    products,
    addProduct,
    updateProduct,
    product,
    tipoProduto,
    setTipoProduto,
    setCurrentProduct,
    setSelectedCategoria,
    setSellingPrice,
    sellingPrice,
    setPurchasePrice,
    purchasePrice,
  } = useProductStore();

  const editingProduct = editingProductId
    ? products.find((p) => p.id === editingProductId)
    : null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [variants, setVariants] = useState<Variant[]>([]);
  const [tipo, setTipo] = useState<string>('');
  const [categoria, setCategoria] = useState<number | string>();
  const [sellingPriceLocal, setSellingPriceLocal] = useState<number | string>();
  const [purchasePriceLocal, setPurchasePriceLocal] = useState<
    number | string
  >();
  const [quantity, setQuantity] = useState<number | string>();
  const [brand, setBrand] = useState<string>();

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setVariants(editingProduct.variants);
      setTipo(editingProduct.type);
      setCategoria(editingProduct.categoria_id);
      setSellingPriceLocal(editingProduct.selling_price);
      setPurchasePriceLocal(editingProduct.purchase_price);
      setQuantity(editingProduct.quantity);
      setBrand(editingProduct.brand);
    }
    // } else {
    //   setName('');
    //   setDescription('');
    //   setVariants([]);
    //   setTipo('');
    //   setCategoria(0);
    //   setSellingPriceLocal(0);
    //   setPurchasePriceLocal(0);
    //   setQuantity(0);
    //   setBrand('');
    // }
  }, [editingProduct]);

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: Date.now(), color: '', size: '', stock: 0, images: [] },
    ]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleImageUpload = (index: number, files: FileList | null) => {
    if (!files) return;
    const updatedVariants = [...variants];
    updatedVariants[index].images = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setVariants(updatedVariants);
  };

  const handleChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setDescription(e.target.value);
    setTipo(e.target.value);
    setCategoria(e.target.value);
    setSellingPriceLocal(e.target.value);
    setPurchasePriceLocal(e.target.value);
  };

//   const handleSubmit = () => {
//     const productData: Product = {
//       id: editingProductId || Date.now(),
//       name: product.name,
//       description: product.description,
//       categoria_id: +product.categoria_id,
//       type: product.type || '',
//       selling_price: product.selling_price,
//       purchase_price: product.purchase_price,
//       quantity: product.quantity,
//       brand: product.brand,
//       variants,
//     };

//     addProduct(productData)

//     if (editingProductId) {
//       updateProduct(editingProductId, productData);
//     } else {
//       console.log('Dados do produto criado: ' + JSON.stringify(productData));
//       addProduct(productData);
//     }

//     closeForm();
//   };

  const handleCreateProduct = (e: ChangeEvent<HTMLInputElement>) =>{
    const product:Product = {
        name: name,
        description:description, 
        type: tipo,
        categoria_id: categoria || 0,
    }
    addProduct(product)
  }

  const handleTipoProduto = (tipo:string) =>{
    setTipo(tipo);
  }

  const handleCategoriaProduto = (categoria_id:string | number) =>{
    setCategoria(categoria_id);
  }

  const handleSellingPrice = (value:number) =>{
    setSellingPriceLocal(value)
  }

  const handlePurchasePrice = (value:number) =>{
    setPurchasePrice(value)
  }
  useEffect(() => {
    console.log('PRODUTO ESCOLHIDO: ' + JSON.stringify(product));
  }, [product]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeForm()}>
      <DialogContent className="max-w-2xl max-h-svh overflow-y-auto gap-4">
        <DialogHeader>
          <DialogTitle>
            {editingProductId ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do Produto"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição"
          />

          <SelectTipoProduto onChange={handleTipoProduto}/>
          <CategoriaListing onChange={handleCategoriaProduto}/>
          <CurrencyInput
            label="Preço de Compra"
            onChange={handlePurchasePrice}
            value={purchasePriceLocal || 0}
            
          />
          <CurrencyInput
            label="Preço de Venda"
            onChange={handleSellingPrice}
            value={sellingPriceLocal || 0}
          />
          <ScrollArea className="h-5/6  overflow-y-auto">
            <div className="space-y-3">
              {variants.map((variant: Variant, index) => (
                <Card key={variant.id}>
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>
                      Variante {variant.name} {variant.color} {variant.size}
                    </CardTitle>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeVariant(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Input
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(index, 'color', e.target.value)
                      }
                      placeholder="Cor"
                    />
                    <Input
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(index, 'size', e.target.value)
                      }
                      placeholder="Tamanho"
                    />
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(index, 'stock', Number(e.target.value))
                      }
                      placeholder="Estoque"
                    />
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleImageUpload(index, e.target.files)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={addVariant} className="w-full">
              + Adicionar Variante
            </Button>
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={(e) => {
                handleCreateProduct(product);
                }}
                // disabled={!name || !description || !variants.length}
              >
                {editingProductId ? 'Salvar Alterações' : 'Criar Produto'}
              </Button>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
