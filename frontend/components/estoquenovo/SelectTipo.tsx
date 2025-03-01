'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '../ui/label';
import { useProductStore } from '@/stores/productStore';
import { useEffect, useState } from 'react';
// import { useProductStore } from '@/stores/createProductStore';

export default function SelectTipoProduto({
  onChange,
  initialValue
}: {
  onChange: (value: string) => void;
  initialValue: string;
}) {
  const { setTipoProduto, tipoProduto, product } = useProductStore();

  const [tipoInicial, setTipoInicial] = useState<string>(initialValue)

  const handleTipoProduto = (value: string) => {
    onChange(value);
    if (product) {
      console.log('TIPO DO PRODUTO A SER EDITADO' + product.type);
      setTipoProduto(product?.type || '');
    } else {
      setTipoProduto('');
    }
    setTipoProduto(value);
  };

  useEffect(() => {
    setTipoProduto(product?.type);
  }, [product]);

  return (
    <div className="flex flex-col gap-4 mb-4">
      <Label className="text-base font-semibold">Tipo de Produto</Label>
      <Select
        value={tipoInicial}
        onValueChange={(value) => handleTipoProduto(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tipo de Produto</SelectLabel>
            <SelectItem value="sapato">Sapato</SelectItem>
            <SelectItem value="roupa">Roupa</SelectItem>
            <SelectItem value="acessorio">Acessório</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
