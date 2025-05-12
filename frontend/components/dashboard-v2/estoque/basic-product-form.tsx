'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Barcode } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { BarcodeScanner } from '@/components/Reusable/BarcodeScanner';
import { useState, useEffect } from 'react';

interface BasicProductFormProps {
  form: UseFormReturn<any>;
  categories: { id: number; name: string }[];
  productTypes: string[];
  generateUniqueBarcode: () => Promise<void>;
}

// Função para formatar valor para exibição (ex: 10.5 -> "10,50")
const formatCurrencyDisplay = (value: string | number): string => {
  if (value === '' || value === undefined || value === null) return '';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return '';

  return numValue.toFixed(2).replace('.', ',');
};

// Função para converter string formatada para número (ex: "10,50" -> 10.5)
const parseCurrencyValue = (displayValue: string): string => {
  // Remove tudo que não for número ou vírgula
  const cleanValue = displayValue.replace(/[^\d,]/g, '');

  // Substitui vírgula por ponto para conversão para número
  const numericValue = cleanValue.replace(',', '.');

  // Retorna o valor como string para o campo
  return numericValue;
};

export function BasicProductForm({
  form,
  categories,
  productTypes,
  generateUniqueBarcode,
}: BasicProductFormProps) {
  // Estados para controlar os valores formatados
  const [purchasePriceDisplay, setPurchasePriceDisplay] = useState('');
  const [sellingPriceDisplay, setSellingPriceDisplay] = useState('');

  // Inicializa os valores formatados
  useEffect(() => {
    const purchasePrice = form.getValues('purchase_price');
    const sellingPrice = form.getValues('selling_price');

    setPurchasePriceDisplay(formatCurrencyDisplay(purchasePrice));
    setSellingPriceDisplay(formatCurrencyDisplay(sellingPrice));
  }, [form]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código de Barras</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="Código do produto"
                    {...field}
                    className="flex-1"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateUniqueBarcode}
                  title="Gerar código de barras"
                >
                  <Barcode className="h-4 w-4" />
                </Button>
                <BarcodeScanner
                  onScan={(result) => {
                    form.setValue('code', result);
                  }}
                  buttonSize="sm"
                />
              </div>
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
              <Textarea
                placeholder="Descrição detalhada do produto"
                {...field}
                className="resize-none"
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <FormControl>
                <Input placeholder="Marca do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="categoria_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="purchase_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço de Compra</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    type="text"
                    placeholder="0,00"
                    className="pl-8"
                    value={purchasePriceDisplay}
                    onChange={(e) => {
                      // Atualiza o display
                      setPurchasePriceDisplay(e.target.value);

                      // Converte para valor numérico e atualiza o formulário
                      const numericValue = parseCurrencyValue(e.target.value);
                      field.onChange(numericValue);
                    }}
                    onBlur={() => {
                      // Formata o valor ao perder o foco
                      const value = field.value || '0';
                      setPurchasePriceDisplay(formatCurrencyDisplay(value));
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selling_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço de Venda</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    type="text"
                    placeholder="0,00"
                    className="pl-8"
                    value={sellingPriceDisplay}
                    onChange={(e) => {
                      // Atualiza o display
                      setSellingPriceDisplay(e.target.value);

                      // Converte para valor numérico e atualiza o formulário
                      const numericValue = parseCurrencyValue(e.target.value);
                      field.onChange(numericValue);
                    }}
                    onBlur={() => {
                      // Formata o valor ao perder o foco
                      const value = field.value || '0';
                      setSellingPriceDisplay(formatCurrencyDisplay(value));
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  min="0"
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                Calculado automaticamente a partir do estoque das variantes
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
