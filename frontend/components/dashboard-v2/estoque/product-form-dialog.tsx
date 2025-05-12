'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '@/stores/productStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/app/api/api';
import { BarcodeService } from '@/services/barcodeService';
import { BasicProductForm } from './basic-product-form';
import { VariantsList } from './variants-list';
import { SuccessDialog } from './success-dialog';
import {
  productFormSchema,
  variantSchema,
  VariantFormValues,
  ProductFormValues,
} from './product-form-schemas';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onSuccess?: () => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  const [variants, setVariants] = useState<VariantFormValues[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [productTypes] = useState([
    'roupa',
    'sapato',
    'acessório',
    'bolsa',
    'perfume',
    'outro',
  ]);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const isEditing = !!product;

  // Buscar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categorias');
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as categorias',
          variant: 'destructive',
        });
      }
    };

    fetchCategories();
  }, [toast]);

  // Inicializar form com hook
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      purchase_price: '',
      selling_price: '',
      quantity: '',
      brand: '',
      type: '',
      code: '',
      categoria_id: '',
    },
  });

  // Atualizar valores do formulário quando receber um produto para edição
  useEffect(() => {
    if (product && open) {
      form.reset({
        name: product.name,
        description: product.description,
        purchase_price: product.purchase_price.toString(),
        selling_price: product.selling_price.toString(),
        quantity: product.quantity.toString(),
        brand: product.brand,
        type: product.type,
        code: product.code || '',
        categoria_id: product.categoria_id,
      });

      // Configure as variantes se existirem
      if (product.variants && product.variants.length > 0) {
        try {
          const formattedVariants = product.variants.map((variant) => ({
            id: variant.id,
            name: variant.name || '',
            color: variant.color || '',
            size: variant.size || '',
            stock:
              variant.stock?.toString() || variant.quantity?.toString() || '0',
            images: Array.isArray(variant.images) ? variant.images : [],
            type: variant.type || product.type,
          }));

          console.log('Variantes carregadas:', formattedVariants);
          setVariants(formattedVariants);
        } catch (error) {
          console.error('Erro ao formatar variantes:', error, product.variants);
          toast({
            title: 'Erro com variantes',
            description: 'Ocorreu um erro ao carregar as variantes do produto',
            variant: 'destructive',
          });
          setVariants([]);
        }
      } else {
        setVariants([]);
      }
    } else if (!product && open) {
      form.reset({
        name: '',
        description: '',
        purchase_price: '',
        selling_price: '',
        quantity: '',
        brand: '',
        type: '',
        code: '',
        categoria_id: '',
      });
      setVariants([]);
    }
  }, [product, open, form]);

  // Manipulador de adição de variante
  const handleAddVariant = () => {
    const productName = form.getValues('name') || '';
    setVariants([
      ...variants,
      {
        name: productName,
        color: '',
        size: '',
        stock: '0',
        images: [],
      },
    ]);
  };

  // Manipulador de remoção de variante
  const handleRemoveVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  // Manipulador de atualização de variante
  const handleUpdateVariant = (
    index: number,
    field: keyof VariantFormValues,
    value: string
  ) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  // Adicionar função específica para atualizar imagens de variantes
  const handleUpdateVariantImages = (index: number, urls: string[]) => {
    const newVariants = [...variants];
    newVariants[index].images = urls;
    setVariants(newVariants);
  };

  // Função para gerar código de barras único
  const generateUniqueBarcode = async () => {
    try {
      const categoriaId = form.getValues('categoria_id');

      // Se não tiver categoria selecionada, mostrar alerta
      if (!categoriaId) {
        toast({
          title: 'Categoria necessária',
          description:
            'Selecione uma categoria antes de gerar o código de barras',
          variant: 'destructive',
        });
        return;
      }

      const barcodeValue = await BarcodeService.generateVerifiedUniqueBarcode(
        Number(categoriaId)
      );

      if (barcodeValue) {
        form.setValue('code', barcodeValue);
        toast({
          title: 'Código gerado',
          description: 'Código de barras gerado com sucesso!',
        });
      } else {
        throw new Error('Falha ao gerar código de barras');
      }
    } catch (error) {
      console.error('Erro ao gerar código de barras:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao gerar código de barras. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Função que manipula o envio do formulário
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      // Gerar código de barras automaticamente se não estiver preenchido
      if (!data.code) {
        try {
          const generatedBarcode =
            await BarcodeService.generateVerifiedUniqueBarcode(
              Number(data.categoria_id)
            );
          data.code = generatedBarcode;
          form.setValue('code', generatedBarcode);
        } catch (error) {
          console.error('Erro ao gerar código de barras automático:', error);
        }
      }

      // Validar as variantes
      const validatedVariants: VariantFormValues[] = [];
      let hasVariantError = false;

      for (const variant of variants) {
        try {
          const validated = variantSchema.parse(variant);
          validatedVariants.push(validated);
        } catch (error) {
          hasVariantError = true;
          toast({
            title: 'Erro de validação',
            description: 'Uma ou mais variantes contém dados inválidos',
            variant: 'destructive',
          });
          break;
        }
      }

      if (hasVariantError) {
        setIsSubmitting(false);
        return;
      }

      // Gerar nomes para as variantes automaticamente se estiverem vazios
      const processedVariants = validatedVariants.map((variant) => {
        // Construir o nome da variante com base no produto principal
        const autoName = `${data.name} ${variant.color} ${variant.size}`.trim();

        // Preserva o ID original durante a edição
        const variantId =
          variant.id || Date.now() + Math.floor(Math.random() * 1000);

        return {
          ...variant,
          id: variantId,
          name: variant.name || autoName, // Usa o nome inserido ou gera automaticamente
          stock: Number(variant.stock),
          quantity: Number(variant.stock),
          type: variant.type || data.type.toLowerCase(),
          active: true,
          // Garante que images seja um array
          images: Array.isArray(variant.images) ? variant.images : [],
        };
      });

      // Preparar o payload
      const payload = {
        ...data,
        purchase_price: Number(data.purchase_price),
        selling_price: Number(data.selling_price),
        quantity: Number(data.quantity),
        categoria_id: Number(data.categoria_id),
        variants: processedVariants,
      };

      let savedProduct: Product;

      if (isEditing && product) {
        // Atualizar produto existente
        const response = await api.put(`/produtos/${product.id}`, payload);
        savedProduct = response.data.produto || { ...product, ...payload };
        toast({
          title: 'Produto atualizado',
          description: 'O produto foi atualizado com sucesso',
        });
      } else {
        // Criar novo produto
        const response = await api.post('/produtos', payload);
        savedProduct = response.data.produto || { ...payload, id: Date.now() };

        // Definir o produto criado e abrir o diálogo de sucesso
        setCreatedProduct(savedProduct);
        setIsSuccessDialogOpen(true);
      }

      // Se for edição, feche o diálogo de edição
      if (isEditing) {
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: 'Erro',
        description:
          error.response?.data?.message ||
          'Ocorreu um erro ao salvar o produto',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para lidar com o fechamento do diálogo de sucesso
  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
    onOpenChange(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Atualize as informações do produto'
                : 'Preencha os dados para cadastrar um novo produto'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex space-x-1 border-b mb-4">
            <Button
              type="button"
              variant={currentTab === 'basic' ? 'default' : 'ghost'}
              onClick={() => setCurrentTab('basic')}
              className="rounded-none rounded-t-lg"
            >
              Informações Básicas
            </Button>
            <Button
              type="button"
              variant={currentTab === 'variants' ? 'default' : 'ghost'}
              onClick={() => {
                // Verificar se há um nome de produto antes de mudar para a aba de variantes
                const productName = form.getValues('name');
                if (!productName) {
                  toast({
                    title: 'Nome do produto necessário',
                    description:
                      'Por favor, preencha o nome do produto antes de adicionar variantes.',
                    variant: 'destructive',
                  });
                  return;
                }
                setCurrentTab('variants');
              }}
              className="rounded-none rounded-t-lg"
            >
              Variantes ({variants.length})
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentTab === 'basic' && (
                <BasicProductForm
                  form={form}
                  categories={categories}
                  productTypes={productTypes}
                  generateUniqueBarcode={generateUniqueBarcode}
                />
              )}

              {currentTab === 'variants' && (
                <VariantsList
                  variants={variants}
                  productName={form.getValues('name')}
                  onAddVariant={handleAddVariant}
                  onRemoveVariant={handleRemoveVariant}
                  onUpdateVariant={handleUpdateVariant}
                  onUpdateVariantImages={handleUpdateVariantImages}
                />
              )}

              <DialogFooter className="gap-2 sm:gap-0 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? 'Salvando...' : 'Criando...'}
                    </>
                  ) : (
                    <>{isEditing ? 'Salvar Alterações' : 'Criar Produto'}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de sucesso com etiqueta */}
      <SuccessDialog
        open={isSuccessDialogOpen}
        onClose={handleSuccessDialogClose}
        product={createdProduct}
      />
    </>
  );
}
