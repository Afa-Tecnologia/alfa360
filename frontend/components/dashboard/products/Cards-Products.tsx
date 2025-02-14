import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { api } from "@/app/api/api";
import { gerarNotificacao } from "@/utils/toast";
import { useCartStore } from "@/stores/useCartStore";

interface Product {
  id: string;
  name: string;
  description: string;
  selling_price: string;
}
export default function CardsProducts() {
  const [products, setProducts] = useState<Product[]>([]);


  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get("/produtos");
        setProducts(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar produtos:", error);
        gerarNotificacao("error", error.response?.data?.message || "Erro desconhecido");
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product?.id}
          name={product?.name}
          description={product?.description}
          price={parseFloat(product?.selling_price)}
          image="/placeholder.svg"
        />
      ))}
    </div>
  );
}

function ProductCard({
  id,
  name,
  description,
  price,
  image,
}: {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Image src={image || "/placeholder.svg"} alt="" width={60} height={60} className="rounded-md" />
        <Button
          variant="outline"
          size="icon"
          onClick={() => addToCart({ id, name, description, selling_price: price.toString() })}
        >
          +
        </Button>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <div className="text-2xl font-bold">R$ {price.toFixed(2)}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

