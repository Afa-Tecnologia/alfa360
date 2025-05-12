'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useCaixaStore } from '@/stores/caixa-store';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { ArrowDown, ArrowUp, AlertCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  saldoFinal: z.string().min(1, {
    message: 'O saldo final é obrigatório.',
  }),
  observacao: z.string().optional(),
});

interface FecharCaixaFormProps {
  caixaId: number;
  saldoAtual: number;
  onSuccess: () => void;
}

export function FecharCaixaForm({
  caixaId,
  saldoAtual,
  onSuccess,
}: FecharCaixaFormProps) {
  const { toast } = useToast();
  const { closeCaixa, isLoading } = useCaixaStore();
  const [submitting, setSubmitting] = useState(false);
  const [diferenca, setDiferenca] = useState(0);
  const [temDiferenca, setTemDiferenca] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      saldoFinal: saldoAtual.toFixed(2).replace('.', ','),
      observacao: '',
    },
  });

  const calcularDiferenca = (valor: string) => {
    const saldoFinal = parseFloat(valor.replace(',', '.'));
    if (!isNaN(saldoFinal)) {
      const diff = saldoFinal - saldoAtual;
      setDiferenca(diff);
      setTemDiferenca(Math.abs(diff) > 0.01); // Considerar diferenças maiores que 1 centavo
    } else {
      setDiferenca(0);
      setTemDiferenca(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);
      const saldoFinal = parseFloat(values.saldoFinal.replace(',', '.'));

      if (isNaN(saldoFinal) || saldoFinal < 0) {
        toast({
          title: 'Valor inválido',
          description: 'Insira um valor numérico válido para o saldo final.',
          variant: 'destructive',
        });
        return;
      }

      await closeCaixa(caixaId, saldoFinal, values.observacao);

      toast({
        title: 'Caixa fechado',
        description: 'O caixa foi fechado com sucesso.',
      });

      onSuccess();
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      toast({
        title: 'Erro ao fechar caixa',
        description: 'Houve um problema ao fechar o caixa. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Saldo Calculado</p>
            <p className="text-lg font-bold">{formatCurrency(saldoAtual)}</p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="saldoFinal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo Final em Dinheiro (R$)</FormLabel>
              <FormControl>
                <Input
                  placeholder="0,00"
                  {...field}
                  type="text"
                  inputMode="decimal"
                  onChange={(e) => {
                    // Permitir apenas números e vírgula/ponto
                    const value = e.target.value.replace(/[^0-9.,]/g, '');
                    field.onChange(value);
                    calcularDiferenca(value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Informe o valor real em caixa no momento do fechamento
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {temDiferenca && (
          <Alert
            variant={diferenca > 0 ? 'default' : 'destructive'}
            className="mt-2"
          >
            <div className="flex items-center gap-2">
              {diferenca > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <AlertTitle
                className={diferenca > 0 ? 'text-green-600' : 'text-red-600'}
              >
                {diferenca > 0 ? 'Sobra' : 'Falta'} em caixa
              </AlertTitle>
            </div>
            <AlertDescription className="mt-1">
              Há uma {diferenca > 0 ? 'sobra' : 'falta'} de{' '}
              <span
                className={cn(
                  'font-semibold',
                  diferenca > 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {formatCurrency(Math.abs(diferenca))}
              </span>{' '}
              entre o saldo calculado e o valor informado.
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="observacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observações sobre o fechamento do caixa"
                  {...field}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Alert
          variant="default"
          className="bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700"
        >
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">
            Atenção
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            Esta ação não pode ser desfeita. Após fechar o caixa, você precisará
            abrir um novo.
          </AlertDescription>
        </Alert>

        <Button
          type="submit"
          className="w-full"
          disabled={submitting || isLoading}
        >
          {submitting || isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fechando caixa...
            </>
          ) : (
            'Fechar Caixa'
          )}
        </Button>
      </form>
    </Form>
  );
}
