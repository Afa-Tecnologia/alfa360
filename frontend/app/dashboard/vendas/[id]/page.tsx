'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useProductStore } from '@/stores/product-store';
import { useCartStore } from '@/stores/cart-store';
import ProductService from '@/services/products/ProductServices';
import CartSidebar from '@/components/pages/venda/checkout/cart-sidebar';

export default function ProdutoDetalhe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const idProduct = Number.parseInt(id);
  const { products, setProducts } = useProductStore();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [cores, setCores] = useState<string[]>([]);
  const [tamanhos, setTamanhos] = useState<string[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Se já temos os produtos no store, use-os
        if (products.length > 0) {
          const foundProduct = products.find((p) => p.id === idProduct);
          if (foundProduct) {
            setProduct(foundProduct);
            // Extrair variantes
            const { variants } = foundProduct;
            if (variants && variants.length > 0) {
              const uniqueColors = [
                ...new Set(variants.map((v: any) => v.color)),
              ];
              const uniqueSizes = [
                ...new Set(variants.map((v: any) => v.size)),
              ];

              setCores(uniqueColors);
              setTamanhos(uniqueSizes);
              const defaultColor = uniqueColors[0];
              const defaultSize = uniqueSizes[0];
  
              setSelectedColor(defaultColor);
              setSelectedSize(defaultSize);
  
              // Definir o ID da variante correta
              const defaultVariant = variants.find(
                (v: any) => v.color === defaultColor && v.size === defaultSize
              );
              setSelectedColorId(defaultVariant?.id || null);
              setLoading(false);
              return;
            }
          }
        }

        // Caso contrário, busque todos os produtos
        const data = await ProductService.getProducts();
        const formattedData = data.map((p: any) => ({
          ...p,
          sellingPrice: Number.parseFloat(p.selling_price),
          purchasePrice: p.purchase_price,
          stock: p.quantity,
          category: p.categoria_id,
          category_id: p.categoria_id,
        }));
        setProducts(formattedData);

        const foundProduct = formattedData.find((p: any) => p.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
          
          setSelectedColor(cores[0]);
          setSelectedSize(tamanhos[1]);
        }
        
      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, products, setProducts]);

  // console.log('variante ', selectedSize);
  // console.log('id variante ', selectedColorId);
  const handleAddToCart = () => {
    if (product) {
      // Adiciona as informações extras ao produto antes de adicionar ao carrinho
      const productWithVariant = {
        ...product,
        selectedColor,
        selectedSize,
        selectedColorId,
      };
      addItem(productWithVariant, quantity);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">Carregando detalhes do produto...</div>
    );
  }

  if (!product) {
    return <div className="p-6 text-center">Produto não encontrado</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-100px)] p-4">
      <div className="md:col-span-2 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/vendas">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Detalhes do Produto</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.image || '/placeholder.svg?height=600&width=600'}
              alt={product.name}
              fill
              className="object-cover text-background"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">{product.name}</h2>
              <p className="text-lg text-muted-foreground">{product.brand}</p>
              <p className="text-sm mt-1">Código: {product.code}</p>
            </div>

            <div className="text-3xl font-bold">
              {typeof product.sellingPrice === 'number'
                ? product.sellingPrice.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                : `R$ ${product.sellingPrice}`}
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Estoque: {product.quantity} unidades
              </p>
              <p>{product.description}</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Cor</h3>
                <RadioGroup
                  value={selectedColor}
                  onValueChange={(color) => {
                    const colorVariant = product.variants.find(
                      (v: any) => v.color === color
                    );

                    setSelectedColorId(colorVariant.id);

                    setSelectedColor(color);
                  }}
                  className="flex flex-wrap gap-2"
                >
                  {cores.map((cor) => (
                    <div key={cor} className="flex items-center space-x-2">
                      <RadioGroupItem value={cor} id={`cor-${cor}`} />
                      <Label htmlFor={`cor-${cor}`}>
                        {cor.charAt(0).toUpperCase() +
                          cor.slice(1).toLowerCase()}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <h3 className="font-medium mb-2">Tamanho</h3>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={(size) => {
                    const sizeVariant = product.variants.find(
                      (v: any) => v.size === size
                    );

                    setSelectedColorId(sizeVariant.id);

                    setSelectedSize(size);
                  }}
                  className="flex flex-wrap gap-2"
                >
                  {tamanhos.map((tamanho) => (
                    <div key={tamanho} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={tamanho}
                        id={`tamanho-${tamanho}`}
                      />
                      <Label htmlFor={`tamanho-${tamanho}`}>
                        {tamanho.toLocaleUpperCase()}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <h3 className="font-medium mb-2">Quantidade</h3>
                <div className=" flex justify-between items-center">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-4 font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleAddToCart}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carrinho lateral */}
      <CartSidebar />
    </div>
  );
}
