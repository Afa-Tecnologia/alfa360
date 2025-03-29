'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface AbrirCaixaModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (valor: number, observacao?: string) => Promise<void>;
  isLoading: boolean;
}

export function AbrirCaixaModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
}: AbrirCaixaModalProps) {
  const [valorInicial, setValorInicial] = useState<string>('');
  const [observacao, setObservacao] = useState<string>('');
  const [error, setError] = useState<string>('');


  // Formatar o valor para exibição
  const valorFormatado = valorInicial
    ? formatCurrency(Number(valorInicial))
    : 'R$ 0,00';

  // Validar o valor inicial
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9,.]/g, '');

    // Converter para formato numérico (aceitando vírgula ou ponto)
    const numericValue = value.replace(',', '.');

    if (isNaN(Number(numericValue))) {
      setError('Digite um valor válido');
    } else {
      setError('');
    }

    setValorInicial(numericValue);
  };

  // Confirmar a abertura do caixa
  const handleConfirm = async () => {
    if (!valorInicial || isNaN(Number(valorInicial))) {
      setError('Digite um valor válido para o saldo inicial');
      return;
    }

    try {
      await onConfirm(Number(valorInicial), observacao);
      resetForm();
    } catch (error) {
      // O erro já é tratado no hook
    }
  };

  // Resetar o formulário
  const resetForm = () => {
    setValorInicial('');
    setObservacao('');
    setError('');
  };

  // Limpar o formulário quando o modal for fechado
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Abrir Caixa</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valorInicial" className="text-right">
              Saldo Inicial
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="valorInicial"
                placeholder="0,00"
                value={valorInicial}
                onChange={handleValorChange}
                className={error ? 'border-red-500' : ''}
              />
              {valorInicial && (
                <p className="text-sm text-muted-foreground">
                  Valor formatado: {valorFormatado}
                </p>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="observacao" className="text-right">
              Observação
            </Label>
            <Textarea
              id="observacao"
              placeholder="Observações sobre a abertura do caixa (opcional)"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !valorInicial || error !== ''}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Abrindo...
              </>
            ) : (
              'Abrir Caixa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
