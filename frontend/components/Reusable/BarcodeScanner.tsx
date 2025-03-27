'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Barcode, Minus, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type ScannedItem = {
  code: string;
  quantity: number;
};

interface BarcodeScannerProps {
  onScan: (result: string | ScannedItem[]) => void;
  buttonSize?: 'sm' | 'md' | 'lg'; // Tamanhos do botão
  buttonLabel?: string; // Texto opcional para o botão
  timeout?: number; // Tempo limite para considerar a leitura completa em ms
  multipleMode?: boolean; // Modo para leitura de múltiplos produtos
}

export function BarcodeScanner({
  onScan,
  buttonSize = 'md',
  buttonLabel,
  timeout = 100, // Tempo padrão para considerar a leitura completa
  multipleMode = false, // Por padrão, modo único
}: BarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState('');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define o tamanho do botão
  const buttonClasses = {
    sm: 'h-8 px-2',
    md: 'h-10 px-4',
    lg: 'h-12 px-6',
  };

  // Função para processar o código de barras após timeout
  const processBarcode = useCallback(
    (code: string) => {
      if (code.trim() !== '') {
        console.log('Código de barras detectado:', code);

        if (multipleMode) {
          // Verifica se o item já foi escaneado
          const existingItemIndex = scannedItems.findIndex(
            (item) => item.code === code
          );

          if (existingItemIndex >= 0) {
            // Incrementa a quantidade
            const updatedItems = [...scannedItems];
            updatedItems[existingItemIndex].quantity += 1;
            setScannedItems(updatedItems);
          } else {
            // Adiciona novo item
            setScannedItems([...scannedItems, { code, quantity: 1 }]);
          }

          // Limpa o campo de entrada para próxima leitura
          setBarcodeValue('');

          // Foca novamente o input para a próxima leitura
          if (inputRef.current) {
            inputRef.current.focus();
          }
        } else {
          // Modo único - comportamento original
          onScan(code);
          setBarcodeValue('');
          setIsOpen(false);
        }
      }
    },
    [onScan, multipleMode, scannedItems]
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
      // Isto permite capturar todo o código antes de processar
      timeoutRef.current = setTimeout(() => {
        processBarcode(value);
      }, timeout);
    },
    [processBarcode, timeout]
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

  // Foca o input quando o modal for aberto
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Pequeno timeout para garantir que o modal está totalmente visível
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

  return (
    <>
      <Button
        variant="outline"
        size={
          buttonSize === 'sm' ? 'sm' : buttonSize === 'lg' ? 'lg' : 'default'
        }
        className={`${buttonClasses[buttonSize]} flex items-center gap-2`}
        onClick={(e) => {
          // Previne que o clique no botão propague para o formulário
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        type="button" // Explicitamente definindo como button para evitar submit
      >
        <Barcode className="h-4 w-4" />
        {buttonLabel && <span>{buttonLabel}</span>}
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          if (!open && multipleMode && scannedItems.length > 0) {
            // Se fechar o modal no modo múltiplo com itens, pergunte ao usuário
            // Para simplificar, estamos apenas limpando aqui, mas você pode adicionar
            // uma confirmação se preferir
            setScannedItems([]);
          }
          setIsOpen(open);
          if (open) {
            setBarcodeValue('');
          }
        }}
      >
        <DialogContent
          className={multipleMode ? 'sm:max-w-lg' : 'sm:max-w-md'}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {multipleMode
                ? 'Leitura de Múltiplos Produtos'
                : 'Leitura de Código de Barras'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-6 space-y-4">
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

            {multipleMode && scannedItems.length > 0 && (
              <div className="mt-4 border rounded-md">
                <div className="p-2 bg-muted font-medium border-b">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-6">Código</div>
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
                      <div className="col-span-6 truncate">{item.code}</div>
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

          <DialogFooter
            className={multipleMode ? 'flex justify-between flex-row' : ''}
          >
            {multipleMode ? (
              <>
                <div className="text-sm">
                  {scannedItems.length}{' '}
                  {scannedItems.length === 1 ? 'item' : 'itens'} (
                  {scannedItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}{' '}
                  unidades)
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
              </>
            ) : (
              <DialogClose asChild>
                <Button type="button" variant="destructive">
                  Cancelar
                </Button>
              </DialogClose>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
