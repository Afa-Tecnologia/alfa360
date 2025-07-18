'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, X, Package, Minus, Plus, Check } from 'lucide-react';
import { Product } from '@/types/sales';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { User } from '@/lib/services/UserService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { on } from 'events';

/**
 * Props para o diálogo de detalhes do produto.
 */
export interface ProductDetailsDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onVariantChange: (value: number) => void;
  sellers: User[];
  selectedSeller: User | null;
  onSellerChange: (seller: User) => void;
}

export function ProductDetailsDialog({
  product,
  isOpen,
  onClose,
  quantity,
  onQuantityChange,
  onAddToCart,
  sellers,
  selectedSeller,
  onVariantChange,
  onSellerChange,
}: ProductDetailsDialogProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null
  );
  const [openSellerPopover, setOpenSellerPopover] = useState(false);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
      onVariantChange(product.variants[0].id);
    } else {
      setSelectedVariantId(null);
      onVariantChange(0);
    }
  }, [product, onVariantChange]);

  const selectedVariant = product?.variants.find(
    (v) => v.id === selectedVariantId
  );
  const isSellersArray = Array.isArray(sellers);

  if (!product) return null;

  // Formatação de preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // Formatar data
  const formatDate = (date: Date) => {
    // Check if date is valid before formatting
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Data indisponível';
    }
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col ">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="pr-4 max-h-[calc(90vh-220px)] overflow-y-auto">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative aspect-square bg-muted rounded-md overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <p className="text-muted-foreground">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(product.sellingPrice)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Código: {product.code}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {product.brand || 'Sem marca'}
                    </Badge>
                    <Badge
                      variant={product.stock > 0 ? 'secondary' : 'destructive'}
                    >
                      {product.stock > 0
                        ? `${product.stock} em estoque`
                        : 'Esgotado'}
                    </Badge>
                  </div>

                  {/* Select de variantes */}
                  {product.variants.length > 0 && (
                    <div className="space-y-4">
                      <Separator />
                      <div className="space-y-2">
                        <Label>Variante</Label>
                        <Select
                          value={selectedVariantId?.toString() || ''}
                          onValueChange={(value) => {
                            const variant = product.variants.find(
                              (v) => v.id === Number(value)
                            );
                            setSelectedVariantId(variant?.id || null);
                            onVariantChange(variant?.id || 0);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma variante" />
                          </SelectTrigger>
                          <SelectContent>
                            {product.variants.map((variant) => (
                              <SelectItem
                                key={variant.id}
                                value={variant.id.toString()}
                                disabled={variant.quantity <= 0}
                              >
                                {variant.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Badge de estoque da variante selecionada */}
                      {selectedVariant && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              selectedVariant.quantity > 0
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {selectedVariant.quantity > 0
                              ? `${selectedVariant.quantity} em estoque`
                              : 'Sem estoque'}
                          </Badge>
                        </div>
                      )}
                      <Separator />
                    </div>
                  )}

                  {/* Exibir atributos da variante selecionada */}
                  {selectedVariant && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        {selectedVariant.atributos.map((attr, index) => (
                          <div key={index} className="flex-1">
                            <Label>{attr.name}</Label>
                            <p>{attr.pivot.valor}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seller">Vendedor</Label>
                      <Popover
                        open={openSellerPopover}
                        onOpenChange={setOpenSellerPopover}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {selectedSeller
                              ? selectedSeller.name
                              : 'Selecione um vendedor'}
                            <Check className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar vendedor..." />
                            <CommandList>
                              <CommandEmpty>
                                Nenhum vendedor encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {isSellersArray &&
                                  sellers.map((seller) => (
                                    <CommandItem
                                      key={seller.id}
                                      value={seller.name}
                                      onSelect={() => {
                                        onSellerChange(seller);
                                        setOpenSellerPopover(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          selectedSeller?.id === seller.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {seller.name}
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          onQuantityChange(Math.max(1, quantity - 1))
                        }
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-12 text-center">{quantity}</div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onQuantityChange(quantity + 1)}
                        disabled={
                          !!selectedVariant &&
                          quantity >= selectedVariant.quantity
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Cadastrado em</p>
                  <p>{formatDate(product.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Última atualização</p>
                  <p>{formatDate(product.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="sm:w-auto w-full"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="sm:w-auto w-full"
            onClick={onAddToCart}
            disabled={
              !selectedSeller ||
              !selectedVariantId ||
              (selectedVariant && selectedVariant.quantity <= 0)
            }
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
