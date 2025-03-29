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
import { gerarNotificacao } from '@/utils/toast';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
  Loader2,
  MessageSquareText,
  CreditCard,
  Map,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Esquema de validação
const formSchema = z.object({
  valor: z
    .string()
    .min(1, { message: 'O valor é obrigatório' })
    .refine(
      (val) => {
        const numValue = Number(val.replace(/\D/g, '')) / 100;
        return !isNaN(numValue) && numValue > 0;
      },
      { message: 'O valor deve ser maior que zero' }
    ),
  description: z
    .string()
    .min(3, { message: 'A descrição precisa ter pelo menos 3 caracteres' })
    .max(150, { message: 'A descrição deve ter no máximo 150 caracteres' }),
  payment_method: z
    .string()
    .min(1, { message: 'Selecione o método de pagamento' }),
  local: z.string().min(1, { message: 'Selecione o local da operação' }),
});

export type MovimentacaoFormValues = z.infer<typeof formSchema>;

interface MovimentacaoFormProps {
  onSuccess?: () => void;
  caixaId: string;
  tipoInicial?: 'entrada' | 'saida';
}

export function MovimentacaoForm({
  onSuccess,
  caixaId,
  tipoInicial = 'entrada',
}: MovimentacaoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createMovimentacao } = useCaixaStore();
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida'>(
    tipoInicial
  );

  // Formulário
  const form = useForm<MovimentacaoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valor: '',
      description: '',
      payment_method: '',
      local: 'loja',
    },
  });

  // Função para formatar o valor como moeda durante a digitação
  const formatarValor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove qualquer caractere que não seja número
    const numericValue = value.replace(/\D/g, '');
    // Converte para número e divide por 100 para obter o valor em reais
    const floatValue = Number(numericValue) / 100;

    if (floatValue === 0) {
      form.setValue('valor', '');
      return;
    }

    // Formata como moeda
    const formattedValue = formatCurrency(+floatValue.toString());

    form.setValue('valor', formattedValue);
  };

  // Manipulador de envio
  async function onSubmit(values: MovimentacaoFormValues) {
    try {
      setIsSubmitting(true);

      // Converte o valor formatado para número
      const valorNumerico = Number(values.valor.replace(/\D/g, '')) / 100;

      // Chama a função do store para criar a movimentação
      await createMovimentacao({
        caixa_id: Number(caixaId),
        value: valorNumerico,
        type: tipoMovimentacao,
        description: values.description,
        payment_method: values.payment_method,
        local: values.local,
      });

      gerarNotificacao(
        'success',
        `${tipoMovimentacao === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!`
      );
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      gerarNotificacao(
        'error',
        `Erro ao registrar ${tipoMovimentacao === 'entrada' ? 'entrada' : 'saída'}. Tente novamente.`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs
          defaultValue={tipoInicial}
          onValueChange={(value) =>
            setTipoMovimentacao(value as 'entrada' | 'saida')
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="entrada" className="flex items-center gap-1">
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
              Entrada
            </TabsTrigger>
            <TabsTrigger value="saida" className="flex items-center gap-1">
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
              Saída
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entrada" className="pt-4">
            <FormDescription className="mb-4">
              Registre uma nova entrada de dinheiro no caixa.
            </FormDescription>
          </TabsContent>

          <TabsContent value="saida" className="pt-4">
            <FormDescription className="mb-4">
              Registre uma nova saída de dinheiro do caixa.
            </FormDescription>
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pagamento</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Selecione o método" />
                        </div>
                      </SelectTrigger>
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
                        <SelectItem value="CONDITIONAL">Condicional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
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
                <FormControl>
                  <div className="relative">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <Map className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Selecione o local" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="loja">Loja Física</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <div className="relative">
                  <MessageSquareText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    placeholder={`Descreva o motivo ${tipoMovimentacao === 'entrada' ? 'da entrada' : 'da saída'}...`}
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
              Registrando {tipoMovimentacao === 'entrada' ? 'Entrada' : 'Saída'}
              ...
            </>
          ) : (
            <>
              {tipoMovimentacao === 'entrada' ? (
                <ArrowUpCircle className="mr-2 h-4 w-4" />
              ) : (
                <ArrowDownCircle className="mr-2 h-4 w-4" />
              )}
              Registrar {tipoMovimentacao === 'entrada' ? 'Entrada' : 'Saída'}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
