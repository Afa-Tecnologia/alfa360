'use client';
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
import { Trash2, BadgePlus } from 'lucide-react';
import SelectTipoProduto from './SelectTipo';
import CategoriaListing from './CategoriasListing';
import { CurrencyInput } from '../Reusable/CurrencyInput';
import { DialogClose } from '@radix-ui/react-dialog';
import ImageUploader from './CloudinaryUploader';
import { Label } from '../ui/label';
import { api } from '@/app/api/api';
import { gerarNotificacao } from '@/utils/toast';
import { BarcodeScanner } from '../Reusable/BarcodeScanner';
import { BarcodeService } from '@/services/barcodeService';
import { SuccessProductDialog } from './SuccessProductDialog';

interface ICreateProductForm {
  fetchProducts?: () => void;
}
export default function CreateProductForm(props: ICreateProductForm) {
  const { isOpenCreate, closeForm } = useUIStore();
  const { addProduct, setCurrentProduct, setProducts, products } =
    useProductStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState<string>('');
  const [variants, setVariants] = useState<Variant[]>([]);
  const [tipo, setTipo] = useState<string>('');
  const [categoria, setCategoria] = useState<number | string>('');
  const [sellingPriceLocal, setSellingPriceLocal] = useState<number>(0);
  const [purchasePriceLocal, setPurchasePriceLocal] = useState<number>(0);
  const [quantity, setQuantity] = useState<number | string>('');
  const [brand, setBrand] = useState<string>('');
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<any>(null);

  useEffect(() => {
    console.log('produtos na store ' + JSON.stringify(products));
  }, [products]);

  // Função para gerar código de barras único
  const generateUniqueBarcode = async () => {
    try {
      // Se não tiver categoria selecionada, mostrar alerta
      if (!categoria) {
        gerarNotificacao(
          'error',
          'Selecione uma categoria antes de gerar o código de barras'
        );
        return;
      }

      const barcodeValue = await BarcodeService.generateVerifiedUniqueBarcode(
        Number(categoria)
      );

      if (barcodeValue) {
        setCode(barcodeValue);
        gerarNotificacao('success', 'Código de barras gerado com sucesso!');
      } else {
        throw new Error('Falha ao gerar código de barras');
      }
    } catch (error) {
      console.error('Erro ao gerar código de barras:', error);
      gerarNotificacao(
        'error',
        'Falha ao gerar código de barras. Tente novamente.'
      );
    }
  };

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

    // Se o código de barras estiver vazio, gera um novo código
    if (!code) {
      await generateUniqueBarcode();
    }

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

      // Armazena o produto criado para exibir no diálogo de sucesso
      setCreatedProduct(response.data.produto || product);

      // Adiciona o produto à store
      addProduct(product);

      // Abre o diálogo de sucesso
      setIsSuccessDialogOpen(true);

      // Não fecha o formulário até que o usuário feche o diálogo de sucesso
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
    setSellingPriceLocal(0);
    setPurchasePriceLocal(0);
    setQuantity('');
    setBrand('');
    setTipo('');
    setCode('');
    setCurrentProduct({} as Product);
    setIsSuccessDialogOpen(false);
    closeForm();
  };

  return (
    <>
      <Dialog
        open={isOpenCreate}
        onOpenChange={(open) => !open && onClickClose()}
      >
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
              required
            />
            <Label className="text-base font-semibold">Descrição:</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-4"
              required
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
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={generateUniqueBarcode}
                >
                  <BadgePlus size={16} />
                  Gerar
                </Button>
                <div onClick={(e) => e.preventDefault()}>
                  <BarcodeScanner
                    onScan={(value) => {
                      if (typeof value === 'string') {
                        setCode(value);
                      }
                    }}
                    buttonLabel="Escanear"
                  />
                </div>
              </div>
            </div>
            <SelectTipoProduto
              onChange={(value) => setTipo(value.trim().toLowerCase())}
            />
            <CategoriaListing onChange={setCategoria} />
            <CurrencyInput
              label="Preço de Compra"
              onChange={(value) => setPurchasePriceLocal(value)}
              value={purchasePriceLocal}
            />
            <CurrencyInput
              label="Preço de Venda"
              onChange={(value) => setSellingPriceLocal(value)}
              value={sellingPriceLocal}
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
                        onChange={(e) =>
                          updateVariant(index, 'name', e.target.value)
                        }
                        placeholder="Nome da Variante"
                        readOnly
                        disabled
                      />
                      <Label>Cor:</Label>
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
                      <Label>Tamanho:</Label>
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
                      <Label>Quantidade em estoque dessa variante:</Label>
                      <Input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            'quantity',
                            Number(e.target.value)
                          )
                        }
                        placeholder="Quantidade"
                      />
                      <Label>Imagens:</Label>
                      <ImageUploader
                        variantId={variant.id}
                        images={variant.images}
                        onUpload={updateVariantImages}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>

            <div className="flex flex-col gap-4 mt-4 mb-2">
              <Button
                type="button"
                onClick={addVariant}
                className="mb-4"
                variant="outline"
              >
                Adicionar Variante
              </Button>

              <Button type="submit" className="w-full">
                Cadastrar Produto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de sucesso e impressão de etiqueta */}
      {createdProduct && (
        <SuccessProductDialog
          isOpen={isSuccessDialogOpen}
          onClose={onClickClose}
          product={createdProduct}
        />
      )}
    </>
  );
}
