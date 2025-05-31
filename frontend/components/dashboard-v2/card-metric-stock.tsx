"use client";
import { motion } from "framer-motion";
import { PackageCheck, ArrowUp, ArrowDown, Package } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import ProductService from "@/services/products/ProductServices";


export default function CardProductStock() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await ProductService.getProducts();
      
        setProducts(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Erro ao buscar produtos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const trend = useMemo(() => {

    return {
      isPositive: true,
      value: 5.2, 
    };
  }, []);

  const MetricsLoading = () => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32" />
      </CardContent>
    </Card>
  );

  if (isLoading) return <MetricsLoading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("overflow-hidden")}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtos em Estoque
            </CardTitle>
            <div className="p-2 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <div className="text-2xl font-bold">{products.length}</div>
            {trend && (
              <Badge
                variant="outline"
                className={cn(
                  "ml-2 flex items-center gap-0.5",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {trend.value}%
              </Badge>
            )}
          </div>
          <CardDescription className="mt-1 text-xs">
            Produtos cadastrados no sistema
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
