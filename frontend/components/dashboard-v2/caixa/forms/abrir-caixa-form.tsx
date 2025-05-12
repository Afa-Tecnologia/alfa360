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
import { useToast } from '@/components/ui/use-toast';
import useAuthStore from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  saldoInicial: z.string().min(1, {
    message: 'O saldo inicial é obrigatório.',
  }),
  observacao: z.string().optional(),
});

interface AbrirCaixaFormProps {
  onSuccess: () => void;
}

export function AbrirCaixaForm({ onSuccess }: AbrirCaixaFormProps) {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { openCaixa, isLoading } = useCaixaStore();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      saldoInicial: '',
      observacao: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Usuário não identificado. Faça login novamente.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSubmitting(true);
      const saldoInicial = parseFloat(values.saldoInicial.replace(',', '.'));
      
      if (isNaN(saldoInicial) || saldoInicial < 0) {
        toast({
          title: 'Valor inválido',
          description: 'Insira um valor numérico válido para o saldo inicial.',
          variant: 'destructive',
        });
        return;
      }
      
      await openCaixa(saldoInicial, user.id, values.observacao);
      
      toast({
        title: 'Caixa aberto',
        description: 'O caixa foi aberto com sucesso.',
      });
      
      onSuccess();
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      toast({
        title: 'Erro ao abrir caixa',
        description: 'Houve um problema ao abrir o caixa. Tente novamente.',
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
          name="saldoInicial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Saldo Inicial (R$)</FormLabel>
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
              <FormDescription>
                Informe o valor em caixa no início da operação
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
                <Textarea
                  placeholder="Observações sobre a abertura do caixa"
                  {...field}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={submitting || isLoading}>
          {(submitting || isLoading) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Abrindo caixa...
            </>
          ) : (
            'Abrir Caixa'
          )}
        </Button>
      </form>
    </Form>
  );
} 