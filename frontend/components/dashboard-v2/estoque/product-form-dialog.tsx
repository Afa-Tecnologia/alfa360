'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product, Variant } from '@/stores/productStore';
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
import { Loader2, Plus } from 'lucide-react';
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
import { tiposDeProdutosService } from '@/services/TiposDeProdutosService';
import { TipoDeProduto } from '@/types/configuracoes';
import { gerarNotificacao } from '@/utils/toast';
import { AtributoRequest, Atributos } from '@/types/estoque';
import {
  AtributoTipoDeNegocio,
  ProductEstoque,
  ResponseAtributos,
} from '@/types/product';
import { Badge } from '@/components/ui/badge';
interface VariantAtributo {
  atributo_id: string | number;
  valor: string;
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductEstoque;
  onSuccess?: () => void;
  categories: any[]; // Adicionando categorias como prop opcional
  tiposDeProdutos: TipoDeProduto[]; // Adicionando tipos de produtos como prop opcional
  atributosVariante: ResponseAtributos[]; // Adicionando atributos variante como prop opcional
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
  categories,
  tiposDeProdutos,
  atributosVariante,
}: ProductFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  const [variants, setVariants] = useState<VariantFormValues[]>([]);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<ProductEstoque | null>(
    null
  );
  const { toast } = useToast();
  const isEditing = !!product;

  // Buscar categorias e tipos de produtos
  // useEffect(() => {
  //   console.log('product: ', product);

  //   const fetchData = async () => {
  //     try {
  //       // Buscar categorias
  //       const categoriesResponse = await api.get('/categorias');
  //       setCategories(categoriesResponse.data);

  //       // Buscar tipos de produtos
  //       const tiposDeProdutosResponse = await tiposDeProdutosService.getAll();

  //       if (tiposDeProdutosResponse && tiposDeProdutosResponse.length > 0) {
  //         setTiposDeProdutos(tiposDeProdutosResponse);
  //       } else {
  //         console.warn('Nenhum tipo de produto encontrado na API');
  //         setTiposDeProdutos([]);
  //         toast({
  //           title: 'Aviso',
  //           description:
  //             'Nenhum tipo de produto cadastrado. Acesse as configurações do sistema para cadastrar.',
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Erro ao buscar dados:', error);
  //       toast({
  //         title: 'Erro',
  //         description: 'Não foi possível carregar os dados necessários',
  //         variant: 'destructive',
  //       });
  //     }
  //   };

  //   if (open) {
  //     fetchData();
  //   }
  // }, [open, toast]);

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
      tipo_de_produto_id: '',
      code: '',
      categoria_id: '',
    },
  });

  // Atualizar valores do formulário quando receber um produto para edição
  useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          name: product.name,
          description: product.description,
          purchase_price: product.purchase_price?.toString() || '0',
          selling_price: product.selling_price?.toString() || '0',
          quantity: product.quantity?.toString() || '0',
          brand: product.brand || '',
          tipo_de_produto_id: product.tipo_de_produto_id?.toString() || '',
          code: product.code || '',
          categoria_id: product.categoria_id?.toString() || '',
        });

        if (product.variants && product.variants.length > 0) {
          console.log('product.variants:', product.variants);
          const formattedVariants: VariantFormValues[] = product.variants.map(
            (variant) => ({
              id: variant.id,
              name: variant.name || '',
              quantity: variant.quantity?.toString() || '0',
              images: Array.isArray(variant.images) ? variant.images : [],
              atributos: (variant.atributos || []).map((attr: any) => ({
                atributo_id: attr.id,
                valor: attr.pivot?.valor || '',
              })),
              type: variant.type || '',
            })
          );
          console.log('formattedVariants:', formattedVariants);
          setVariants(formattedVariants);
        } else {
          setVariants([]);
        }
      } else {
        form.reset({
          name: '',
          description: '',
          purchase_price: '0',
          selling_price: '0',
          quantity: '0',
          brand: '',
          tipo_de_produto_id: '',
          code: '',
          categoria_id: '',
        });
        setVariants([]);
      }
    }
    // Dependências melhor definidas para evitar re-renders
  }, [product, open]);
  // Manipulador de adição de variante
  const handleAddVariant = () => {
    const productName = form.getValues('name') || '';
    setVariants([
      ...variants,
      {
        name: productName,
        quantity: '0',
        images: [],
        atributos: [],
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
    value: any // ❗ any aqui, pois pode ser string, array, etc.
  ) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...prev[index],
        [field]: value,
      };
      return updated;
    });
  };

  // Adicionar função específica para atualizar imagens de variantes
  const handleUpdateVariantImages = (index: number, urls: string[]) => {
    const newVariants = [...variants];
    newVariants[index].images = urls;
    setVariants(newVariants);
  };

  // Função para gerar código de barras único
  // Função para gerar código de barras único e criar o produto automaticamente se possível
  const generateUniqueBarcode = async () => {
    try {
      const categoriaId = form.getValues('categoria_id');

      if (!categoriaId) {
        gerarNotificacao(
          'error',
          'Selecione uma categoria antes de gerar o código de barras'
        );
        return;
      }

      const barcodeValue = await BarcodeService.generateVerifiedUniqueBarcode(
        Number(categoriaId)
      );

      if (barcodeValue) {
        form.setValue('code', barcodeValue);

        gerarNotificacao('success', 'Código de barras gerado com sucesso!');

        // Validar o formulário antes de submeter automaticamente
        const isValid = await form.trigger();

        if (isValid) {
          const data = form.getValues();
          await onSubmit(data); // Submete o formulário com os dados atuais
        } else {
          gerarNotificacao(
            'error',
            'Preencha todos os campos obrigatórios antes de criar o produto.'
          );
        }
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

  // Função que manipula o envio do formulário
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      // Validar variantes
      const validatedVariants: VariantFormValues[] = [];
      let hasVariantError = false;

      for (const variant of variants) {
        try {
          const hasAtributosPreenchidos =
            Array.isArray(variant.atributos) &&
            variant.atributos.filter((a) => a.atributo_id && a.valor).length >
              0;

          // Se estiver editando e os atributos estiverem vazios, pular validação
          if (isEditing && !hasAtributosPreenchidos) {
            validatedVariants.push(variant);
            continue;
          }

          // Remove atributos incompletos antes de validar
          const cleanedVariant = {
            ...variant,
            atributos: (variant.atributos || []).filter(
              (a) => a.atributo_id && a.valor
            ),
          };

          const validated = variantSchema.parse(cleanedVariant);
          validatedVariants.push(validated);
        } catch (error) {
          console.error('Erro na validação:', error);
          hasVariantError = true;
          gerarNotificacao(
            'error',
            'Uma ou mais variantes contém dados inválidos'
          );
          break;
        }
      }

      if (!isEditing && validatedVariants.length === 0) {
        gerarNotificacao('error', 'Preencha pelo menos uma variante');
        setIsSubmitting(false);
        return;
      }
      if (hasVariantError) {
        setIsSubmitting(false);
        return;
      }

      // Processar variantes
      const processedVariants = validatedVariants.map((variant) => {
        const autoName =
          `${data.name} ${variant.atributos?.map((atributo) => atributo.valor).join(' ')}`.trim();
        const tipoProduto = tiposDeProdutos?.find(
          (tipo) => tipo.id.toString() === data.tipo_de_produto_id.toString()
        );

        return {
          ...variant,
          id: variant.id,
          name: variant.name || autoName,
          quantity: Number(variant.quantity),
          type:
            variant.type ||
            (tipoProduto ? tipoProduto.nome.toLowerCase() : 'outro'),
          active: true,
          images: Array.isArray(variant.images) ? variant.images : [],
          atributos: variant.atributos,
        };
      });

      const payload = {
        ...data,
        purchase_price: Number(data.purchase_price),
        selling_price: Number(data.selling_price),
        quantity: Number(data.quantity),
        categoria_id: Number(data.categoria_id),
        tipo_de_produto_id: Number(data.tipo_de_produto_id),
        variants: processedVariants,
      };

      let savedProduct: Product;

      if (isEditing && product) {
        const response = await api.put(`/produtos/${product.id}`, payload);
        savedProduct = response.data.produto || { ...product, ...payload };
        gerarNotificacao('success', 'Produto atualizado com sucesso!');
      } else {
        const response = await api.post('/produtos', payload);
        savedProduct = response.data.produto || { ...payload, id: Date.now() };
        setCreatedProduct(savedProduct);
        setIsSuccessDialogOpen(true);
      }

      if (isEditing) {
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      gerarNotificacao(
        'error',
        error.response?.data?.message || 'Erro ao salvar o produto.'
      );
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
        <DialogContent className="md:max-w-3xl sm:max-w-lg overflow-y-auto max-h-[90vh]">
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
            <form
              id="product-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 pb-24"
            >
              {' '}
              {/* Adiciona padding-bottom para não cobrir conteúdo */}{' '}
              {/* Adiciona padding-bottom para não cobrir conteúdo */}
              {currentTab === 'basic' && (
                <BasicProductForm
                  form={form}
                  categories={categories}
                  productTypes={tiposDeProdutos}
                  generateUniqueBarcode={generateUniqueBarcode}
                />
              )}
              {currentTab === 'variants' && (
                <>
                  <VariantsList
                    atributosVariante={atributosVariante}
                    variants={variants}
                    productName={form.getValues('name')}
                    onAddVariant={handleAddVariant}
                    onRemoveVariant={handleRemoveVariant}
                    onUpdateVariant={handleUpdateVariant}
                    onUpdateVariantImages={handleUpdateVariantImages}
                  />
                </>
              )}
            </form>
          </Form>

          {/* Footer fixo tipo painel de botões */}
          <div
            className="sticky bottom-0 left-0 w-full bg-background z-50 flex flex-col justify-start pt-2 pb-2 border-t gap-2"
            style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.04)' }}
          >
            <h2 className="text-sm font-medium">Painel de Controle</h2>

            <div className="flex gap-2 w-full justify-end">
              {currentTab === 'variants' && (
                <Button type="button" onClick={handleAddVariant}>
                  <Plus className="h-4 w-4 mr-1" />
                  Variante
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 hover:text-white text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="product-form"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Salvando...' : 'Criando...'}
                  </>
                ) : (
                  <>{isEditing ? 'Salvar Alterações' : 'Criar Produto'}</>
                )}
              </Button>
            </div>
          </div>
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
