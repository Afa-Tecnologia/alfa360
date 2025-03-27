'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarcodeScanner } from '@/components/Reusable/BarcodeScanner';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  Filter,
  Loader2,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ProductService from '@/services/products/ProductServices';
import { gerarNotificacao } from '@/utils/toast';
import { useCartStore } from '@/stores/cart-store';
import FinalizeSaleModal from '@/components/pages/venda/checkout/FinalizeSaleModal';
import type { Product as CartProduct } from '@/stores/product-store';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

type ScannedItem = {
  code: string;
  quantity: number;
};

interface Variant {
  id: number;
  color: string;
  size: string;
  quantity: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  sellingPrice: number;
  quantity: number;
  image: string | null;
  brand: string;
  code: string;
  category_id: number;
  variants: Variant[];
  selectedColor?: string;
  selectedSize?: string;
  selectedColorId?: number;
  purchasePrice: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function NovaVenda() {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    total,
    discount,
    setDiscount,
  } = useCartStore();

  // Buscar produtos e categorias
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Buscar categorias
        const categoriesData = await ProductService.getCategorys();
        setCategories(categoriesData);

        // Buscar produtos
        const data = await ProductService.getProducts();
        const formattedData: Product[] = data.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          sellingPrice: Number.parseFloat(product.selling_price),
          quantity: product.quantity,
          image: product.image ? product.image.replace(/\\/g, '/') : null,
          brand: product.brand,
          code: product.code,
          category_id: product.categoria_id,
          variants: product.variants || [],
          purchasePrice: Number.parseFloat(product.purchase_price || '0'),
          stock: product.quantity || 0,
          category: product.category || '',
          createdAt: new Date(product.created_at || Date.now()),
          updatedAt: new Date(product.updated_at || Date.now()),
        }));

        setProducts(formattedData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        gerarNotificacao('error', 'Erro ao carregar produtos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar produtos com base no termo de busca e categoria selecionada
  const filteredProducts = products.filter((product) => {
    // Filtro por termo de busca
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por categoria
    const matchesCategory = selectedCategory
      ? product.category_id === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  // Manipuladores de eventos
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);

    // Definir valores padrão para variantes se existirem
    if (product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      setSelectedProduct({
        ...product,
        selectedColor: defaultVariant.color,
        selectedSize: defaultVariant.size,
        selectedColorId: defaultVariant.id,
      });
    }

    setShowProductDetails(true);
  };

  const handleBarcodeScan = async (result: string | ScannedItem[]) => {
    try {
      if (typeof result === 'string') {
        // Busca o produto pelo código de barras na API
        const product = await ProductService.getProductByBarcode(result);
        if (product) {
          // Se encontrar, atualiza o produto selecionado
          const formattedProduct: Product = {
            id: product.id,
            name: product.name,
            description: product.description,
            sellingPrice: Number.parseFloat(product.selling_price),
            quantity: product.quantity,
            image: product.image ? product.image.replace(/\\/g, '/') : null,
            brand: product.brand,
            code: product.code,
            category_id: product.categoria_id,
            variants: product.variants || [],
            purchasePrice: Number.parseFloat(product.purchase_price || '0'),
            stock: product.quantity || 0,
            category: product.category || '',
            createdAt: new Date(product.created_at || Date.now()),
            updatedAt: new Date(product.updated_at || Date.now()),
          };

          handleProductSelect(formattedProduct);
        } else {
          gerarNotificacao(
            'error',
            'Produto não encontrado com este código de barras'
          );
        }
      } else if (Array.isArray(result)) {
        // Modo múltiplo - processar vários itens
        for (const item of result) {
          const product = await ProductService.getProductByBarcode(item.code);
          if (product) {
            const formattedProduct: Product = {
              id: product.id,
              name: product.name,
              description: product.description,
              sellingPrice: Number.parseFloat(product.selling_price),
              quantity: product.quantity,
              image: product.image ? product.image.replace(/\\/g, '/') : null,
              brand: product.brand,
              code: product.code,
              category_id: product.categoria_id,
              variants: product.variants || [],
              purchasePrice: Number.parseFloat(product.purchase_price || '0'),
              stock: product.quantity || 0,
              category: product.category || '',
              createdAt: new Date(product.created_at || Date.now()),
              updatedAt: new Date(product.updated_at || Date.now()),
            };

            // Se tiver variantes, adicionar a primeira variante como padrão
            if (
              formattedProduct.variants &&
              formattedProduct.variants.length > 0
            ) {
              const defaultVariant = formattedProduct.variants[0];
              formattedProduct.selectedColor = defaultVariant.color;
              formattedProduct.selectedSize = defaultVariant.size;
              formattedProduct.selectedColorId = defaultVariant.id;
            }

            addItem(
              formattedProduct as unknown as CartProduct,
              item.quantity,
              0
            );
          } else {
            gerarNotificacao('error', `Produto não encontrado: ${item.code}`);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      gerarNotificacao('error', 'Erro ao processar código de barras');
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addItem(selectedProduct as unknown as CartProduct, quantity, 0);
      setShowProductDetails(false);
      gerarNotificacao('success', 'Produto adicionado ao carrinho');
    }
  };

  const handleQuickAddToCart = (product: Product) => {
    addItem(product as unknown as CartProduct, 1, 0);
    gerarNotificacao('success', 'Produto adicionado ao carrinho');
  };

  const handleFinalizeSale = () => {
    if (items.length === 0) {
      gerarNotificacao(
        'warning',
        'Adicione produtos ao carrinho antes de finalizar a venda'
      );
      return;
    }
    setIsPaymentDialogOpen(true);
  };

  // Controladores para quantidade
  const increaseQuantity = () => {
    if (selectedProduct && quantity < selectedProduct.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Total com desconto
  const totalComDesconto = Math.max(0, total() - discount);

  // Função para formatar preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Obtém o nome da categoria
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : '';
  };

  // Renderizar o estado de carregamento
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="bg-background flex flex-col h-[calc(100vh-80px)]">
      {/* Header com título, busca e scanner */}
      <div className="border-b px-6 py-3 flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Ponto de Venda</h1>
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto por nome, código ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <BarcodeScanner
            multipleMode={true}
            onScan={handleBarcodeScan}
            buttonLabel="Ler código"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Painel esquerdo: catálogo de produtos */}
        <div className="w-2/3 flex flex-col h-full border-r">
          {/* Filtros de categorias */}
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Filtrar por categoria:</span>
            </div>
            <div className="flex overflow-x-auto space-x-2 pb-2">
              <Button
                variant={!selectedCategory ? 'default' : 'outline'}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => {
                  setSelectedCategory(null);
                }}
              >
                Todos os produtos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? 'default' : 'outline'
                  }
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => {
                    setSelectedCategory(category.id);
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Tabela de produtos */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {filteredProducts.length > 0 ? (
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="w-12">Imagem</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-center">Estoque</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleProductSelect(product)}
                      >
                        <TableCell className="p-2">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="object-cover"
                                unoptimized
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder.svg';
                                }}
                              />
                            ) : (
                              <Image
                                src="/placeholder.svg"
                                alt="Produto sem imagem"
                                width={40}
                                height={40}
                                className="object-cover"
                                unoptimized
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.brand}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {product.code}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {getCategoryName(product.category_id)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-primary">
                          {formatPrice(product.sellingPrice)}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`text-sm ${product.quantity <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}
                          >
                            {product.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickAddToCart(product);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                  <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <p className="text-muted-foreground text-lg">
                    Nenhum produto encontrado
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Tente ajustar o termo de busca ou a categoria selecionada
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Painel direito: carrinho */}
        <div className="w-1/3 flex flex-col h-full">
          {/* Cabeçalho do carrinho */}
          <div className="p-4 border-b flex items-center gap-2 bg-muted/30">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-xl font-bold">Carrinho</h2>
            <Badge variant="secondary" className="ml-auto">
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </Badge>
          </div>

          {/* Conteúdo do carrinho */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">Carrinho vazio</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Selecione produtos para adicionar ao carrinho
              </p>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <div className="space-y-3 p-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 pb-3 border-b"
                  >
                    <div className="relative w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                          unoptimized
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      ) : (
                        <Image
                          src="/placeholder.svg"
                          alt="Produto sem imagem"
                          width={64}
                          height={64}
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">
                        {item.product.name}
                      </h4>
                      {item.product.selectedColor && (
                        <p className="text-xs text-muted-foreground">
                          {item.product.selectedColor},{' '}
                          {item.product.selectedSize}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-none"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                );
                              } else {
                                removeItem(item.product.id);
                              }
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-none"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(
                              item.product.sellingPrice * item.quantity
                            )}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-transparent"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Resumo e finalização */}
          <div className="border-t p-4 space-y-4 bg-muted/30">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(total())}</span>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="desconto" className="text-muted-foreground">
                  Desconto
                </label>
                <div className="flex items-center w-28">
                  <Input
                    id="desconto"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="text-right h-8"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-bold text-lg pt-2">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(totalComDesconto)}
                </span>
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={handleFinalizeSale}
              disabled={items.length === 0}
            >
              Finalizar Venda
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de detalhes do produto e seleção de variantes */}
      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar produto</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square bg-muted rounded-md overflow-hidden">
                {selectedProduct.image ? (
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <Image
                    src="/placeholder.svg"
                    alt="Produto sem imagem"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold line-clamp-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct.brand}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Código: {selectedProduct.code}
                  </p>
                </div>

                <p className="text-2xl font-bold text-primary">
                  {formatPrice(selectedProduct.sellingPrice)}
                </p>

                <p className="text-sm text-muted-foreground">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="col-span-2 space-y-4">
                <Separator />

                {selectedProduct.variants &&
                  selectedProduct.variants.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {/* Seleção de cor usando Combobox */}
                      <div>
                        <Label className="font-medium mb-2">Cor</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between mt-2"
                            >
                              {selectedProduct.selectedColor
                                ? selectedProduct.selectedColor
                                    .charAt(0)
                                    .toUpperCase() +
                                  selectedProduct.selectedColor
                                    .slice(1)
                                    .toLowerCase()
                                : 'Selecione a cor'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Procurar cor..." />
                              <CommandEmpty>
                                Nenhuma cor encontrada.
                              </CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {Array.from(
                                    new Set(
                                      selectedProduct.variants.map(
                                        (v) => v.color
                                      )
                                    )
                                  ).map((cor) => {
                                    const variantesComCor =
                                      selectedProduct.variants.filter(
                                        (v) => v.color === cor
                                      );
                                    const estoqueTotal = variantesComCor.reduce(
                                      (sum, v) => sum + v.quantity,
                                      0
                                    );

                                    return (
                                      <CommandItem
                                        key={cor}
                                        value={cor}
                                        onSelect={() => {
                                          const colorVariant =
                                            selectedProduct.variants.find(
                                              (v) => v.color === cor
                                            );

                                          setSelectedProduct({
                                            ...selectedProduct,
                                            selectedColor: cor,
                                            selectedColorId: colorVariant?.id,
                                          });
                                        }}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center">
                                          <span>
                                            {cor.charAt(0).toUpperCase() +
                                              cor.slice(1).toLowerCase()}
                                          </span>
                                        </div>
                                        <div className="flex items-center">
                                          <Badge
                                            variant="outline"
                                            className={cn(
                                              'ml-2',
                                              estoqueTotal <= 5
                                                ? 'text-destructive border-destructive'
                                                : ''
                                            )}
                                          >
                                            Estoque: {estoqueTotal}
                                          </Badge>
                                          {selectedProduct.selectedColor ===
                                            cor && (
                                            <Check className="ml-2 h-4 w-4" />
                                          )}
                                        </div>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Seleção de tamanho usando Combobox */}
                      <div>
                        <Label className="font-medium mb-2">Tamanho</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between mt-2"
                            >
                              {selectedProduct.selectedSize
                                ? selectedProduct.selectedSize.toUpperCase()
                                : 'Selecione o tamanho'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Procurar tamanho..." />
                              <CommandEmpty>
                                Nenhum tamanho encontrado.
                              </CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {Array.from(
                                    new Set(
                                      selectedProduct.variants.map(
                                        (v) => v.size
                                      )
                                    )
                                  ).map((tamanho) => {
                                    // Filtrar variantes apenas com este tamanho
                                    const variantesComTamanho =
                                      selectedProduct.variants.filter(
                                        (v) => v.size === tamanho
                                      );

                                    // Calcular estoque total para este tamanho
                                    const estoqueTotal =
                                      variantesComTamanho.reduce(
                                        (sum, v) => sum + v.quantity,
                                        0
                                      );

                                    return (
                                      <CommandItem
                                        key={tamanho}
                                        value={tamanho}
                                        onSelect={() => {
                                          const sizeVariant =
                                            selectedProduct.variants.find(
                                              (v) => v.size === tamanho
                                            );

                                          setSelectedProduct({
                                            ...selectedProduct,
                                            selectedSize: tamanho,
                                            selectedColorId: sizeVariant?.id,
                                          });
                                        }}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center">
                                          <span>{tamanho.toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Badge
                                            variant="outline"
                                            className={cn(
                                              'ml-2',
                                              estoqueTotal <= 5
                                                ? 'text-destructive border-destructive'
                                                : ''
                                            )}
                                          >
                                            Estoque: {estoqueTotal}
                                          </Badge>
                                          {selectedProduct.selectedSize ===
                                            tamanho && (
                                            <Check className="ml-2 h-4 w-4" />
                                          )}
                                        </div>
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}

                {/* Quantidade */}
                <div>
                  <Label className="font-medium">Quantidade</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-16 h-10 border rounded-md flex items-center justify-center">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseQuantity}
                      disabled={quantity >= selectedProduct.quantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">
                      Disponível: {selectedProduct.quantity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleAddToCart} className="flex-1">
              Adicionar ao Carrinho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de finalização de venda */}
      <FinalizeSaleModal
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        reqPedidos={{
          desconto: discount,
          total: totalComDesconto,
          produtos: items,
        }}
      />
    </div>
  );
}
