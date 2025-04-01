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
import { CircleDollarSign, Loader2, MessageSquareText } from 'lucide-react';
import { gerarNotificacao } from '@/utils/toast';
import useAuthStore from '@/stores/authStore';

// Esquema de validação
const formSchema = z.object({
  saldoInicial: z
    .string()
    .min(1, { message: 'O saldo inicial é obrigatório' })
    .refine(
      (val) => {
        const numValue = Number(val.replace(/\D/g, '')) / 100;
        return !isNaN(numValue) && numValue >= 0;
      },
      { message: 'O saldo inicial deve ser um valor numérico válido' }
    ),
  observacao: z
    .string()
    .max(255, { message: 'A observação deve ter no máximo 255 caracteres' })
    .optional(),
});

export type AbrirCaixaFormValues = z.infer<typeof formSchema>;

interface AbrirCaixaFormProps {
  onSuccess?: () => void;
}

export function AbrirCaixaForm({ onSuccess }: AbrirCaixaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openCaixa } = useCaixaStore();
  const user = useAuthStore((state) => state.user);

  // Formulário
  const form = useForm<AbrirCaixaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      saldoInicial: '0,00',
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

    form.setValue('saldoInicial', formattedValue);
  };

  // Manipulador de envio
  async function onSubmit(values: AbrirCaixaFormValues) {
    try {
      setIsSubmitting(true);

      // Converte o valor formatado para número
      const valorNumerico =
        Number(values.saldoInicial.replace(/\D/g, '')) / 100;

      // Chama a função do store para abrir o caixa
      await openCaixa(valorNumerico, user?.id || 0, values.observacao);

      gerarNotificacao('success', 'Caixa aberto com sucesso!');
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      gerarNotificacao('error', 'Erro ao abrir o caixa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="saldoInicial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo Inicial</FormLabel>
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
                Informe o valor disponível no caixa no momento da abertura.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    placeholder="Observações sobre a abertura do caixa..."
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
              Abrindo Caixa...
            </>
          ) : (
            'Abrir Caixa'
          )}
        </Button>
      </form>
    </Form>
  );
}
