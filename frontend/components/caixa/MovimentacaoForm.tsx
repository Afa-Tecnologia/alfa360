'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IStatus } from '@/types/caixa';
import { gerarNotificacao } from '@/utils/toast';

interface MovimentacaoFormProps {
  status?: IStatus;
  onCreateMovimentacao: (caixaId: string, data: any) => Promise<void>;
}

export function MovimentacaoForm({
  onCreateMovimentacao,
  status,
}: MovimentacaoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      type: 'entrada',
      value: '',
      description: '',
      payment_method: '',
      local: '',
    },
  });

  const onSubmit = async (values: {
    type: string;
    value: string;
    description: string;
    payment_method: string;
    local: string;
  }) => {
    if (!status?.id) return;
    setIsLoading(true);
    try {
      await onCreateMovimentacao(status?.id, {
        ...values,
        value: Number(values.value),
      });
      form.reset();
    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Movimentação</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pagamento</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value} // Garante que o valor seja mantido corretamente
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MONEY">Dinheiro</SelectItem>
                      <SelectItem value="CREDIT_CARD">
                        Cartão de Crédito
                      </SelectItem>
                      <SelectItem value="DEBIT_CARD">
                        Cartão de Débito
                      </SelectItem>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="TRANSFER">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local da Movimentação</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value} // Garante que o valor seja mantido corretamente
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Local " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="loja">Loja Fisica</SelectItem>
                      <SelectItem value="ecommerce">Ecommerce</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrar Movimentação'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
