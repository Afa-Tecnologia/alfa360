'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { CartItem } from '@/stores/cart-store';

interface CartPanelProps {
  items: CartItem[];
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  total: () => number;
  discount: number;
  setDiscount: (discount: number) => void;
  totalWithDiscount: () => number;
  formatPrice: (price: number) => string;
  onFinalizeSale: () => void;
  onCloseSheet?: () => void;
}

export default function CartPanel({
  items,
  removeItem,
  updateQuantity,
  total,
  discount,
  setDiscount,
  totalWithDiscount,
  formatPrice,
  onFinalizeSale,
  onCloseSheet,
}: CartPanelProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Cabeçalho do carrinho */}
      <div className="p-4 border-b flex items-center gap-2 bg-muted/30">
        <ShoppingCart className="h-5 w-5" />
        <h2 className="text-xl font-bold">Carrinho</h2>
        <Badge variant="secondary" className="ml-auto">
          {items.length} {items.length === 1 ? 'item' : 'itens'}
        </Badge>
        {onCloseSheet && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={onCloseSheet}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Conteúdo do carrinho */}
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <CartItemsList
          items={items}
          removeItem={removeItem}
          updateQuantity={updateQuantity}
          formatPrice={formatPrice}
        />
      )}

      {/* Resumo e finalização */}
      <OrderSummary
        items={items}
        total={total}
        discount={discount}
        setDiscount={setDiscount}
        totalWithDiscount={totalWithDiscount}
        formatPrice={formatPrice}
        onFinalizeSale={onFinalizeSale}
      />
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
      <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
      <h3 className="text-lg font-medium mb-1">Seu carrinho está vazio</h3>
      <p className="text-muted-foreground">
        Adicione produtos para iniciar uma venda
      </p>
    </div>
  );
}

interface CartItemsListProps {
  items: CartItem[];
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  formatPrice: (price: number) => string;
}

function CartItemsList({
  items,
  removeItem,
  updateQuantity,
  formatPrice,
}: CartItemsListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-3 p-4">
        {items.map((item) => (
          <CartItemCard
            key={item.product.id}
            item={item}
            removeItem={removeItem}
            updateQuantity={updateQuantity}
            formatPrice={formatPrice}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

interface CartItemCardProps {
  item: CartItem;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  formatPrice: (price: number) => string;
}

function CartItemCard({
  item,
  removeItem,
  updateQuantity,
  formatPrice,
}: CartItemCardProps) {
  return (
    <div key={item.product.id} className="flex gap-3 pb-3 border-b">
      <div className="relative w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
        {item?.product?.variants[0]?.images[0] ? (
          <Image
            src={item?.product?.variants[0]?.images[0]}
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
        <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
        {item.product.selectedColor && (
          <p className="text-xs text-muted-foreground">
            {item.product.selectedColor}, {item.product.selectedSize}
          </p>
        )}
        {item.product.vendedor_nome && (
          <p className="text-xs text-muted-foreground font-medium">
            Vendedor: {item.product.vendedor_nome}
          </p>
        )}
        <div className="flex justify-between items-center mt-2">
          <QuantityControl
            item={item}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
          />
          <div className="text-right">
            <p className="font-medium">
              {formatPrice(item.product.sellingPrice * item.quantity)}
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
  );
}

interface QuantityControlProps {
  item: CartItem;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
}

function QuantityControl({
  item,
  updateQuantity,
  removeItem,
}: QuantityControlProps) {
  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-none"
        onClick={() => {
          if (item.quantity > 1) {
            updateQuantity(item.product.id, item.quantity - 1);
          } else {
            removeItem(item.product.id);
          }
        }}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center text-sm">{item.quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-none"
        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface OrderSummaryProps {
  items: CartItem[];
  total: () => number;
  discount: number;
  setDiscount: (discount: number) => void;
  totalWithDiscount: () => number;
  formatPrice: (price: number) => string;
  onFinalizeSale: () => void;
}

function OrderSummary({
  items,
  total,
  discount,
  setDiscount,
  totalWithDiscount,
  formatPrice,
  onFinalizeSale,
}: OrderSummaryProps) {
  return (
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
            {formatPrice(totalWithDiscount())}
          </span>
        </div>
      </div>
      <Button
        className="w-full"
        size="default"
        onClick={onFinalizeSale}
        disabled={items.length === 0}
      >
        Finalizar Venda
      </Button>
    </div>
  );
}
