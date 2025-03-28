'use client';

import { Product } from '@/types/sales';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useState } from 'react';

interface ProductDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  quantity: number;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onAddToCart: () => void;
  formatPrice: (price: number) => string;
}

export default function ProductDetails({
  open,
  onOpenChange,
  product,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddToCart,
  formatPrice,
}: ProductDetailsProps) {
  if (!product) return null;

  // Estado local para a variante selecionada
  const [selectedVariant, setSelectedVariant] = useState<{
    id?: number;
    name?: string;
  }>({
    id: product.selectedColorId,
    name:
      product.selectedColor && product.selectedSize
        ? `${product.selectedColor} - ${product.selectedSize}`
        : undefined,
  });

  const handleSelectVariant = (variantId: number) => {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return;

    setSelectedVariant({
      id: variant.id,
      name: `${variant.color} - ${variant.size}`,
    });

    // Atualiza o product também para que o onAddToCart use os valores corretos
    product.selectedColor = variant.color;
    product.selectedSize = variant.size;
    product.selectedColorId = variant.id;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar produto</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-square bg-muted rounded-md overflow-hidden">
            {product.variants[0]?.images[0] ? (
              <Image
                src={product.variants[0].images[0]}
                alt={product.name}
                fill
                className="object-cover"
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
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-bold line-clamp-2">{product.name}</h2>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <p className="text-sm text-muted-foreground">
                Código: {product.code}
              </p>
            </div>

            <p className="text-2xl font-bold text-primary">
              {formatPrice(product.sellingPrice)}
            </p>

            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="col-span-2 space-y-4">
            <Separator />

            {product.variants && product.variants.length > 0 && (
              <div>
                {/* Seleção de variante única */}
                <VariantSelector
                  product={product}
                  selectedVariantId={selectedVariant.id}
                  onSelectVariant={handleSelectVariant}
                />
              </div>
            )}

            {/* Quantidade */}
            <div>
              <Label className="font-medium">Quantidade</Label>
              <div className="flex items-center space-x-3 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-16 h-10 border rounded-md flex items-center justify-center">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onIncreaseQuantity}
                  disabled={quantity >= product.quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  Disponível: {product.quantity}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={onAddToCart}
            className="flex-1"
            disabled={!selectedVariant.id && product.variants.length > 0}
          >
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface VariantSelectorProps {
  product: Product;
  selectedVariantId?: number;
  onSelectVariant: (variantId: number) => void;
}

function VariantSelector({
  product,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  if (!product.variants || product.variants.length === 0) return null;

  // Encontrar a variante selecionada
  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  );

  return (
    <div>
      <Label className="font-medium mb-2">Variante</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between mt-2"
          >
            {selectedVariant
              ? `${selectedVariant.color} - ${selectedVariant.size}`
              : 'Selecione uma variante'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar variante..." />
            <CommandEmpty>Nenhuma variante encontrada.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {product.variants.map((variant) => (
                  <CommandItem
                    key={variant.id}
                    value={`${variant.color} ${variant.size}`}
                    onSelect={() => variant.id && onSelectVariant(variant.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span>
                        {variant.color.charAt(0).toUpperCase() +
                          variant.color.slice(1).toLowerCase()}{' '}
                        - {variant.size.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'ml-2',
                          variant.quantity <= 5
                            ? 'text-destructive border-destructive'
                            : ''
                        )}
                      >
                        Estoque: {variant.quantity}
                      </Badge>
                      {selectedVariantId === variant.id && (
                        <Check className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
