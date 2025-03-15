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
import { caixaService } from '@/utils/caixaService';

interface OpenCaixaFormProps {
  // onOpenCaixa: (saldoInicial: number, observation?: string) => Promise<void>;
}

export function OpenCaixaForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      saldo_inicial: '',
      observation: '',
    },
  });

  const onSubmit = async (values: {
    saldo_inicial: string;
    observation: string 
  }) => {
    setIsLoading(true);
    try {
      await caixaService.openCaixa(Number(values.saldo_inicial), values.observation);
    } catch (error) {
      console.error('Erro ao abrir o caixa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=' w-6/12'>
      <Card>
        <CardHeader>
          <CardTitle>Abrir Caixa</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="saldo_inicial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saldo Inicial</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Abrindo...' : 'Abrir Caixa'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
