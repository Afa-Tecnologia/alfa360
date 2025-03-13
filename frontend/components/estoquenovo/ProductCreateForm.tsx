'use client'
import { useState, FormEvent, useEffect } from 'react';
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
import { api } from '@/app/api/api';
import { gerarNotificacao } from '@/utils/toast';
import { revalidatePath } from 'next/cache';

interface ICreateProductForm {
  fetchProducts?: () => void
}
export default function CreateProductForm(props:ICreateProductForm) {
  const { isOpenCreate, closeForm } = useUIStore();
  const { addProduct, setCurrentProduct, setProducts, products } = useProductStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [variants, setVariants] = useState<Variant[]>([]);
  const [tipo, setTipo] = useState<string>('');
  const [categoria, setCategoria] = useState<number | string>('');
  const [sellingPriceLocal, setSellingPriceLocal] = useState<number | string>('');
  const [purchasePriceLocal, setPurchasePriceLocal] = useState<number | string>('');
  const [quantity, setQuantity] = useState<number | string>('');
  const [brand, setBrand] = useState<string>('');

  useEffect(() =>{
    console.log('produtos na store '+ JSON.stringify(products))
  },[products])

  const addVariant = () => {
    setVariants([
      ...variants,
      { 
        id: Date.now(),
        color: '', 
        size: '', 
        stock: 0, 
        images: [], 
        name: '',
        quantity: 0 
      },
    ]);
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const updateVariantImages = (variantId: number, images: string[]) => {
    const variantIndex = variants.findIndex(v => v.id === variantId);
    if (variantIndex === -1) return;
    
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images = images;
    setVariants(updatedVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleCreateProduct = async (e: FormEvent) => {
    e.preventDefault();

    const product: Product = {
      name: name.trim(),
      description: description.trim(),
      type: tipo.trim().toLowerCase(),
      categoria_id: Number(categoria) || 0,
      brand: brand?.trim() || '',
      selling_price: Number(sellingPriceLocal) || 0,
      purchase_price: Number(purchasePriceLocal) || 0,
      quantity: Number(quantity) || 0,
      code: code,
      variants: variants.map((variant) => ({
        ...variant,
        name: `${name} ${variant.color} ${variant.size}`,
        images: variant.images || [],
        type: tipo.trim().toLowerCase(),
        active: true,
      })),
    };

    try {
      const response = await api.post('/produtos', product);

      gerarNotificacao('success', response.data.message);
      addProduct(product);
      onClickClose();
      closeForm();
    } catch (error) {
      gerarNotificacao('error', 'Falha ao criar produto');
      console.error('Erro ao criar produto:', error);
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
    setCode('');
    setCurrentProduct({} as Product);
    closeForm();
  };

  return (
    <Dialog open={isOpenCreate} onOpenChange={(open) => !open && onClickClose()}>
      <DialogContent className="max-w-2xl max-h-svh overflow-y-auto gap-4">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateProduct} className="flex flex-col gap-2">
          <Label className="text-base font-semibold">Nome do Produto:</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4"
          />
          <Label className="text-base font-semibold">Descrição:</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-4"
          />
          <Label className="text-base font-semibold">Marca:</Label>
          <Input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="p-4"
          />
          <Label className="text-base font-semibold">Código:</Label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="p-4"
          />
          <SelectTipoProduto onChange={(value) => setTipo(value.trim().toLowerCase())} />
          <CategoriaListing onChange={setCategoria} />
          <CurrencyInput
            label="Preço de Compra"
            onChange={(value) => setPurchasePriceLocal(value)}
            value={purchasePriceLocal || 0}
          />
          <CurrencyInput
            label="Preço de Venda"
            onChange={(value) => setSellingPriceLocal(value)}
            value={sellingPriceLocal || 0}
          />

          <ScrollArea className="h-5/6 overflow-y-auto">
            {variants.map((variant, index) => (
              <Card key={variant.id} className="mb-4">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>
                    Variante {variant.color} {variant.size}
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeVariant(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label>Nome da Variante:</Label>
                    <Input
                      value={`Variante ${variant.color} ${variant.size}`}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      placeholder="Nome da Variante"
                      readOnly
                      disabled
                    />
                    <Label>Cor:</Label>
                    <Input
                      value={variant.color.toUpperCase()}
                      onChange={(e) => updateVariant(index, 'color', e.target.value.toUpperCase())}
                      placeholder="Cor"
                    />
                    <Label>Tamanho:</Label>
                    <Input
                      value={variant.size.toUpperCase()}
                      onChange={(e) => updateVariant(index, 'size', e.target.value.toUpperCase())}
                      placeholder="Tamanho"
                      maxLength={1}
                    />
                  <Label>Quantidade em estoque dessa variante:</Label>
                  <Input
                    type="number"
                    value={variant.quantity}
                    onChange={(e) => updateVariant(index, 'quantity', Number(e.target.value))}
                    placeholder="Estoque"
                  />
                  </div>
                  <ImageUploader
                    variantId={variant.id}
                    images={variant.images}
                    onUpload={updateVariantImages}
                  />
                </CardContent>
              </Card>
            ))}
            <Button onClick={addVariant} className="w-full mb-4" type="button">
              + Adicionar Variante
            </Button>
            <div className="flex flex-row gap-4 mt-8">
              <Button type="submit">Criar Produto</Button>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
            </div>
          </ScrollArea>
        </form>
      </DialogContent>
    </Dialog>
  );
}