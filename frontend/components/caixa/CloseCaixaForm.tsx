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
import { useCaixaStore } from '@/stores/caixaStore';
import { gerarNotificacao } from '@/utils/toast';

interface CloseCaixaFormProps {
  onCloseCaixa: (caixaId: number, observation?: string) => Promise<void>;
}

export function CloseCaixaForm({ onCloseCaixa }: CloseCaixaFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const caixaId = useCaixaStore((state) => state.status.id);

  const form = useForm({
    defaultValues: {
      observation: '',
    },
  });

  const onSubmit = async (values: { observation: string }) => {
    if (!caixaId) return;
    setIsLoading(true);
    try {
      await onCloseCaixa(caixaId, values.observation);

      gerarNotificacao('success', 'Caixa fechado com sucesso');
    } catch (error) {
      gerarNotificacao('error', 'Erro ao fechar o caixa');
      console.error('Erro ao fechar o caixa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fechar Caixa</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? 'Fechando...' : 'Fechar Caixa'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
