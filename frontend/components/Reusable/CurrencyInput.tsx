import { use, useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

// Componente reutilizável para valores monetários
export function CurrencyInput({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: number | string;
  onChange: (newValue: number) => void;
  description?: string;
}) {
  const [localValue, setLocalValue] = useState<number>(0);
  const handleCurrencyInput = () => {

  };
  useEffect(() => {
    onChange(+localValue);
  }, [localValue]);

  useEffect(() =>{
    setLocalValue(+value)
  },[])

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-base font-semibold">{label}</Label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          R$
        </span>
        <Input
          type="text"
          className="pl-8"
          value={Number(localValue?.toLocaleString('pt-BR'))}
          onChange={(e) => {
            const newValue = Number(e.target.value.replace(/\D/g, ''));
            setLocalValue(newValue)
          }}
        />
      </div>
    </div>
  );
}
