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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TipoMovimentacao } from '@/types/caixa';

interface MovimentacaoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    tipo: TipoMovimentacao,
    valor: number,
    descricao: string,
    formaPagamento?: string
  ) => Promise<void>;
  isLoading: boolean;
  tipo: TipoMovimentacao;
  titulo: string;
}

export function MovimentacaoModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
  tipo,
  titulo,
}: MovimentacaoModalProps) {
  const [valor, setValor] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [formaPagamento, setFormaPagamento] = useState<string>('MONEY');
  const [error, setError] = useState<string>('');

  // Formatar o valor para exibição
  const valorFormatado = valor ? formatCurrency(Number(valor)) : 'R$ 0,00';

  // Validar o valor
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9,.]/g, '');

    // Converter para formato numérico (aceitando vírgula ou ponto)
    const numericValue = value.replace(',', '.');

    if (isNaN(Number(numericValue))) {
      setError('Digite um valor válido');
    } else {
      setError('');
    }

    setValor(numericValue);
  };

  // Confirmar a movimentação
  const handleConfirm = async () => {
    if (!valor || isNaN(Number(valor))) {
      setError('Digite um valor válido');
      return;
    }

    if (Number(valor) <= 0) {
      setError('O valor deve ser maior que zero');
      return;
    }

    if (!descricao.trim()) {
      setError('Digite uma descrição para a movimentação');
      return;
    }

    try {
      await onConfirm(tipo, Number(valor), descricao, formaPagamento);
      resetForm();
    } catch (error) {
      // O erro já é tratado no hook
    }
  };

  // Resetar o formulário
  const resetForm = () => {
    setValor('');
    setDescricao('');
    setFormaPagamento('MONEY');
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
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valor" className="text-right">
              Valor
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="valor"
                placeholder="0,00"
                value={valor}
                onChange={handleValorChange}
                className={error ? 'border-red-500' : ''}
              />
              {valor && (
                <p className="text-sm text-muted-foreground">
                  Valor formatado: {valorFormatado}
                </p>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>

          {tipo === 'entrada' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="formaPagamento" className="text-right">
                Forma de Pagamento
              </Label>
              <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                <SelectTrigger id="formaPagamento" className="col-span-3">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONEY">Dinheiro</SelectItem>
                  <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                  <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="CONDITIONAL">Condicional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="descricao" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              placeholder={`Descreva o motivo ${
                tipo === 'entrada' ? 'da entrada' : 'da saída'
              }`}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
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
            disabled={isLoading || !valor || !descricao || error !== ''}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
