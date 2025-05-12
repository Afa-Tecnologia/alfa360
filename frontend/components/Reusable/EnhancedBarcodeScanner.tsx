'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Barcode,
  Minus,
  Plus,
  Trash2,
  Check,
  ChevronsUpDown,
  Loader2,
  User,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import Image from 'next/image';

import ProductService from '@/services/productService';
import { Product } from '@/types/sales';

export type ScannedItem = {
  code: string;
  quantity: number;
  product?: Product;
  variantId?: number;
};

interface EnhancedBarcodeScannerProps {
  onScan: (result: ScannedItem[] | any) => void;
  buttonSize?: 'sm' | 'md' | 'lg';
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  timeout?: number;
  formatPrice?: (price: number) => string;
  className?: string;
  onClose?: () => void;
  sellers?: any[];
  selectedSeller?: any;
  onSellerChange?: (seller: any) => void;
}

export function EnhancedBarcodeScanner({
  onScan,
  buttonSize = 'md',
  buttonLabel,
  buttonIcon,
  timeout = 100,
  formatPrice = (price) =>
    price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  className = '',
  onClose,
  sellers,
  selectedSeller,
  onSellerChange,
}: EnhancedBarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState('');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<{
    id?: number;
    name?: string;
  }>({
    id: undefined,
    name: undefined,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [openSellerPopover, setOpenSellerPopover] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define o tamanho do botão
  const buttonClasses = {
    sm: 'h-8 px-2',
    md: 'h-10 px-4',
    lg: 'h-12 px-6',
  };

  // Formata produto da API
  const formatProductFromAPI = (product: any): Product => {
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

  // Função para buscar o produto pelo código de barras
  const fetchProductByBarcode = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      const product = await ProductService.getProductByBarcode(code);
      if (product) {
        const formattedProduct = formatProductFromAPI(product);
        setCurrentProduct(formattedProduct);

        // Define a primeira variante como padrão, se existir
        if (formattedProduct.variants && formattedProduct.variants.length > 0) {
          const defaultVariant = formattedProduct.variants[0];
          setSelectedVariant({
            id: defaultVariant.id,
            name: `${defaultVariant.color} - ${defaultVariant.size}`,
          });
        } else {
          setSelectedVariant({ id: undefined, name: undefined });
        }

        return formattedProduct;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para processar o código de barras após timeout
  const processBarcode = useCallback(
    async (code: string) => {
      if (code.trim() === '') return;

      console.log('Código de barras detectado:', code);
      setBarcodeValue('');

      const product = await fetchProductByBarcode(code);
      if (!product) {
        // Limpa o campo para próxima leitura
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [fetchProductByBarcode]
  );

  // Manipulador de mudança de input
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setBarcodeValue(value);

      // Reseta o timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Define um novo timeout para processar o código após um breve delay
      timeoutRef.current = setTimeout(() => {
        processBarcode(value);
      }, 100);
    },
    [processBarcode]
  );

  // Manipulador de tecla pressionada
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Evita que o Enter faça submit do formulário
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Processa o código apenas se tiver algum valor
        if (barcodeValue.trim() !== '') {
          processBarcode(barcodeValue);
        }
      }
    },
    [barcodeValue, processBarcode]
  );

  // Função para selecionar variante
  const handleSelectVariant = (variantId: number) => {
    if (!currentProduct) return;

    const variant = currentProduct.variants.find((v) => v.id === variantId);
    if (!variant) return;

    setSelectedVariant({
      id: variant.id,
      name: `${variant.color} - ${variant.size}`,
    });
  };

  // Função para adicionar ao carrinho temporário
  const handleAddToScannedItems = () => {
    if (!currentProduct) return;

    // Verificar se o vendedor foi selecionado
    if (sellers && sellers.length > 0 && onSellerChange && !selectedSeller) {
      alert('Por favor, selecione um vendedor antes de adicionar o produto.');
      return;
    }

    const existingItemIndex = scannedItems.findIndex(
      (item) =>
        item.code === currentProduct.code &&
        item.variantId === selectedVariant.id
    );

    if (existingItemIndex >= 0) {
      // Incrementa a quantidade
      const updatedItems = [...scannedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setScannedItems(updatedItems);
    } else {
      // Adiciona novo item com informações do vendedor, se disponível
      const newItem = {
        code: currentProduct.code,
        quantity: 1,
        product: {
          ...currentProduct,
          vendedor_id: selectedSeller?.id,
          vendedor_nome: selectedSeller?.name,
        },
        variantId: selectedVariant.id,
      };
      setScannedItems([...scannedItems, newItem]);
    }

    // Limpa produto atual e variante
    setCurrentProduct(null);
    setSelectedVariant({ id: undefined, name: undefined });
  };

  // Função para ajustar a quantidade
  const adjustQuantity = useCallback(
    (index: number, amount: number) => {
      const updatedItems = [...scannedItems];
      updatedItems[index].quantity = Math.max(
        1,
        updatedItems[index].quantity + amount
      );
      setScannedItems(updatedItems);
    },
    [scannedItems]
  );

  // Função para remover um item
  const removeItem = useCallback(
    (index: number) => {
      setScannedItems(scannedItems.filter((_, i) => i !== index));
    },
    [scannedItems]
  );

  // Função para finalizar e enviar os itens escaneados
  const finishScanning = useCallback(() => {
    if (scannedItems.length > 0) {
      onScan(scannedItems);
      setScannedItems([]);
      setIsOpen(false);
    }
  }, [scannedItems, onScan]);

  // Função para fechar o scanner
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Foca o input quando o modal for aberto
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Limpa o timeout quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Verifica se está executando no cliente e foi montado
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size={buttonSize as any}
        className={cn(buttonClasses[buttonSize], className)}
        onClick={() => setIsOpen(true)}
      >
        {buttonIcon || <Barcode className="h-4 w-4 mr-2" />}
        {buttonLabel || 'Escanear código'}
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && onClose) {
            onClose();
          }
          setIsOpen(open);
        }}
      >
        <DialogContent
          className="sm:max-w-lg"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Leitura de Código de Barras</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Posicione o leitor sobre o código de barras e aguarde a leitura
              automática.
            </p>

            <Input
              ref={inputRef}
              type="text"
              placeholder="Código de barras será exibido aqui"
              value={barcodeValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="text-center text-lg"
              autoFocus
            />

            {isLoading && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {currentProduct && !isLoading && (
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 relative rounded-md bg-muted overflow-hidden flex-shrink-0">
                    {currentProduct.variants[0]?.images[0] ? (
                      <Image
                        src={currentProduct.variants[0].images[0]}
                        alt={currentProduct.name}
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
                  <div className="flex-1">
                    <h3 className="font-medium">{currentProduct.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentProduct.brand}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Código: {currentProduct.code}
                    </p>
                    <p className="text-primary font-medium">
                      {formatPrice(currentProduct.sellingPrice)}
                    </p>
                  </div>
                </div>

                {/* Variantes */}
                {currentProduct &&
                  currentProduct.variants &&
                  currentProduct.variants.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <Label>Variante</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {selectedVariant.name || 'Selecione uma variante'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar variante..." />
                            <CommandList>
                              <CommandEmpty>
                                Nenhuma variante encontrada.
                              </CommandEmpty>
                              <CommandGroup>
                                {currentProduct.variants.map((variant) => (
                                  <CommandItem
                                    key={variant.id}
                                    value={`${variant.color} - ${variant.size}`}
                                    onSelect={() =>
                                      handleSelectVariant(variant.id)
                                    }
                                    disabled={variant.quantity <= 0}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span>
                                        {variant.color} - {variant.size}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className={`ml-2 ${
                                          variant.quantity > 0
                                            ? 'text-green-600'
                                            : 'text-red-500'
                                        }`}
                                      >
                                        {variant.quantity > 0
                                          ? `${variant.quantity} em estoque`
                                          : 'Sem estoque'}
                                      </Badge>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                {/* Seletor de Vendedor */}
                {sellers && sellers.length > 0 && onSellerChange && (
                  <div className="space-y-2 mt-4">
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
                          <User className="ml-2 h-4 w-4 opacity-50" />
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
                              {sellers.map((seller) => (
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
                )}

                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleAddToScannedItems}
                    disabled={
                      !currentProduct ||
                      (currentProduct.variants &&
                        currentProduct.variants.length > 0 &&
                        !selectedVariant.id) ||
                      (sellers &&
                        sellers.length > 0 &&
                        onSellerChange &&
                        !selectedSeller)
                    }
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            )}

            {scannedItems.length > 0 && (
              <div className="border rounded-md mt-4">
                <div className="p-2 bg-muted font-medium border-b">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-6">Produto</div>
                    <div className="col-span-4 text-center">Qtd</div>
                    <div className="col-span-2 text-right">Ações</div>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {scannedItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 border-b last:border-b-0 grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-6 truncate">
                        {item.product?.name || item.code}
                        {item.product && item.variantId && (
                          <div className="text-xs text-muted-foreground">
                            {
                              item.product.variants.find(
                                (v) => v.id === item.variantId
                              )?.color
                            }{' '}
                            -
                            {
                              item.product.variants.find(
                                (v) => v.id === item.variantId
                              )?.size
                            }
                          </div>
                        )}
                      </div>
                      <div className="col-span-4 flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => adjustQuantity(index, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2 w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => adjustQuantity(index, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="col-span-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between flex-row">
            <div className="text-sm">
              {scannedItems.length > 0 ? (
                <>
                  {scannedItems.length}{' '}
                  {scannedItems.length === 1 ? 'item' : 'itens'} (
                  {scannedItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}{' '}
                  unidades)
                </>
              ) : (
                <span>&nbsp;</span>
              )}
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="destructive">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="default"
                onClick={finishScanning}
                disabled={scannedItems.length === 0}
              >
                Concluir
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
