'use client';

import { Product } from '@/stores/productStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  Tag,
  Truck,
  ShoppingCart,
  DollarSign,
  Palette,
  Ruler,
  Printer,
} from 'lucide-react';
import { BarcodeLabel } from '@/components/estoquenovo/BarcodeLabel';
import Image from 'next/image';
import { ProductEstoque } from '@/types/product';
import { Atributos } from '@/types/estoque';
import { EtiquetaProduto } from '../etiquetas/types/etiqueta.types';

interface ProductDetailsDialogProps {
  product: ProductEstoque | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailsDialog({
  product,
  isOpen,
  onOpenChange,
}: ProductDetailsDialogProps) {
  if (!product) return null;

  // Função para formatar o preço em reais
  const formatCurrency = (value: number | string) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue);
  };

  // Calcula o lucro e a margem de lucro
  const calculateProfit = () => {
    const purchasePrice =
      typeof product.purchase_price === 'string'
        ? parseFloat(product.purchase_price)
        : product.purchase_price;

    const sellingPrice =
      typeof product.selling_price === 'string'
        ? parseFloat(product.selling_price)
        : product.selling_price;

    const profit = sellingPrice - purchasePrice;
    const marginPercentage =
      purchasePrice > 0 ? ((profit / purchasePrice) * 100).toFixed(2) : '0.00';

    return {
      profit: formatCurrency(profit),
      margin: `${marginPercentage}%`,
    };
  };

  const { profit, margin } = calculateProfit();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Produto</DialogTitle>
          <DialogDescription>
            Informações completas sobre o produto e suas variantes
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">
              Informações Gerais
            </TabsTrigger>
            <TabsTrigger value="variants" className="flex-1">
              Variantes
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex-1">
              Financeiro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Tipo</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {product.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Marca</p>
                      <p className="text-sm text-muted-foreground">
                        {product.brand}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Estoque Total</p>
                      <p className="text-sm text-muted-foreground">
                        {product.quantity} unidades
                      </p>
                    </div>
                  </div>

                  {product.code && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Código</p>
                        <p className="text-sm text-muted-foreground">
                          {product.code}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Se houver uma imagem da primeira variante, mostrar */}
              {product.variants?.[0]?.images?.[0] && (
                <div className="w-full md:w-[180px] h-[180px] relative bg-muted rounded-md overflow-hidden">
                  <Image
                    src={product.variants[0].images[0]}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="variants" className="mt-4">
            {product.variants && product.variants.length > 0 ? (
              <div className="border rounded-md">
                {/* Gera todos os atributos únicos presentes nas variantes */}
                {(() => {
                  const uniqueAtributos = Array.from(
                    new Set(
                      product.variants.flatMap(
                        (variant) => variant.atributos?.map((a) => a.name) || []
                      )
                    )
                  );

                  return (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          {uniqueAtributos.map((name, index) => (
                            <TableHead key={index}>{name}</TableHead>
                          ))}
                          <TableHead className="text-right">Estoque</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.variants.map((variant, index) => (
                          <TableRow key={variant.id || index}>
                            <TableCell className="font-medium">
                              {variant.name}
                            </TableCell>
                            {uniqueAtributos.map((name, i) => {
                              const attr = variant.atributos?.find(
                                (a) => a.name === name
                              );
                              return (
                                <TableCell key={i}>
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border" />
                                    {attr?.pivot?.valor || '—'}
                                  </div>
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-right">
                              {variant.stock || variant.quantity || 0}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Este produto não possui variantes cadastradas
              </div>
            )}
          </TabsContent>

          <TabsContent value="financial" className="mt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Preço de Compra</h4>
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(product.purchase_price)}
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Preço de Venda</h4>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(product.selling_price)}
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Lucro por Unidade</h4>
                    <ShoppingCart className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{profit}</p>
                    <p className="text-sm text-muted-foreground">
                      Margem: {margin}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-2">
                  Projeção de Receita (Estoque Atual)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Investimento Total
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(
                        Number(product.purchase_price) *
                          Number(product.quantity)
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Receita Projetada
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(
                        Number(product.selling_price) * Number(product.quantity)
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Lucro Projetado
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(
                        (Number(product.selling_price) -
                          Number(product.purchase_price)) *
                          Number(product.quantity)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
