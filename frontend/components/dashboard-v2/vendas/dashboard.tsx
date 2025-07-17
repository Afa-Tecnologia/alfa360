'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  Barcode,
  Package,
  ArrowUpRight,
  Clock,
  Users,
  Tag,
  Filter,
  ListFilter,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore } from '@/stores/cart-store copy';
import { Product } from '@/types/sales';
import { User } from '@/lib/services/UserService';
import { gerarNotificacao } from '@/utils/toast';
import useAuthStore from '@/stores/authStore';
import OrdersSales from '@/services/pedidos/SalesOrders';
import { createPaymentService } from '@/services/pagamentos/CreatePaymentService';

// Componentes
import { ProductFilters } from './components/product-filters';
import { ProductGrid } from './components/product-grid';
import { ProductTable } from './components/product-table';
import { CartPanel } from './components/cart-panel';
import { ProductDetailsDialog } from './components/product-details-dialog';
import { FinalizeSaleDialog } from './components/finalize-sale-dialog';
import { EmptyState } from './components/empty-state';
import { EnhancedBarcodeScanner } from '@/components/Reusable/EnhancedBarcodeScanner';
import { ScannedItem } from '@/components/Reusable/EnhancedBarcodeScanner';
import { SalesStatsCard } from './components/sales-stats-card';
import { SalesReceipt } from './components/sales-receipt';
import { ProductEstoque, ResponseProducts, ResponseProductsToSalesComponent } from '@/types/product';

interface VendasDashboardProps {
  responseProducts: ResponseProductsToSalesComponent;
  sellers: User[];
  categories: any[];
  isLoading: boolean;
}

export function VendasDashboard({
  responseProducts,
  sellers,
  categories,
  isLoading,
}: VendasDashboardProps) {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [showCartSheet, setShowCartSheet] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedSeller, setSelectedSeller] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('produtos');
  const [isProcessingSale, setIsProcessingSale] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [saleReceipt, setSaleReceipt] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>(responseProducts.data || [])
const [selectVariant, setSelectedVariant] = useState<number | null>(null);
  // Get current user
  const user = useAuthStore((state) => state.user);

  // Acessar o carrinho
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    total,
    discount,
    setDiscount,
    totalWithDiscount,
    clearCart,
  } = useCartStore();

  // Define o modo de visualização com base na tela
  useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? 'grid' : 'table');
    };

    // Definição inicial
    handleResize();

    // Adiciona event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtrar produtos com base no termo de busca e categoria selecionada
  const filteredProducts = products.filter((product) => {
    // Filtro por termo de busca
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ;

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
    setSelectedSeller(null);

    // Definir valores padrão para variantes se existirem
    if (product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      setSelectedProduct({
        ...product,
        selectedColor: defaultVariant.color,
        selectedSize: defaultVariant.size,
        selectedColorId: selectVariant ||  0,
      });
    }

    setShowProductDetails(true);
  };

  // Função para lidar com a mudança de vendedor
  const handleSellerChange = (seller: User) => {
    setSelectedSeller(seller);
  };

  const handleEnhancedBarcodeScan = async (items: ScannedItem[]) => {
    try {
      for (const item of items) {
        if (item.product && item.variantId) {
          // O produto já está completamente formatado e com variante selecionada
          const productToAdd = {
            ...item.product,
            selectedColorId: item.variantId,
            selectedColor: item.product.variants.find(
              (v) => v.id === item.variantId
            )?.color,
            selectedSize: item.product.variants.find(
              (v) => v.id === item.variantId
            )?.size,
          };

          addItem(productToAdd as any, item.quantity, 0);
        }
      }
      gerarNotificacao(
        'success',
        `${items.length} ${items.length === 1 ? 'produto adicionado' : 'produtos adicionados'} ao carrinho`
      );
    } catch (error) {
      console.error('Erro ao processar itens escaneados:', error);
      gerarNotificacao('error', 'Erro ao processar itens escaneados');
    }
  };
const handleSelectChange = (value: number) => {
setSelectedVariant(value);

}
  const handleAddToCart = () => {
    if (selectedProduct && selectedSeller) {
      // Adiciona o produto ao carrinho com o ID do vendedor associado
      addItem(
        {
          ...selectedProduct,
          vendedor_id: selectedSeller.id,
          vendedor_nome: selectedSeller.name,
        } as any,
        quantity,
        0
      );
      setShowProductDetails(false);
      gerarNotificacao('success', 'Produto adicionado ao carrinho');
    } else if (!selectedSeller) {
      gerarNotificacao('warning', 'Selecione um vendedor para continuar');
    }
  };

  const handleQuickAddToCart = (product: Product) => {
    // Para adições rápidas, deve abrir o modal para selecionar o vendedor
    setSelectedProduct(product);
    setQuantity(1);

    // Definir valores padrão para variantes se existirem
    if (product.variants && product.variants.length > 0) {
      console.log('Variants:', product.variants);
     
      setSelectedProduct({
        ...product,
       
        selectedColorId: selectVariant || 0,
      });
    }

    setShowProductDetails(true);
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

  const handleProcessSale = async (paymentData: any) => {
    setIsProcessingSale(true);
    try {
      // Preparar dados do pedido
      const pedido = {
        vendedor_id: user?.id,
        cliente_id: paymentData.cliente_id,
        type: 'loja',
        status: paymentData.status,
        payment_method: paymentData.payment_method,
        payment_type: paymentData.payment_type, // Tipo de pagamento (FULL, PARTIAL, CREDIT)
        payment_splits: paymentData.payment_splits,
        desconto: discount,
        total_paid: paymentData.total_paid, // Valor total pago
        remaining_balance: paymentData.remaining_balance, // Valor restante a pagar
        produtos: items.map((item) => ({
          variante_id: selectVariant || 0,
          produto_id: item.id,
          quantidade: item.quantity,
          vendedor_id: item.vendedor_id,
        })),
      };

      console.log('Criando pedido:', pedido);

      // Criar pedido
      const response = await OrdersSales.createPedido(pedido);

      if (!response) {
        gerarNotificacao('error', 'Erro ao criar pedido');
        setIsProcessingSale(false);
        return;
      }

      const pedidoId = response.pedido.id;
      console.log('Pedido criado com sucesso. ID:', pedidoId);

      // Processar pagamentos baseado no tipo de pagamento
      if (
        paymentData.payment_type === 'FULL' ||
        paymentData.payment_type === 'PARTIAL'
      ) {
        // Criar registros de pagamento para cada divisão com valor > 0
        for (const split of paymentData.payment_splits) {
          if (split.amount > 0) {
            const paymentRecord = {
              payment_method_code: split.method,
              total: split.amount,
              status: 'CAPTURED',
              payment_type: paymentData.payment_type,
            };

            console.log('Criando registro de pagamento:', paymentRecord);

            try {
              await createPaymentService.createPayment(
                paymentRecord,
                pedidoId.toString()
              );
            } catch (error) {
              console.error('Erro ao criar registro de pagamento:', error);
              gerarNotificacao('error', 'Erro ao registrar pagamento');
            }
          }
        }
      } else if (paymentData.payment_type === 'CREDIT') {
        // Para vendas fiado, registramos um pagamento condicional com valor 0
        // Isso permite acompanhar que existe um valor pendente a ser pago pelo cliente
        const creditPaymentRecord = {
          payment_method_code: 'CONDITIONAL',
          total: 0,
          status: 'PENDING',
          payment_type: 'CREDIT',
          total_due: totalWithDiscount, // Valor total a ser pago posteriormente
        };

        console.log(
          'Criando registro de pagamento fiado:',
          creditPaymentRecord
        );

        try {
          await createPaymentService.createPayment(
            creditPaymentRecord,
            pedidoId.toString()
          );
        } catch (error) {
          console.error('Erro ao criar registro de pagamento fiado:', error);
          gerarNotificacao('error', 'Erro ao registrar pagamento fiado');
        }
      }

      // Preparar dados para o recibo
      const receiptData = {
        id: pedidoId,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.sellingPrice,
          total: item.sellingPrice * item.quantity,
          vendedor: item.vendedor_nome,
        })),
        total: getTotalWithDiscountValue(),
        desconto: discount,
        customerName: paymentData.cliente_nome,
        paymentMethod: getPaymentMethodDescription(paymentData),
        status: paymentData.status,
        isPaid: paymentData.status === 'PAYMENT_CONFIRMED',
        isPartial: paymentData.payment_type === 'PARTIAL',
        isCredit: paymentData.payment_type === 'CREDIT',
        totalPaid: paymentData.total_paid,
        remainingBalance: paymentData.remaining_balance,
        createdAt: new Date(),
      };

      // Limpar carrinho após finalizar
      clearCart();

      // Fechar diálogo de pagamento
      setIsPaymentDialogOpen(false);

      // Mostrar recibo
      setSaleReceipt(receiptData);
      setIsReceiptOpen(true);

      gerarNotificacao('success', 'Venda finalizada com sucesso!');
    } catch (error) {
      console.error('Erro ao processar venda:', error);
      gerarNotificacao('error', 'Erro ao processar venda');
    } finally {
      setIsProcessingSale(false);
    }
  };

  // Função para obter descrição do método de pagamento para o recibo
  const getPaymentMethodDescription = (paymentData: any) => {
    if (paymentData.payment_type === 'CREDIT') {
      return 'Venda a Prazo (Fiado)';
    } else if (paymentData.payment_type === 'PARTIAL') {
      return `Entrada Parcial (${paymentData.payment_splits.length > 1 ? 'Pagamento Dividido' : paymentData.payment_splits[0]?.method || 'Dinheiro'})`;
    } else {
      return paymentData.payment_splits.length > 1
        ? 'Pagamento Dividido'
        : paymentData.payment_splits[0]?.method || 'Dinheiro';
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = prev - 1;
      return newQuantity > 0 ? newQuantity : 1;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Sem categoria';
  };

  // Calcular estatísticas para os cards
  const totalProducts = products.length;
  const totalSales = 0; // Isso viria de uma API de vendas
  const totalRevenue = 0; // Isso viria de uma API de vendas
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Add getTotalWithDiscountValue function if it doesn't exist
  const getTotalWithDiscountValue = () => {
    return typeof totalWithDiscount === 'function'
      ? totalWithDiscount()
      : totalWithDiscount;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendas</h2>
          <p className="text-muted-foreground">
            Gerencie suas vendas e produtos
          </p>
        </div>
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => setIsScannerOpen(true)}
          >
            <Barcode className="h-4 w-4 mr-2" />
            Escanear
          </Button> */}

          <EnhancedBarcodeScanner
          onScan={handleEnhancedBarcodeScan}
          buttonLabel="Escanear"
          formatPrice={formatPrice}
          onClose={() => setIsScannerOpen(false)}
          sellers={sellers}
          selectedSeller={selectedSeller}
          onSellerChange={handleSellerChange}
        />
          <Button
            variant="default"
            size="sm"
            className="sm:hidden"
            onClick={() => setShowCartSheet(true)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Carrinho
            {items.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {items.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SalesStatsCard
          title="Produtos"
          value={totalProducts}
          description="Total de produtos"
          icon={<Package className="h-4 w-4" />}
          variant="default"
        />
        <SalesStatsCard
          title="Vendas Hoje"
          value={totalSales}
          description="Total de vendas do dia"
          icon={<ShoppingCart className="h-4 w-4" />}
          variant="success"
        />
        <SalesStatsCard
          title="Faturamento"
          value={formatPrice(totalRevenue)}
          description="Receita total do dia"
          icon={<Tag className="h-4 w-4" />}
          variant="blue"
        />
        <SalesStatsCard
          title="Ticket Médio"
          value={formatPrice(averageTicket)}
          description="Valor médio por venda"
          icon={<Users className="h-4 w-4" />}
          variant="purple"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <CardTitle>Produtos</CardTitle>
                  <CardDescription>
                    {filteredProducts.length} produtos encontrados
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-[260px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar produtos..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Botões para alternar visualização */}
                  <div className="hidden sm:flex rounded-md border overflow-hidden">
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'ghost'}
                      size="icon"
                      className="rounded-none h-9 w-9 border-0"
                      onClick={() => setViewMode('table')}
                    >
                      <ListFilter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      className="rounded-none h-9 w-9 border-0"
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ProductFilters
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />

                {isLoading ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {Array(8)
                        .fill(null)
                        .map((_, index) => (
                          <div key={index} className="space-y-2">
                            <Skeleton className="h-40 w-full rounded-lg" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="flex items-center justify-between py-4">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                      <div className="border rounded-md">
                        <table className="w-full">
                          <thead>
                            <tr>
                              {Array(5)
                                .fill(null)
                                .map((_, index) => (
                                  <th key={index} className="p-2">
                                    <Skeleton className="h-4 w-24" />
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Array(5)
                              .fill(null)
                              .map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                  {Array(5)
                                    .fill(null)
                                    .map((_, colIndex) => (
                                      <td key={colIndex} className="p-2">
                                        <Skeleton className="h-6 w-24" />
                                      </td>
                                    ))}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                ) : filteredProducts.length === 0 ? (
                  <EmptyState
                    title="Nenhum produto encontrado"
                    description="Tente ajustar os filtros ou realizar uma nova busca."
                    icon={
                      <Search className="h-12 w-12 text-muted-foreground" />
                    }
                    action={{
                      label: 'Limpar filtros',
                      onClick: () => {
                        setSearchTerm('');
                        setSelectedCategory(null);
                      },
                    }}
                  />
                ) : viewMode === 'grid' ? (
                  <ProductGrid
                    products={filteredProducts}
                    isLoading={isLoading}
                    onProductSelect={handleProductSelect}
                    onQuickAddToCart={handleQuickAddToCart}
                  />
                ) : (
                  <ProductTable
                    products={filteredProducts}
                    isLoading={isLoading}
                    onProductSelect={handleProductSelect}
                    onQuickAddToCart={handleQuickAddToCart}
                    getCategoryName={getCategoryName}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Histórico de vendas recentes */}
          <Card className="hidden sm:block">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Vendas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <p>As vendas recentes aparecerão aqui.</p>
                <p className="text-sm">
                  Finalize uma venda para ver o histórico.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                Ver todas as vendas
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Painel do carrinho (visível apenas em telas grandes) */}
        <div className="hidden lg:block">
          <CartPanel
            items={items}
            total={typeof total === 'function' ? total() : total}
            discount={discount}
            totalWithDiscount={
              typeof totalWithDiscount === 'function'
                ? totalWithDiscount()
                : totalWithDiscount
            }
            onRemoveItem={removeItem}
            onUpdateQuantity={updateQuantity}
            onApplyDiscount={setDiscount}
            onFinalizeSale={handleFinalizeSale}
          />
        </div>
      </div>

      {/* Modal de detalhes do produto */}
      <ProductDetailsDialog
      onVariantChange={handleSelectChange}
        product={selectedProduct}
        isOpen={showProductDetails}
        onClose={() => setShowProductDetails(false)}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
        sellers={sellers}
        selectedSeller={selectedSeller}
        onSellerChange={handleSellerChange}
      />

      {/* Modal de finalização de venda */}
      <FinalizeSaleDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        items={items}
        total={typeof total === 'function' ? total() : total}
        discount={discount}
        totalWithDiscount={
          typeof totalWithDiscount === 'function'
            ? totalWithDiscount()
            : totalWithDiscount
        }
        onFinalize={handleProcessSale}
        isProcessing={isProcessingSale}
      />

      {/* Comprovante de venda */}
      {saleReceipt && (
        <SalesReceipt
          open={isReceiptOpen}
          onOpenChange={setIsReceiptOpen}
          sale={saleReceipt}
        />
      )}

      {/* Sheet do carrinho para dispositivos móveis */}
      <Sheet open={showCartSheet} onOpenChange={setShowCartSheet}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0">
          <div className="h-full">
            <CartPanel
              items={items}
              total={typeof total === 'function' ? total() : total}
              discount={discount}
              totalWithDiscount={
                typeof totalWithDiscount === 'function'
                  ? totalWithDiscount()
                  : totalWithDiscount
              }
              onRemoveItem={removeItem}
              onUpdateQuantity={updateQuantity}
              onApplyDiscount={setDiscount}
              onFinalizeSale={() => {
                setShowCartSheet(false);
                handleFinalizeSale();
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Scanner de código de barras */}
      {/* {isScannerOpen && (
        
      )} */}
    </div>
  );
}
