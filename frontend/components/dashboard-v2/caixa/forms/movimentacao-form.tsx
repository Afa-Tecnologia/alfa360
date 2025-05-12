'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useCaixaStore } from '@/stores/caixa-store';
import { usePaymentMethodStore } from '@/stores/paymentMethodStore';
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
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  valor: z.string().min(1, {
    message: 'O valor é obrigatório.',
  }),
  descricao: z.string().min(3, {
    message: 'A descrição deve ter pelo menos 3 caracteres.',
  }),
  metodo_pagamento: z.string().optional(),
  local: z.string().default('loja'),
});

interface MovimentacaoFormProps {
  tipo: 'entrada' | 'saida';
  caixaId: number | undefined;
  onSuccess: () => void;
}

export function MovimentacaoForm({
  tipo,
  caixaId,
  onSuccess,
}: MovimentacaoFormProps) {
  console.log('DEBUG - caixaId recebido:', caixaId, 'tipo:', typeof caixaId);

  const { toast } = useToast();
  const { createMovimentacao, isLoading } = useCaixaStore();
  const {
    paymentMethods,
    fetchPaymentMethods,
    isLoading: isLoadingPaymentMethods,
  } = usePaymentMethodStore();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethodsError, setPaymentMethodsError] = useState(false);

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        setPaymentMethodsError(false);
        await fetchPaymentMethods();
      } catch (error) {
        console.error('Erro ao carregar métodos de pagamento:', error);
        setPaymentMethodsError(true);
      }
    }

    loadPaymentMethods();
  }, [fetchPaymentMethods]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valor: '',
      descricao: '',
      metodo_pagamento: 'MONEY',
      local: 'loja',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);
      console.log('DEBUG - Iniciando submissão do formulário de movimentação');
      console.log('DEBUG - Valores:', values);

      const valor = parseFloat(values.valor.replace(',', '.'));
      console.log('DEBUG - Valor convertido:', valor);

      if (isNaN(valor) || valor <= 0) {
        console.log('DEBUG - Valor inválido');
        toast({
          title: 'Valor inválido',
          description: 'Insira um valor numérico positivo.',
          variant: 'destructive',
        });
        return;
      }

      if (!caixaId) {
        console.log('DEBUG - caixaId não encontrado:', caixaId);
        toast({
          title: 'Erro ao registrar movimentação',
          description: 'ID do caixa não encontrado. Tente novamente.',
          variant: 'destructive',
        });
        return;
      }

      console.log('DEBUG - Chamando createMovimentacao com:', {
        caixa_id: caixaId,
        type: tipo,
        value: valor,
        description: values.descricao,
        payment_method: values.metodo_pagamento,
        local: values.local,
      });

      await createMovimentacao({
        caixa_id: caixaId,
        type: tipo,
        value: valor,
        description: values.descricao,
        payment_method: values.metodo_pagamento,
        local: values.local,
      });

      console.log('DEBUG - Movimentação registrada com sucesso');
      toast({
        title: 'Movimentação registrada',
        description: `A ${tipo === 'entrada' ? 'entrada' : 'saída'} foi registrada com sucesso.`,
      });

      onSuccess();
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      toast({
        title: 'Erro ao registrar movimentação',
        description:
          'Houve um problema ao registrar a movimentação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
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
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    tipo === 'entrada'
                      ? 'Descreva a origem da entrada (ex: Venda, Devolução)'
                      : 'Descreva o motivo da saída (ex: Pagamento, Despesa)'
                  }
                  {...field}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metodo_pagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pagamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método de pagamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingPaymentMethods ? (
                    <SelectItem value="loading" disabled>
                      Carregando métodos de pagamento...
                    </SelectItem>
                  ) : paymentMethodsError ? (
                    <>
                      <SelectItem
                        value="error"
                        disabled
                        className="text-red-500"
                      >
                        Erro ao carregar métodos de pagamento
                      </SelectItem>
                      <SelectItem value="MONEY">Dinheiro</SelectItem>
                      <SelectItem value="CREDIT_CARD">
                        Cartão de Crédito
                      </SelectItem>
                      <SelectItem value="DEBIT_CARD">
                        Cartão de Débito
                      </SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="CONDITIONAL">Condicional</SelectItem>
                    </>
                  ) : paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.code}>
                        {method.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="MONEY">Dinheiro</SelectItem>
                      <SelectItem value="CREDIT_CARD">
                        Cartão de Crédito
                      </SelectItem>
                      <SelectItem value="DEBIT_CARD">
                        Cartão de Débito
                      </SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="CONDITIONAL">Condicional</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                {tipo === 'entrada'
                  ? 'Selecione como o pagamento foi realizado'
                  : 'Selecione qual método de pagamento foi utilizado para a saída'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="local"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="loja">Loja Física</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Selecione onde a operação foi realizada
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={
            tipo === 'entrada'
              ? 'bg-green-600 hover:bg-green-700 w-full'
              : 'w-full'
          }
          variant={tipo === 'entrada' ? 'default' : 'destructive'}
          disabled={submitting || isLoading}
        >
          {submitting || isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            `Registrar ${tipo === 'entrada' ? 'Entrada' : 'Saída'}`
          )}
        </Button>
      </form>
    </Form>
  );
}
