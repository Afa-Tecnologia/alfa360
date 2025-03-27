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
import { BarcodeScanner } from '../Reusable/BarcodeScanner';

export default function EditProductForm() {
  const { isOpenEdit, editingProductId, closeForm } = useUIStore();
  const { products, updateProduct, setCurrentProduct } = useProductStore();

  const editingProduct = editingProductId
    ? products.find((p) => p.id === editingProductId)
    : null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [variants, setVariants] = useState<Variant[]>([]);
  const [code, setCode] = useState<any>('');
  const [tipo, setTipo] = useState<string>('');
  const [categoria, setCategoria] = useState<number | string>('');
  const [sellingPriceLocal, setSellingPriceLocal] = useState<number | string>(
    ''
  );
  const [purchasePriceLocal, setPurchasePriceLocal] = useState<number | string>(
    ''
  );
  const [quantity, setQuantity] = useState<number | string>('');
  const [brand, setBrand] = useState<string>('');

  useEffect(() => {
    if (editingProduct) {
      setCurrentProduct(editingProduct);
      setName(editingProduct.name || '');
      setDescription(editingProduct.description || '');
      setVariants(
        Array.isArray(editingProduct.variants) ? editingProduct.variants : []
      );
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

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const updateVariantImages = (variantId: number, images: string[]) => {
    const variantIndex = variants.findIndex((v) => v.id === variantId);
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
    if (!editingProductId) return;

    // Desativar o botão para evitar envios duplicados
    const submitButton = e.currentTarget.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const processedVariants = variants.map((variant) => ({
        ...variant,
        name: `${name} ${variant.color} ${variant.size}`,
        type: tipo.trim().toLowerCase(),
        active: true,
        images: Array.isArray(variant.images) ? variant.images : [],
      }));

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
        variants: processedVariants,
      };

      const response = await api.put(
        `/produtos/${productEdited.id}`,
        productEdited
      );

      gerarNotificacao('success', response.data.message);
      updateProduct(response.data.produto);
      onClickClose();
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      const errorMessage =
        error.response?.data?.message || 'Erro ao salvar produto';
      gerarNotificacao('error', errorMessage);
    } finally {
      // Reativar o botão
      if (submitButton) {
        submitButton.disabled = false;
      }
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
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="p-4 flex-1"
              placeholder="Digite ou escaneie o código do produto"
            />
            <div onClick={(e) => e.preventDefault()}>
              <BarcodeScanner
                onScan={(value) => {
                  // Atualiza apenas o valor do código, sem causar submit
                  if (typeof value === 'string') {
                    setCode(value);
                  }
                }}
                buttonLabel="Escanear"
              />
            </div>
          </div>

          <SelectTipoProduto
            initialValue={tipo}
            onChange={(value) => setTipo(value.trim().toLowerCase())}
          />
          <CategoriaListing
            initialValue={categoria || ''}
            onChange={setCategoria}
          />

          <CurrencyInput
            label="Preço de Compra"
            onChange={setPurchasePriceLocal}
            value={purchasePriceLocal || 0}
          />
          <CurrencyInput
            label="Preço de Venda"
            onChange={setSellingPriceLocal}
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
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={`Variante ${variant.color} ${variant.size}`}
                      onChange={(e) =>
                        updateVariant(index, 'name', e.target.value)
                      }
                      placeholder="Nome da Variante"
                      readOnly
                      disabled
                    />
                    <Input
                      value={variant.color.toUpperCase()}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'color',
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="Cor"
                    />
                    <Input
                      value={variant.size.toUpperCase()}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'size',
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="Tamanho"
                      maxLength={1}
                    />
                  </div>
                  <Input
                    type="number"
                    value={variant.quantity}
                    onChange={(e) =>
                      updateVariant(index, 'quantity', Number(e.target.value))
                    }
                    placeholder="Estoque"
                  />
                  <ImageUploader
                    variantId={variant.id}
                    images={variant.images || []}
                    onUpload={updateVariantImages}
                  />
                </CardContent>
              </Card>
            ))}
            <Button onClick={addVariant} className="w-full mb-4" type="button">
              + Adicionar Variante
            </Button>
            <div className="flex flex-row gap-4 mt-8">
              <Button type="submit">Salvar Alterações</Button>
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
