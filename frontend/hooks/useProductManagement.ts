import { useState, useEffect } from 'react';
import { Product } from '@/types/sales';
import ProductService from '@/services/products/ProductServices';
import { gerarNotificacao } from '@/utils/toast';
import { CartItem as CartProduct } from '@/stores/cart-store';

export function useProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null | any>(null);
  const [quantity, setQuantity] = useState(1);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch categories
      const categoriesData = await ProductService.getCategorys();
      setCategories(categoriesData);

      // Fetch products
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

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);

    // Set default values for variants if they exist
    if (product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      setSelectedProduct({
        ...product,
        selectedColor: defaultVariant.color,
        selectedSize: defaultVariant.size,
        selectedColorId: defaultVariant.id,
      });
    }
  };

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

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleBarcodeScan = async (result: string | ScannedItem[]) => {
    try {
      if (typeof result === 'string') {
        // Search for product by barcode in API
        const product = await ProductService.getProductByBarcode(result);
        if (product) {
          // If found, update selected product
          const formattedProduct: Product = formatProductFromApi(product);
          handleProductSelect(formattedProduct);
        } else {
          gerarNotificacao(
            'error',
            'Produto não encontrado com este código de barras'
          );
        }
      } else if (Array.isArray(result)) {
        // Multiple mode - process multiple items
        for (const item of result) {
          const product = await ProductService.getProductByBarcode(item.code);
          if (product) {
            const formattedProduct: Product = formatProductFromApi(product);

            // If it has variants, add the first variant as default
            if (
              formattedProduct.variants &&
              formattedProduct.variants.length > 0
            ) {
              const defaultVariant = formattedProduct.variants[0];
              formattedProduct.selectedColor = defaultVariant.color;
              formattedProduct.selectedSize = defaultVariant.size;
              formattedProduct.selectedColorId = defaultVariant.id;
            }

            return {
              product: formattedProduct as unknown as CartProduct,
              quantity: item.quantity
            };
          } else {
            gerarNotificacao('error', `Produto não encontrado: ${item.code}`);
            return null;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      gerarNotificacao('error', 'Erro ao processar código de barras');
      return null;
    }
  };

  const formatProductFromApi = (product: any): Product => {
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

  useEffect(() => {
    fetchData();
  }, []);

  return {
    products,
    categories,
    isLoading,
    selectedProduct,
    quantity,
    setSelectedProduct,
    handleProductSelect,
    increaseQuantity,
    decreaseQuantity,
    formatPrice,
    handleBarcodeScan,
  };
}

interface ScannedItem {
  code: string;
  quantity: number;
}