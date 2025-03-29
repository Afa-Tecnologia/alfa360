'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { useCaixaStore } from '@/stores/caixa-store';
import { formatCurrency } from '@/utils/format';
import { useState } from 'react';
import {
  AlertCircle,
  CircleDollarSign,
  Loader2,
  MessageSquareText,
  Info,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { gerarNotificacao } from '@/utils/toast';
// Esquema de validação
const formSchema = z.object({
  saldoFinalConfirmado: z
    .string()
    .min(1, { message: 'O saldo final é obrigatório' })
    .refine(
      (val) => {
        const numValue = Number(val.replace(/\D/g, '')) / 100;
        return !isNaN(numValue) && numValue >= 0;
      },
      { message: 'O saldo final deve ser um valor numérico válido' }
    ),
  observacao: z
    .string()
    .max(255, { message: 'A observação deve ter no máximo 255 caracteres' })
    .optional(),
});

export type FecharCaixaFormValues = z.infer<typeof formSchema>;

interface FecharCaixaFormProps {
  onSuccess?: () => void;
  caixaId: number;
  saldoAtual: number;
}

export function FecharCaixaForm({
  onSuccess,
  caixaId,
  saldoAtual,
}: FecharCaixaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeCaixa } = useCaixaStore();
  const [divergencia, setDivergencia] = useState<number | null>(null);

  // Formulário
  const form = useForm<FecharCaixaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      saldoFinalConfirmado: formatCurrency(+saldoAtual.toString()),
      observacao: '',
    },
  });

  // Função para formatar o valor como moeda durante a digitação
  const formatarValor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove qualquer caractere que não seja número
    const numericValue = value.replace(/\D/g, '');
    // Converte para número e divide por 100 para obter o valor em reais
    const floatValue = Number(numericValue) / 100;
    // Formata como moeda
    const formattedValue = formatCurrency(+floatValue.toString());

    form.setValue('saldoFinalConfirmado', formattedValue);

    // Calcula a divergência
    const diferenca = floatValue - saldoAtual;
    setDivergencia(diferenca);
  };

  // Manipulador de envio
  async function onSubmit(values: FecharCaixaFormValues) {
    console.log('caixaId', caixaId);
    try {
      setIsSubmitting(true);

      // Converte o valor formatado para número
      const valorNumerico =
        Number(values.saldoFinalConfirmado.replace(/\D/g, '')) / 100;

      // Chama a função do store para fechar o caixa
      await closeCaixa(caixaId, valorNumerico, values.observacao);

      gerarNotificacao('success', 'Caixa fechado com sucesso!');
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      gerarNotificacao('error', 'Erro ao fechar o caixa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Alerta sobre o saldo do sistema */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Saldo do sistema</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              O saldo calculado pelo sistema é:{' '}
              {formatCurrency(+saldoAtual.toString())}
            </span>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-sm">
                Este é o saldo calculado automaticamente com base nas entradas e
                saídas registradas no sistema. Caso exista diferença com o saldo
                físico, informe o valor real e registre uma observação.
              </HoverCardContent>
            </HoverCard>
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="saldoFinalConfirmado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo Final Confirmado</FormLabel>
              <FormControl>
                <div className="relative">
                  <CircleDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="R$ 0,00"
                    {...field}
                    onChange={formatarValor}
                    className="pl-9"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Confirme o valor disponível no caixa no momento do fechamento.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Alerta de divergência */}
        {divergencia !== null && divergencia !== 0 && (
          <Alert variant={divergencia > 0 ? 'default' : 'destructive'}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {divergencia > 0 ? 'Sobra no caixa' : 'Falta no caixa'}
            </AlertTitle>
            <AlertDescription>
              Existe uma diferença de{' '}
              {formatCurrency(+Math.abs(divergencia).toString())}
              {divergencia > 0 ? ' a mais' : ' a menos'} no caixa físico em
              relação ao sistema.
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
                <div className="relative">
                  <MessageSquareText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    placeholder={
                      divergencia !== 0 && divergencia !== null
                        ? `Justifique a ${divergencia > 0 ? 'sobra' : 'falta'} no caixa...`
                        : 'Observações sobre o fechamento do caixa...'
                    }
                    className="min-h-[100px] pl-9 pt-2"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fechando Caixa...
            </>
          ) : (
            'Fechar Caixa'
          )}
        </Button>
      </form>
    </Form>
  );
}
