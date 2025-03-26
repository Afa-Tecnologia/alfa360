// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
// import { Button } from "../../ui/button";
// import { api } from "@/app/api/api";
// import { gerarNotificacao } from "@/utils/toast";
// import { useCartStore } from "@/stores/useCartStore";
// import mockProducts from "./mockProducts";
// import ProductCard from "./Products-Container-Cards";

// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   selling_price: number;
//   image: string;
//   category: string;
//   size?: string;
// }
// export default function CardsProducts() {
//   const [products, setProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     // async function fetchProducts() {
//     //   try {
//     //     const response = await api.get("/produtos");
//     //     setProducts(response.data);
//     //   } catch (error: any) {
//     //     console.error("Erro ao buscar produtos:", error);
//     //     gerarNotificacao("error", error.response?.data?.message || "Erro desconhecido");
//     //   }
//     // }
//     // fetchProducts();
//     setProducts(mockProducts);

//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       {products.map((product) => (
//         <ProductCard key={product.id} product={product} />
//       ))}
//     </div>
//   );
// }

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from 'react-toastify';

export type Product = {
  id: string;
  name: string;
  selling_price: number;
  category?: string;
  image: string;
};

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Item Adicionado', {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <div
      className={cn(
        'product-card animate-fade-in',
        `[animation-delay:${100 + index * 75}ms]`
      )}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium">Visualizar detalhes</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-semibold">
            R$ {product.selling_price.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div>
          <Button
            variant="secondary"
            className="w-full mt-4 hover:bg-secondary-foreground text-black hover:text-white"
            onClick={handleAddToCart}
          >
            Adicionar ao caixa
            <ShoppingCart className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
