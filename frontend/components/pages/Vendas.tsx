'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2, ShoppingCart, Barcode } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductService from '@/services/productService';
import { gerarNotificacao } from '@/utils/toast';
import { useCartStore } from '@/stores/cart-store';
import { Product } from '@/types/sales';
import type { Product as CartProduct } from '@/stores/product-store';
import {
  EnhancedBarcodeScanner,
  ScannedItem,
} from '@/components/Reusable/EnhancedBarcodeScanner';
import ProductFilters from '@/components/venda/components/ProductFilters';
import ProductsTable from '@/components/venda/components/ProductsTable';
import ProductGrid from '@/components/venda/components/ProductGrid';
import ProductDetails from '@/components/venda/components/ProductDetails';
import CartPanel from '@/components/venda/components/CartPanel';
import FinalizeSaleModal from '@/components/venda/checkout/FinalizeSaleModal';
import EmptyState from '@/components/venda/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function Vendas() {
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
  const [showCartSheet, setShowCartSheet] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    total,
    discount,
    setDiscount,
    totalWithDiscount,
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

  // Buscar produtos e categorias
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await ProductService.getCategorys();
        setCategories(categoriesData);

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

          addItem(productToAdd as unknown as CartProduct, item.quantity, 0);
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

  const formatProductFromAPI = (product: any): Product => {
    return {
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
    setShowCartSheet(true);
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
  const totalComDesconto = totalWithDiscount();

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
      <div className="border-b px-4 md:px-6 py-3 flex flex-wrap md:flex-nowrap justify-between items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto justify-between">
          <h1 className="text-xl md:text-2xl font-bold">Ponto de Venda</h1>

          {/* Botões para dispositivos móveis */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => setShowCartSheet(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 w-full md:max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <EnhancedBarcodeScanner
            onScan={handleEnhancedBarcodeScan}
            buttonLabel="Ler código"
            formatPrice={formatPrice}
            className="hidden md:flex"
          />
          <EnhancedBarcodeScanner
            onScan={handleEnhancedBarcodeScan}
            buttonIcon={<Barcode className="h-4 w-4" />}
            formatPrice={formatPrice}
            buttonSize="sm"
            className="flex md:hidden"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Painel de produtos */}
        <div className="w-full md:w-2/3 lg:w-2/3 flex flex-col h-full md:border-r">
          {/* Filtros de categorias */}
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Visualização de produtos (tabela ou grade) */}
          <div className="flex-1 overflow-hidden">
            {filteredProducts.length > 0 ? (
              viewMode === 'table' ? (
                <ProductsTable
                  products={filteredProducts}
                  onProductSelect={handleProductSelect}
                  onQuickAddToCart={handleQuickAddToCart}
                  formatPrice={formatPrice}
                  getCategoryName={getCategoryName}
                />
              ) : (
                <ProductGrid
                  products={filteredProducts}
                  onProductSelect={handleProductSelect}
                  onQuickAddToCart={handleQuickAddToCart}
                  formatPrice={formatPrice}
                  getCategoryName={getCategoryName}
                />
              )
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Carrinho para desktop */}
        <div className="hidden md:flex md:w-1/3 lg:w-1/3 flex-col h-full">
          <CartPanel
            items={items}
            removeItem={removeItem}
            updateQuantity={updateQuantity}
            total={total}
            discount={discount}
            setDiscount={setDiscount}
            totalWithDiscount={totalWithDiscount}
            formatPrice={formatPrice}
            onFinalizeSale={handleFinalizeSale}
          />
        </div>

        {/* Carrinho para dispositivos móveis (drawer lateral) */}
        <Sheet open={showCartSheet} onOpenChange={setShowCartSheet}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-md p-0 flex flex-col h-full"
          >
            <CartPanel
              items={items}
              removeItem={removeItem}
              updateQuantity={updateQuantity}
              total={total}
              discount={discount}
              setDiscount={setDiscount}
              totalWithDiscount={totalWithDiscount}
              formatPrice={formatPrice}
              onFinalizeSale={() => {
                setShowCartSheet(false);
                handleFinalizeSale();
              }}
              onCloseSheet={() => setShowCartSheet(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Botão flutuante para finalizar venda em dispositivos móveis */}
        {items.length > 0 && !showCartSheet && (
          <div className="md:hidden fixed bottom-4 right-4 z-50">
            <Button
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
              onClick={() => setShowCartSheet(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {items.length}
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Modal de detalhes do produto e seleção de variantes */}
      <ProductDetails
        open={showProductDetails}
        onOpenChange={setShowProductDetails}
        product={selectedProduct}
        quantity={quantity}
        onIncreaseQuantity={increaseQuantity}
        onDecreaseQuantity={decreaseQuantity}
        onAddToCart={handleAddToCart}
        formatPrice={formatPrice}
      />

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
