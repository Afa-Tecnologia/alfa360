'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { MovimentacaoCaixa } from '@/types/caixa';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { useCaixaStore } from '@/stores/caixaStore';
interface FecharCaixaModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (observacao?: string) => Promise<void>;
  isLoading: boolean;
  saldoInicial: string;
  saldoAtual: string;
  totalEntradas: string;
  totalSaidas: string;
  movimentacoes: MovimentacaoCaixa[];
}

export function FecharCaixaModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
  saldoInicial,
  saldoAtual,
  totalEntradas,
  totalSaidas,
  movimentacoes,
}: FecharCaixaModalProps) {
  const [observacao, setObservacao] = useState<string>('');
  const { status, setStatus } = useCaixaStore();
  // Agrupar movimentações por método de pagamento
  const pagamentosPorMetodo = movimentacoes
    .filter((m) => m.type === 'entrada')
    .reduce(
      (acc, item) => {
        const metodo = item.payment_method || 'Não informado';
        acc[metodo] = (acc[metodo] || 0) + Number(item.value);
        return acc;
      },
      {} as Record<string, number>
    );

  // Traduzir métodos de pagamento
  const traduzirMetodoPagamento = (metodo: string): string => {
    const traducoes: Record<string, string> = {
      MONEY: 'Dinheiro',
      CREDIT_CARD: 'Cartão de Crédito',
      DEBIT_CARD: 'Cartão de Débito',
      pix: 'PIX',
      CONDITIONAL: 'Condicional',
    };

    return traducoes[metodo] || metodo;
  };

  // Confirmar o fechamento do caixa
  const handleConfirm = async () => {
    try {
      await onConfirm(observacao);
      setObservacao('');
      setStatus({ isOpen: false, id: null });
    } catch (error) {
      // O erro já é tratado no hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Fechar Caixa</DialogTitle>
          <DialogDescription>
            Verifique o resumo do caixa antes de fechá-lo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Saldo Inicial:</Label>
              <p className="text-xl font-medium">{saldoInicial}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Saldo Final:</Label>
              <p className="text-xl font-medium">{saldoAtual}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Total de Entradas:
              </Label>
              <p className="text-xl font-medium text-green-600">
                {totalEntradas}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Total de Saídas:</Label>
              <p className="text-xl font-medium text-red-600">{totalSaidas}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Recebimentos por Forma de Pagamento:</Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(pagamentosPorMetodo).map(([metodo, valor]) => (
                <div
                  key={metodo}
                  className="flex justify-between items-center p-2 bg-muted rounded-md"
                >
                  <span>{traduzirMetodoPagamento(metodo)}:</span>
                  <span className="font-medium">{formatCurrency(valor)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="observacao">
              Observação de Fechamento (opcional)
            </Label>
            <Textarea
              id="observacao"
              placeholder="Adicione uma observação sobre o fechamento do caixa"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center p-3 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">
              Atenção: Após fechar o caixa, não será possível realizar novas
              operações até que seja aberto novamente.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Fechar Caixa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
