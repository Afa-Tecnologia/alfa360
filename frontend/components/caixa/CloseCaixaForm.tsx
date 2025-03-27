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
import { gerarNotificacao } from '@/utils/toast';
import { IStatus } from '@/types/caixa';
import { caixaService } from '@/lib/services/CaixaService';

interface CloseCaixaFormProps {
  onCloseCaixa: (caixaId: string, observation?: string) => Promise<void>;
  status: IStatus;
}

export function CloseCaixaForm({ onCloseCaixa, status }: CloseCaixaFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      observation: '',
    },
  });

  const onSubmit = async (values: { observation: string | any }) => {
    if (!status.id) return;
    setIsLoading(true);
    try {
      await caixaService.closeCaixa(+status.id, values.observation);

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
            <Button type="submit" variant="outline" disabled={isLoading}>
              {isLoading ? 'Fechando...' : 'Fechar Caixa'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
