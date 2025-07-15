'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, Receipt, Tag, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface CartPanelProps {
  items: any[];
  total: number | (() => number);
  discount: number;
  totalWithDiscount: number | (() => number);
  onRemoveItem: (id: number, colorId?: number) => void;
  onUpdateQuantity: (id: number, quantity: number, colorId?: number) => void;
  onApplyDiscount: (discount: number) => void;
  onFinalizeSale: () => void;
}

export function CartPanel({
  items,
  total,
  discount,
  totalWithDiscount,
  onRemoveItem,
  onUpdateQuantity,
  onApplyDiscount,
  onFinalizeSale,
}: CartPanelProps) {
  console.log('items AQUIIII', items);
  const [percentageInput, setPercentageInput] = useState(
    discount > 0
      ? (
          (discount / (typeof total === 'function' ? total() : total)) *
          100
        ).toFixed(1)
      : '0'
  );

  // Formatação de preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // Calcular o total
  const getTotalValue = () => {
    return typeof total === 'function' ? total() : total;
  };

  // Calcular o total com desconto
  const getTotalWithDiscountValue = () => {
    return typeof totalWithDiscount === 'function'
      ? totalWithDiscount()
      : totalWithDiscount;
  };

  // Aplicar desconto em percentual
  const handleApplyPercentageDiscount = () => {
    const parsedPercentage = parseFloat(percentageInput);
    if (
      !isNaN(parsedPercentage) &&
      parsedPercentage >= 0 &&
      parsedPercentage <= 100
    ) {
      const totalValue = getTotalValue();
      const discountValue = (totalValue * parsedPercentage) / 100;
      onApplyDiscount(discountValue);
    }
  };

  // Animações para itens do carrinho
  const itemVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 },
  };

  if (items.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" /> Carrinho
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Seu carrinho está vazio</p>
            <p className="text-xs text-muted-foreground mt-1">
              Adicione produtos para continuar
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" /> Carrinho
          <Badge variant="secondary" className="ml-auto">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="px-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.selectedColorId || 'default'}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="py-3 border-b last:border-b-0"
                >
                  <div className="flex justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() =>
                            onRemoveItem(item.id, item.selectedColorId)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {(item.selectedColor || item.selectedSize) && (
                        <div className="flex gap-2 mt-1">
                          {item.selectedColor && (
                            <Badge variant="outline" className="text-xs">
                              Cor: {item.selectedColor}
                            </Badge>
                          )}
                          {item.selectedSize && (
                            <Badge variant="outline" className="text-xs">
                              Tamanho: {item.selectedSize}
                            </Badge>
                          )}
                        </div>
                      )}

                      {item.vendedor_nome && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Vendedor: {item.vendedor_nome}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 rounded-r-none p-0"
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                                item.selectedColorId
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="h-7 px-2 flex items-center justify-center border-t border-b">
                            {item.quantity}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 rounded-l-none p-0"
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                item.quantity + 1,
                                item.selectedColorId
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(item.sellingPrice * item.quantity)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x {formatPrice(item.sellingPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col p-6 pt-4 space-y-4">
        <Separator />
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium">Subtotal</span>
            <span className="text-xl font-bold">
              {formatPrice(getTotalValue())}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center flex-1 gap-2">
              <div className="relative flex-grow">
                <Input
                  placeholder="Percentual de desconto"
                  value={percentageInput}
                  onChange={(e) => setPercentageInput(e.target.value)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleApplyPercentageDiscount}
            >
              Aplicar
            </Button>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between text-sm text-destructive">
              <span>
                Desconto ({((discount / getTotalValue()) * 100).toFixed(1)}%)
              </span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between font-medium">
            <span className="text-base">Total</span>
            <span className="text-2xl font-bold">
              {formatPrice(getTotalWithDiscountValue())}
            </span>
          </div>

          <Button className="w-full" onClick={onFinalizeSale}>
            Finalizar Venda
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
